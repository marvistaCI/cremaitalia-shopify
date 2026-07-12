/* ============================================================
   Crema Italia — Storefront (POC3) interactions
   SPA navigation, catalog rendering from baked-in test data,
   3-axis filtering, taste quiz, sign-in, mock cart, account.

   Production note: the catalog render functions are replaced by
   Liquid loops over real products/metafields; the cart + checkout
   become Shopify cart + Shopify Checkout; the subscription toggle
   binds to native selling_plan_groups (Loop). Search for "PROD:" /
   "LOOP:" for the seams.
   ============================================================ */
(function () {
  'use strict';

  var CATALOG = { roasters: [], products: [] };
  var byHandle = {};
  var roasterByHandle = {};
  var peopleById = {};

  // ---- filter + quiz + session state ----
  var activeRegion = 'all', activeShelf = 'all';
  var activeTaste = { roast: 'all', flavor: 'all', caffeine: 'all' };
  var quizAnswers = { roast: null, flavor: null, caffeine: null };
  // foundingForfeited = the Founding 12% was permanently forfeited by a deliberate full
  // cancel (pause/dunning never forfeit). paused = subscription paused (rate preserved).
  // PROD: this entitlement is a Shopify Function reading a one-way customer tag flipped by
  // Loop webhooks — not theme state. Faked here to demo the two Membership tile states.
  var session = { signedIn: false, subscriber: false, foundingMember: false, foundingForfeited: false, paused: false, firstTime: true, name: 'Steve R.' };
  var cart = [];
  // filterOn = taste filtering currently applied; savedTaste != null = a profile exists.
  var filterOn = false, savedTaste = null, pendingSaveProfile = false;
  var pendingQuizAction = null; // null | 'matches' | 'everything' — set by the quiz result buttons

  var FREE_SHIP_THRESHOLD = 55;

  var FLAVOR_LABEL = { fruit: 'Fruit & Floral', sweet: 'Sweet & Chocolate', terroir: 'Bold & Spiced', any: '' };
  // Info-only descriptors shown under the selected Flavor filter (curator-assigned tags).
  var FLAVOR_DESC = {
    fruit: 'Citrus, berry, stone fruit, jasmine, bergamot, black tea.',
    sweet: 'Milk or dark chocolate, hazelnut, caramel, brown sugar, almond.',
    terroir: 'Pipe tobacco, baking spice, toasted grain, dried fig or raisin, walnut, cedar.'
  };
  var SHELF_BADGE = {
    roccia:    { cls: 'sr', tag: 'Roccia · Subscription', shelfTag: 'Roccia' },
    sorpresa:  { cls: 'ss', tag: 'Sorpresa · Discovery',   shelfTag: 'Sorpresa' },
    selezione: { cls: 'sl', tag: 'Selezione · Premium',    shelfTag: 'Selezione' },
    offerta:   { cls: 'so', tag: 'Offerta · Opportunity',  shelfTag: 'Offerta' },
    bottega:   { cls: 'sb', tag: 'Bottega',                shelfTag: 'Bottega' }
  };

  // Quiz-outcome persona matrix — single source of truth for result-screen naming.
  // Keyed by tuple (Q1 roast: light/medium/dark/any, Q2 flavor-or-'skip') so a future
  // Q3 can fold in as a third key without restructuring. "any" is "Surprise me" on
  // Q1 — a real declaration of no roast preference, not an exception, so it's a full
  // row rather than a special-cased branch (see docs/POC_v4_change_list.md). "sparse"
  // cells are chemically implausible roast/flavor pairings — still named, but the
  // matching logic relaxes to roast-only (see isSparseCombo/applyProfileAndClose) and
  // the subhead is swapped for SUBHEAD_SPARSE.
  var PERSONA_MATRIX = {
    light:  {
      skip:    { persona: 'The Minimalist' },
      fruit:   { persona: 'The Purist' },
      sweet:   { persona: 'The Gentle Sweet' },
      terroir: { persona: 'The Maverick', sparse: true }
    },
    medium: {
      skip:    { persona: 'The Steady Hand' },
      fruit:   { persona: 'The Romantic' },
      sweet:   { persona: 'The Classicist' },
      terroir: { persona: 'The Old Soul' }
    },
    dark:   {
      skip:    { persona: 'The Traditionalist' },
      fruit:   { persona: 'The Contrarian', sparse: true },
      sweet:   { persona: 'The Indulgent' },
      terroir: { persona: 'The Devotee' }
    },
    // No roast preference declared ("Surprise me"). Names aren't part of Steve's
    // original spec — picked to echo each flavor card's own descriptor copy
    // (Fruit & Flowers: "coffee as a perfume"; Bold & Spiced: "a sense of where it
    // came from") so they read as a family with the rest. Flag if you want these
    // renamed.
    any: {
      skip:    { persona: 'The Open Palate' },
      fruit:   { persona: 'The Perfumer' },
      sweet:   { persona: 'The Sweet Tooth' },
      terroir: { persona: 'The Wanderer' }
    }
  };
  var SUBHEAD_ROAST_ONLY = "You know your roast; we'll help you find your flavor.";
  var SUBHEAD_DEFAULT = 'We have filtered the catalog to show your best matches.';
  var SUBHEAD_SPARSE = 'This is a rarer combination — here are the closest matches in our current catalog.';
  var SUBHEAD_NONE = "You're open to anything — we'll show you the full range, curator's choice first.";

  function isSparseCombo(roast, flavor) {
    var cell = roast && flavor && PERSONA_MATRIX[roast] && PERSONA_MATRIX[roast][flavor];
    return !!(cell && cell.sparse);
  }
  function getQuizResult() {
    var roastKey = PERSONA_MATRIX.hasOwnProperty(quizAnswers.roast) ? quizAnswers.roast : 'any';
    var flavorKey = quizAnswers.flavor || 'skip';
    var cell = PERSONA_MATRIX[roastKey][flavorKey];
    var persona = cell.persona;
    var subhead;
    if (roastKey === 'any' && flavorKey === 'skip') subhead = SUBHEAD_NONE;
    else if (flavorKey === 'skip') subhead = SUBHEAD_ROAST_ONLY;
    else if (cell.sparse) subhead = SUBHEAD_SPARSE;
    else subhead = SUBHEAD_DEFAULT;
    // Decaf is a strong, specific declaration Steve wants surfaced by name regardless
    // of roast/flavor — overrides the persona label only, not the matching logic.
    if (quizAnswers.caffeine === 'decaf') persona = 'The Decaf Discoverer';
    return { persona: persona, subhead: subhead, sparse: !!cell.sparse };
  }

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function money(n) { return '$' + Number(n).toFixed(2); }
  function imgStyle(img) { return img && img.style ? ' style="' + img.style + '"' : ''; }
  function imgCls(img) { return img && img.cls ? img.cls : ''; }

  function priceFrom(p) { return p.sizes && p.sizes.length ? p.sizes[0].price : 0; }
  function sizesLine(p) {
    if (p.shelf === 'sorpresa') return 'One-time';
    if (p.shelf === 'selezione') return p.scarcity || 'One-time';
    if (p.shelf === 'offerta') return 'One-time only';
    if (p.shelf === 'bottega') return p.category || '';
    return (p.sizes || []).map(function (s) { return s.size; }).join(' · ');
  }
  function priceCell(p) {
    var first = p.sizes && p.sizes[0] ? p.sizes[0] : { price: 0, size: '' };
    var unit = p.price_unit || ('/' + first.size);
    if (p.shelf === 'offerta' && first.original) {
      return '<span class="po">' + money(first.original) + '</span>' + money(first.price);
    }
    if (p.shelf === 'bottega') return money(first.price);
    if (p.sizes && p.sizes.length > 1) {
      return 'From ' + money(first.price) + ' <span class="cpu">' + esc(unit) + '</span>';
    }
    return money(first.price) + ' <span class="cpu">' + esc(unit) + '</span>';
  }
  function freshnessCell(p) {
    if (p.shelf === 'bottega') return '';
    if (p.shelf === 'sorpresa') return '<div class="freshness">' + esc(p.freshness_note || 'Assembled to order') + '</div>';
    if (p.shelf === 'offerta') return '<div class="freshness fw">' + esc(p.freshness_remaining || 'Sold as-is') + ' · sold as-is</div>';
    if (p.shelf === 'selezione' && p.low_inventory) return '<div class="freshness fw">Low inventory · ' + p.low_inventory + ' left</div>';
    return '<div class="freshness">Best within 60 days of roast</div>';
  }
  function rnLine(p) {
    if (p.shelf === 'bottega') return '';
    if (!p.roaster) return esc(p.roaster_label || 'Crema Italia curated selection');
    var r = roasterByHandle[p.roaster];
    var town = r ? r.town : '';
    var taste = p.caffeine === 'decaf' ? 'Decaf' : (FLAVOR_LABEL[p.flavor] || '');
    return [town, p.roast_level, taste].filter(Boolean).map(esc).join(' · ');
  }

  // ---------- card renderers ----------
  // Tiles show a SINGLE placeholder image on every shelf (POC5 decision 2026-07-10):
  // multi-photo browsing lives ONLY on the product detail page (see the pd-gallery in
  // productDetail). Clicking a tile just opens the product (Option B navigation) — no
  // photo-changer on tiles.
  // Region display labels (filter value -> label).
  var REGION_LABEL = { toscana: 'Toscana', emilia: 'Emilia-Romagna', piemonte: 'Piemonte', sicilia: 'Sicilia' };
  function uniq(a) { var seen = {}, out = []; for (var i = 0; i < a.length; i++) { var v = a[i]; if (v && !seen[v]) { seen[v] = 1; out.push(v); } } return out; }
  // A product's filter facets. A bundle/Tour is a BOM SKU (box + component coffees + card):
  // it inherits the UNION of its components' facets, so it is "positive" to a filter if ANY
  // component matches (per-axis; AND across axes). See docs/production_build_spec.md for the
  // administrable BOM-builder requirement this stands in for. A single product carries its
  // own single value.
  function productFacets(p) {
    if (Array.isArray(p.component_handles) && p.component_handles.length) {
      var comps = p.component_handles.map(function (h) { return byHandle[h]; }).filter(Boolean);
      return {
        region: uniq(comps.map(function (c) { return c.region; })),
        roast: uniq(comps.map(function (c) { return c.roast; })),
        flavor: uniq(comps.map(function (c) { return c.flavor; })),
        caffeine: uniq(comps.map(function (c) { return c.caffeine; }))
      };
    }
    return { region: [p.region], roast: [p.roast], flavor: [p.flavor], caffeine: [p.caffeine] };
  }
  // Membership test for a comma-joined data-attribute (multi-value facet).
  function inFacet(csv, val) { return !!csv && csv.split(',').indexOf(val) !== -1; }
  function productCard(p) {
    var badge = SHELF_BADGE[p.shelf] || { cls: '', tag: '' };
    var f = productFacets(p);
    var isBom = Array.isArray(p.component_handles) && p.component_handles.length;
    var bomCue = isBom
      ? '<div class="rn bom-cue">Includes ' + f.region.map(function (r) { return REGION_LABEL[r] || r; }).join(' · ') + '</div>'
      : '';
    return '<div class="card product-card" data-region="' + esc(f.region.join(',')) + '" data-shelf="' + esc(p.shelf) +
      '" data-roast="' + esc(f.roast.join(',')) + '" data-flavor="' + esc(f.flavor.join(',')) + '" data-caffeine="' + esc(f.caffeine.join(',')) +
      '" onclick="openProduct(\'' + p.handle + '\')">' +
      '<div class="card-img ' + imgCls(p.img) + '"' + imgStyle(p.img) + '>' + esc(p.img ? p.img.label : p.title) + '</div>' +
      '<div class="card-body">' +
        '<span class="cs ' + badge.cls + '">' + esc(badge.tag) + '</span>' +
        '<h3>' + esc(p.display_title) + '</h3>' +
        (rnLine(p) ? '<div class="rn">' + rnLine(p) + '</div>' : '') +
        bomCue +
        '<p>' + esc(p.blurb) + '</p>' +
        freshnessCell(p) +
      '</div>' +
      '<div class="card-footer"><span class="cp">' + priceCell(p) + '</span><span class="csz">' + esc(sizesLine(p)) + '</span></div>' +
      '</div>';
  }
  function bottegaCard(p) {
    return '<div class="card product-card" data-shelf="bottega" onclick="openProduct(\'' + p.handle + '\')">' +
      '<div class="card-img b">' + esc(p.img ? p.img.label : p.title) + '</div>' +
      '<div class="card-body"><span class="cs sb">Bottega</span><h3>' + esc(p.display_title) + '</h3><p>' + esc(p.blurb) + '</p></div>' +
      '<div class="card-footer"><span class="cp">' + money(priceFrom(p)) + '</span><span class="csz">' + esc(p.category || '') + '</span></div>' +
      '</div>';
  }
  function roasterHomeCard(r) {
    return '<div class="card" onclick="openRoaster(\'' + r.handle + '\')">' +
      '<div class="card-img ' + (r.portrait_cls || '') + '"' + (r.portrait_style ? ' style="' + r.portrait_style + '"' : '') + '>' + esc(r.label) + '</div>' +
      '<div class="card-body"><span class="eyebrow">' + esc(r.town) + '</span><h3>' + esc(r.name) + '</h3><p>' + esc(r.blurb) + '</p></div>' +
      '</div>';
  }
  function roasterRow(r) {
    return '<div class="roaster-row" onclick="openRoaster(\'' + r.handle + '\')">' +
      '<div class="roaster-portrait ' + (r.portrait_cls || '') + '"' + (r.portrait_style ? ' style="' + r.portrait_style + '"' : '') + '>' + esc(r.label) + '</div>' +
      '<div><span class="eyebrow">' + esc(r.region_label) + ' · founded ' + r.founded + '</span><h3>' + esc(r.name) + '</h3>' +
      '<p style="color:var(--ci-ink-soft);font-size:.92rem;margin:0">' + esc(r.blurb) + '</p></div></div>';
  }

  function productsByShelf(shelf) { return CATALOG.products.filter(function (p) { return p.shelf === shelf; }); }

  // ---------- initial render ----------
  function renderAll() {
    if ($('home-roasters')) $('home-roasters').innerHTML = CATALOG.roasters.map(roasterHomeCard).join('');
    if ($('roaster-list')) $('roaster-list').innerHTML = CATALOG.roasters.map(roasterRow).join('');
    if ($('shop-grid')) $('shop-grid').innerHTML = CATALOG.products
      .filter(function (p) { return p.shelf !== 'bottega'; }).map(productCard).join('');
    if ($('grid-roccia')) $('grid-roccia').innerHTML = productsByShelf('roccia').map(productCard).join('');
    if ($('grid-selezione')) $('grid-selezione').innerHTML = productsByShelf('selezione').map(productCard).join('');
    if ($('grid-offerta')) $('grid-offerta').innerHTML = productsByShelf('offerta').map(productCard).join('');
    if ($('grid-bottega')) $('grid-bottega').innerHTML = productsByShelf('bottega').map(bottegaCard).join('');
  }

  // ---------- SPA navigation ----------
  // SPA navigation history — a simple stack so "Back" returns to the ACTUAL previous page
  // (not a fixed parent). Forward navigations push; goBack pops. Falls back to home.
  var navStack = [], navCurrent = 'home';
  window.goBack = function () { showPage(navStack.length ? navStack.pop() : 'home', true); };
  window.showPage = function (name, isBack) {
    if (!isBack && name !== navCurrent) navStack.push(navCurrent);
    navCurrent = name;
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
    var t = $('page-' + name);
    if (t) { t.classList.add('active'); window.scrollTo(0, 0); }
    var navBtns = document.querySelectorAll('nav button[id^="nav-"]');
    for (var j = 0; j < navBtns.length; j++) navBtns[j].classList.remove('active');
    var navKey = name;
    if (['roccia', 'sorpresa', 'selezione', 'offerta', 'product', 'cart'].indexOf(name) !== -1) navKey = 'shop';
    if (name === 'roaster') navKey = 'roasters';
    if (name === 'person') navKey = 'about';
    var nb = $('nav-' + navKey);
    if (nb) nb.classList.add('active');
    // Persist the active taste profile onto shelf landing pages reached from the Shop dropdown.
    if (['roccia', 'selezione', 'offerta'].indexOf(name) !== -1) applyTasteToGrid('grid-' + name);
    // The ribbon shows only on shopping surfaces, and only when a profile exists.
    updateRibbon(name);
  };

  // Smooth in-page scroll for the home-page sticky jump-chips.
  window.jumpHome = function (id) {
    var e = document.getElementById(id);
    if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.openRoaster = function (handle) {
    var r = roasterByHandle[handle];
    if (!r) return;
    $('roaster-eyebrow').textContent = r.region_label + ' · founded ' + r.founded;
    $('roaster-name').textContent = r.name;
    var logo = $('roaster-logo');
    if (logo) {
      logo.className = 'roaster-portrait ' + (r.portrait_cls || '');
      logo.setAttribute('style', r.portrait_style || '');
      logo.textContent = r.label;
    }
    $('roaster-bio').innerHTML = (r.bio || []).map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('');
    $('roaster-bags-head').textContent = 'Available from ' + r.name.split(' ')[0];
    // Show this roaster's coffee from all four shelves — including bundle/Tour
    // products that name this roaster via the structured `roasters` array rather
    // than the single `roaster` field. Bottega has no `roaster` field, so it's
    // naturally excluded without a shelf allowlist. See docs/POC_v4_change_list.md
    // item 12.
    var bags = CATALOG.products.filter(function (p) {
      return p.roaster === handle || (Array.isArray(p.roasters) && p.roasters.indexOf(handle) !== -1);
    });
    $('roaster-bags').innerHTML = bags.length ? bags.map(productCard).join('') :
      '<p class="prose" style="max-width:65ch">New bags from this roaster are on the way.</p>';
    var findEl = $('roaster-find');
    if (findEl) {
      var mapsHref = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(r.address || r.find || r.name);
      findEl.innerHTML =
        (r.address ? '<a href="' + mapsHref + '" target="_blank" rel="noopener">' + esc(r.address) + '</a><br>' : '') +
        (r.website ? esc(r.website) : '') +
        (r.website && r.phone ? ' · ' : '') +
        (r.phone ? esc(r.phone) : '');
    }
    showPage('roaster');
  };

  // Reusable team/partner detail page — populate the single #page-person container
  // with the clicked person's record, then show it. Mirrors openRoaster.
  window.openPerson = function (id) {
    var pn = peopleById[id];
    if (!pn) return;
    $('person-group').textContent = pn.group === 'partner' ? 'Our partners' : 'Our team';
    $('person-name').textContent = pn.name;
    $('person-role-hero').textContent = pn.role || '';
    var photo = $('person-photo');
    if (photo) {
      if (pn.photo) {
        // PROD: real headshot/logo — swap the lettered placeholder for the image.
        var purl = (window.CI_ASSETS && window.CI_ASSETS[pn.photo]) || pn.photo;
        photo.style.background = 'center/cover no-repeat url(' + purl + ')';
        photo.textContent = '';
      } else {
        photo.style.background = '';
        photo.textContent = pn.name;
      }
    }
    $('person-bio').innerHTML = (pn.bio || []).map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('');
    showPage('person');
  };

  window.openProduct = function (handle) {
    var p = byHandle[handle];
    if (!p) return;
    $('product-detail').innerHTML = productDetail(p);
    initPdGallery();
    showPage('product');
  };

  // ---------- product-detail photo gallery (POC5) ----------
  // The one place multi-photo lives. Placeholder slides (front / back / label close-up)
  // until real per-SKU photography exists. Finger-first: swipe, tap the left/right half of
  // the image, arrows, and a thumbnail strip — all drive the same main image, looping.
  var pdSlides = [], pdIdx = 0;
  function pdGalleryHtml(p) {
    pdSlides = [p.img ? p.img.label : p.title, 'Back of bag', 'Label close-up'];
    pdIdx = 0;
    var thumbs = pdSlides.map(function (s, i) {
      return '<button class="pd-gthumb' + (i === 0 ? ' active' : '') + '" onclick="pdGalleryTo(' + i + ')" aria-label="Photo ' + (i + 1) + '">' + esc(s) + '</button>';
    }).join('');
    return '<div class="pd-gallery" id="pd-gallery">' +
      '<div class="pd-img card-img ' + imgCls(p.img) + '" id="pd-gmain"' + imgStyle(p.img) + ' onclick="pdGalleryTap(event)">' +
        '<button class="pd-gnav pd-gprev" onclick="pdGallery(-1)" aria-label="Previous photo">&#8249;</button>' +
        '<span class="pd-gslide" id="pd-gslide">' + esc(pdSlides[0]) + '</span>' +
        '<button class="pd-gnav pd-gnext" onclick="pdGallery(1)" aria-label="Next photo">&#8250;</button>' +
      '</div>' +
      '<div class="pd-gthumbs">' + thumbs + '</div>' +
    '</div>';
  }
  window.pdGalleryTo = function (i) {
    if (!pdSlides.length) return;
    pdIdx = (i + pdSlides.length) % pdSlides.length;
    var slide = document.getElementById('pd-gslide');
    if (slide) slide.textContent = pdSlides[pdIdx];
    var thumbs = document.querySelectorAll('.pd-gthumb');
    for (var t = 0; t < thumbs.length; t++) thumbs[t].classList.toggle('active', t === pdIdx);
  };
  window.pdGallery = function (dir) { pdGalleryTo(pdIdx + dir); };
  window.pdGalleryTap = function (e) {
    if (e.target.closest('.pd-gnav') || e.target.closest('.pd-gthumb')) return;
    var rect = e.currentTarget.getBoundingClientRect();
    pdGallery((e.clientX - rect.left) < rect.width / 2 ? -1 : 1);
  };
  function initPdGallery() {
    var area = document.getElementById('pd-gmain');
    if (!area) return;
    var sx = 0, on = false;
    area.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; on = true; }, { passive: true });
    area.addEventListener('touchend', function (e) {
      if (!on) return; on = false;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) pdGallery(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  function productDetail(p) {
    var badge = SHELF_BADGE[p.shelf] || { cls: '', tag: '' };
    var img = pdGalleryHtml(p);

    // Bottega: simple detail.
    if (p.shelf === 'bottega') {
      return '<div class="pd-grid">' + img + '<div>' +
        '<span class="cs sb">Bottega</span>' +
        '<h1 class="pd-title">' + esc(p.display_title) + '</h1>' +
        '<p class="prose" style="max-width:none">' + esc(p.blurb) + '</p>' +
        '<p class="pd-price">' + money(priceFrom(p)) + '</p>' +
        '<button class="btn btn-primary" style="width:100%;margin-top:1rem" onclick="addToCart(\'' + p.handle + '\',\'' + esc(p.sizes[0].size) + '\',false,null)">Add to cart</button>' +
        '<p class="afd" style="border:none">Bottega items are never subscriber-discounted and are not part of the four coffee shelves.</p>' +
        '</div></div>';
    }

    var notePills = (p.notes || []).map(function (n) { return '<span class="pill" style="cursor:default">' + esc(n) + '</span>'; }).join('');
    var roasterLine = p.roaster
      ? '<button class="back-btn" style="margin:0 0 1rem" onclick="openRoaster(\'' + p.roaster + '\')">by ' + esc((roasterByHandle[p.roaster] || {}).name) + '</button>'
      : '<div class="rn" style="margin:.25rem 0 1rem">' + esc(p.roaster_label || 'Crema Italia curated selection') + '</div>';

    var meta = '';
    if (p.origin) meta += '<p class="prose" style="max-width:none">Origin: ' + esc(p.origin) + (p.process ? ' · ' + esc(p.process) + ' process' : '') + (p.roast_level ? ' · ' + esc(p.roast_level) + ' roast.' : '') + '</p>';
    if (p.roast_date) meta += '<p style="font-size:.9rem;color:var(--ci-espresso);margin:.5rem 0"><strong>Roast date:</strong> ' + esc(p.roast_date) + ' · <strong>Best by:</strong> ' + esc(p.best_by) + '</p>';
    meta += '<div class="freshness" style="margin:.5rem 0">Best within 60 days of roast date. For peak flavor, brew within 30 days.</div>';

    var components = p.components ? '<p class="prose" style="max-width:none;margin-top:.5rem"><strong>In the box:</strong> ' + p.components.map(esc).join(' · ') + '. Printed tasting card included.</p>' : '';

    // size selector
    var sizes = p.sizes || [];
    var sizePills = sizes.map(function (s, i) {
      return '<span class="pill' + (i === 0 ? ' active' : '') + '" data-size="' + esc(s.size) + '" data-price="' + s.price + '" onclick="selectSize(this)">' + esc(s.size) + '</span>';
    }).join('');
    var sizeSelector = sizes.length > 1
      ? '<div class="filter-group" style="margin:1rem 0"><div class="filter-label">Bag size</div><div class="filter-pills" id="pd-sizes">' + sizePills + '</div></div>'
      : '<div class="filter-pills" id="pd-sizes" style="margin:1rem 0"><span class="pill active" data-size="' + esc(sizes[0].size) + '" data-price="' + sizes[0].price + '" style="cursor:default">' + esc(sizes[0].size) + '</span></div>';

    var priceHtml = p.shelf === 'offerta' && sizes[0].original
      ? '<p class="pd-price" id="pd-price"><span class="po">' + money(sizes[0].original) + '</span>' + money(sizes[0].price) + '</p>'
      : '<p class="pd-price" id="pd-price">' + (sizes.length > 1 ? 'From ' : '') + money(sizes[0].price) + ' <span class="cpu">/' + esc(sizes[0].size) + '</span></p>';

    // Roccia subscription toggle (binds to selling_plan_groups in production — LOOP)
    var subBlock = '';
    if (p.subscription) {
      subBlock =
        '<div class="sub-toggle"><input type="checkbox" id="pd-sub" onchange="toggleSub(this)">' +
        '<div class="sub-toggle-text"><h4>Make this a Roccia subscription</h4>' +
        '<p>10% off every shipment, free shipping, plus subscriber benefits across the site. Cancel anytime. Default is a one-time purchase.</p></div></div>' +
        '<div class="cadence" id="pd-cadence"><div class="filter-label">Delivery cadence</div>' +
        '<div class="filter-pills">' +
        '<span class="pill active" data-weeks="4" onclick="selectCadence(this)">Every 4 weeks</span>' +
        '<span class="pill" data-weeks="6" onclick="selectCadence(this)">Every 6 weeks</span>' +
        '<span class="pill" data-weeks="8" onclick="selectCadence(this)">Every 8 weeks</span>' +
        '</div></div>';
    }

    var about = '<div class="section-head"><p class="eyebrow">About this coffee</p><h2>Notes</h2></div>' +
      '<div class="prose" style="max-width:72ch"><p>' + esc(p.long || p.blurb) + '</p>' +
      (p.brewing ? '<p><strong>Brewing:</strong> ' + esc(p.brewing) + '</p>' : '') + '</div>';

    return '<div class="pd-grid">' + img + '<div data-handle="' + p.handle + '">' +
      '<span class="cs ' + badge.cls + '">' + esc(badge.tag) + '</span>' +
      '<h1 class="pd-title">' + esc(p.title) + '</h1>' +
      roasterLine +
      (notePills ? '<div class="filter-pills" style="margin-bottom:1rem">' + notePills + '</div>' : '') +
      meta + components +
      sizeSelector +
      priceHtml +
      subBlock +
      '<button class="btn btn-primary" style="width:100%;margin-top:1rem" onclick="addToCartFromDetail(\'' + p.handle + '\')">Add to cart</button>' +
      '</div></div>' + about;
  }

  // size / cadence / sub interactions on product detail
  window.selectSize = function (el) {
    var wrap = el.closest('.filter-pills');
    var pills = wrap.querySelectorAll('.pill');
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
    el.classList.add('active');
    var price = el.getAttribute('data-price');
    var pd = $('pd-price');
    if (pd) pd.innerHTML = money(price) + ' <span class="cpu">/' + esc(el.getAttribute('data-size')) + '</span>';
  };
  window.toggleSub = function (cb) {
    var c = $('pd-cadence');
    if (c) c.classList.toggle('show', cb.checked);
  };
  window.selectCadence = function (el) {
    var pills = el.closest('.filter-pills').querySelectorAll('.pill');
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
    el.classList.add('active');
  };
  window.addToCartFromDetail = function (handle) {
    var sizeEl = document.querySelector('#pd-sizes .pill.active');
    var size = sizeEl ? sizeEl.getAttribute('data-size') : '';
    var subEl = $('pd-sub');
    var isSub = !!(subEl && subEl.checked);
    var cadEl = document.querySelector('#pd-cadence .pill.active');
    var cadence = isSub && cadEl ? cadEl.getAttribute('data-weeks') : null;
    addToCart(handle, size, isSub, cadence);
  };

  // ---------- filtering ----------
  // Shelf + Region are ephemeral navigation (not saved). Taste is the profile axis,
  // saved to the account and applied via the ribbon/console. `filterOn` gates whether
  // the taste axis is currently applied; `savedTaste != null` means a profile EXISTS
  // (which is what makes the ribbon appear at all — no profile, no ribbon).
  var ALL_TASTE = { roast: 'all', flavor: 'all', caffeine: 'all' };
  window.filterRegion = function (el, val) { activeRegion = val; setActive(el); applyFilters(); };
  window.filterShelf = function (el, val) { activeShelf = val; setActive(el); applyFilters(); };

  function tasteTagsHtml(t) {
    var lbl = { roast: { light: 'Light Roast', medium: 'Medium Roast', dark: 'Dark Roast' }, flavor: FLAVOR_LABEL, caffeine: { full: 'Caffeinated', decaf: 'Decaf' } };
    var tags = [];
    if (t && t.roast && t.roast !== 'all') tags.push(lbl.roast[t.roast]);
    if (t && t.flavor && t.flavor !== 'all') tags.push(lbl.flavor[t.flavor]);
    if (t && t.caffeine && t.caffeine !== 'all') tags.push(lbl.caffeine[t.caffeine]);
    return tags.filter(Boolean).map(function (x) { return '<span class="profile-tag">' + esc(x) + '</span>'; }).join('');
  }

  // ---------- taste-profile ribbon ----------
  // The ribbon is global (rendered once) but only visible on the Shop + shelf pages,
  // and only when a profile exists. renderRibbon() paints its state; updateRibbon()
  // decides whether it shows on the current page.
  var SHOP_PAGES = ['shop', 'roccia', 'sorpresa', 'selezione', 'offerta'];
  function renderRibbon() {
    var r = $('taste-ribbon'); if (!r) return;
    r.classList.toggle('is-active', filterOn);
    var s = $('tr-status'), tg = $('tr-tags'), tb = $('tr-toggle');
    if (s) s.textContent = filterOn
      ? 'Your taste profile is active — shelves are filtered to your preferences.'
      : 'Your profile is not active — all items are shown.';
    if (tb) tb.textContent = filterOn ? 'Show everything' : 'Apply profile';
    if (tg) { tg.innerHTML = tasteTagsHtml(activeTaste); tg.classList.toggle('muted', !filterOn); }
  }
  function updateRibbon(pageName) {
    var r = $('taste-ribbon'); if (!r) return;
    var show = !!savedTaste && SHOP_PAGES.indexOf(pageName) !== -1;
    r.classList.toggle('ribbon-visible', show);
    if (show) renderRibbon();
  }
  // Ribbon toggle: flip taste filtering on/off (the saved profile is kept either way).
  window.toggleProfileFilter = function () {
    filterOn = !filterOn;
    applyTasteEverywhere();
    renderRibbon();
  };

  // ---------- taste console (modal editor, opened from the ribbon's "Edit profile") ----------
  var consoleDirty = false;
  window.openTasteConsole = function () {
    syncConsolePills();
    updateConsoleFlavorDesc();
    consoleDirty = false;
    var f = $('tc-modal-foot'); if (f) f.classList.remove('dirty');
    $('taste-console-modal').classList.add('active');
  };
  window.closeTasteConsole = function () { $('taste-console-modal').classList.remove('active'); };
  // Console pills only STAGE a change into activeTaste — nothing hits the grid until the
  // customer chooses Apply (ephemeral) or Save my changes (persist). The two buttons
  // only appear once a change is made (consoleDirty).
  window.consoleTaste = function (el, axis, val) {
    activeTaste[axis] = val; setActiveAll(el);
    if (axis === 'flavor') updateConsoleFlavorDesc();
    consoleDirty = true;
    var f = $('tc-modal-foot'); if (f) f.classList.add('dirty');
  };
  function syncConsolePills() {
    document.querySelectorAll('#taste-console-modal .filter-pills .pill').forEach(function (pill) {
      var m = (pill.getAttribute('onclick') || '').match(/consoleTaste\(this,'(\w+)','(\w+)'\)/);
      if (!m) return;
      pill.classList.toggle('active', m[2] === (activeTaste[m[1]] || 'all'));
    });
  }
  function updateConsoleFlavorDesc() {
    var el = $('tc-flavor-desc'); if (!el) return;
    var d = FLAVOR_DESC[activeTaste.flavor];
    if (d) { el.textContent = d; el.classList.add('show'); } else { el.textContent = ''; el.classList.remove('show'); }
  }
  // Apply the console edits as an EPHEMERAL filter — applied now, NOT saved to the profile.
  window.applyEphemeral = function () {
    filterOn = true;
    applyTasteEverywhere();
    renderRibbon();
    closeTasteConsole();
  };
  // Save the console edits to the taste profile (persist) AND apply. Signed-out customers
  // route through sign-in first, then commitProfile() runs on success.
  window.saveProfileChanges = function () {
    if (session.signedIn) { commitProfile(); toast('Saved to your taste profile.'); renderAccount(); closeTasteConsole(); }
    else { pendingSaveProfile = true; closeTasteConsole(); openSignin(); }
  };
  function commitProfile() {
    savedTaste = { roast: activeTaste.roast, flavor: activeTaste.flavor, caffeine: activeTaste.caffeine };
    filterOn = true;
    applyTasteEverywhere();
    updateRibbon(navCurrent);
  }

  // ---------- apply filters to the grids ----------
  // Apply the taste axis to a shelf-page grid (Roccia/Selezione/Offerta). Gated by filterOn.
  function applyTasteToGrid(gridId) {
    var t = filterOn ? activeTaste : ALL_TASTE;
    var cards = document.querySelectorAll('#' + gridId + ' .product-card');
    for (var i = 0; i < cards.length; i++) {
      var d = cards[i].dataset;
      var show =
        (t.roast === 'all' || inFacet(d.roast, t.roast)) &&
        (t.flavor === 'all' || inFacet(d.flavor, t.flavor)) &&
        (t.caffeine === 'all' || inFacet(d.caffeine, t.caffeine));
      cards[i].style.display = show ? '' : 'none';
    }
  }
  function applyProfileToShelves() { ['grid-roccia', 'grid-selezione', 'grid-offerta'].forEach(applyTasteToGrid); }
  function applyTasteEverywhere() { applyFilters(); applyProfileToShelves(); }
  function setActive(el) {
    var pills = el.closest('.filter-pills').querySelectorAll('.pill:not(.disabled)');
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
    el.classList.add('active');
  }
  function setActiveAll(el) {
    var pills = el.closest('.filter-pills').querySelectorAll('.pill');
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
    el.classList.add('active');
  }
  function applyFilters() {
    var t = filterOn ? activeTaste : ALL_TASTE;
    var visible = 0;
    var cards = document.querySelectorAll('#shop-grid .product-card');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], d = c.dataset;
      var show =
        (activeRegion === 'all' || inFacet(d.region, activeRegion)) &&
        (activeShelf === 'all' || d.shelf === activeShelf) &&
        (t.roast === 'all' || inFacet(d.roast, t.roast)) &&
        (t.flavor === 'all' || inFacet(d.flavor, t.flavor)) &&
        (t.caffeine === 'all' || inFacet(d.caffeine, t.caffeine));
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    }
    var nr = $('no-results');
    if (nr) nr.style.display = visible === 0 ? 'block' : 'none';
  }

  // ---------- taste quiz ----------
  window.openQuiz = function () { $('quiz-modal').classList.add('active'); };
  window.closeQuiz = function () {
    $('quiz-modal').classList.remove('active');
    try { localStorage.setItem('ci_quiz_seen', '1'); } catch (e) {}
  };
  window.selectOpt = function (el, step, val) {
    var opts = el.closest('.quiz-options').querySelectorAll('.quiz-opt');
    for (var i = 0; i < opts.length; i++) opts[i].classList.remove('selected');
    el.classList.add('selected');
    quizAnswers[['roast', 'flavor', 'caffeine'][step - 1]] = val;
  };
  window.skipTasteQuestion = function () {
    var opts = document.querySelectorAll('#qstep-2 .quiz-opt');
    for (var i = 0; i < opts.length; i++) opts[i].classList.remove('selected');
    quizAnswers.flavor = null;
    nextStep(3);
  };
  window.nextStep = function (step) {
    var steps = document.querySelectorAll('.quiz-step');
    for (var i = 0; i < steps.length; i++) steps[i].classList.remove('active');
    var id = step === 4 ? 'qstep-result' : 'qstep-' + step;
    var t = $(id);
    if (t) t.classList.add('active');
    for (var k = 1; k <= 3; k++) { var dd = $('qdot-' + k); if (dd) dd.classList.toggle('done', k <= step); }
  };
  window.showQuizResult = function () {
    var lbl = {
      roast: { light: 'Light Roast', medium: 'Medium Roast', dark: 'Dark Roast', any: 'Any Roast' },
      flavor: { fruit: 'Fruit & Floral', sweet: 'Sweet & Chocolate', terroir: 'Bold & Spiced' },
      caffeine: { full: 'Caffeinated', decaf: 'Decaf', both: 'Both' }
    };
    var tags = [];
    if (quizAnswers.roast && quizAnswers.roast !== 'any') tags.push(lbl.roast[quizAnswers.roast]);
    if (quizAnswers.flavor) tags.push(lbl.flavor[quizAnswers.flavor]);
    if (quizAnswers.caffeine && quizAnswers.caffeine !== 'both') tags.push(lbl.caffeine[quizAnswers.caffeine]);
    $('result-tags').innerHTML = tags.map(function (t) { return '<span class="profile-tag">' + esc(t) + '</span>'; }).join('');
    var result = getQuizResult();
    $('result-title').textContent = result.persona;
    var sh = $('result-subhead'); if (sh) sh.textContent = result.subhead;
    nextStep(4);
    var dots = document.querySelectorAll('.quiz-dot');
    for (var i = 0; i < dots.length; i++) dots[i].classList.add('done');
  };
  // "Show me matches": save the quiz answers as the profile AND apply the filter.
  window.applyProfileAndClose = function () {
    if (quizAnswers.roast && quizAnswers.roast !== 'any') activeTaste.roast = quizAnswers.roast;
    // Sparse (near-implausible) roast/flavor pairings relax to roast-only matching so
    // the customer isn't shown a thin or empty result set — see PERSONA_MATRIX comment.
    if (quizAnswers.flavor && !isSparseCombo(quizAnswers.roast, quizAnswers.flavor)) activeTaste.flavor = quizAnswers.flavor;
    if (quizAnswers.caffeine && quizAnswers.caffeine !== 'both') activeTaste.caffeine = quizAnswers.caffeine;
    savedTaste = { roast: activeTaste.roast, flavor: activeTaste.flavor, caffeine: activeTaste.caffeine };
    filterOn = true;
    closeQuiz();
    showPage('shop');
    applyTasteEverywhere();
    updateRibbon('shop');
  };
  // "Show me everything": capture the quiz answers as the profile so we keep the signal,
  // but leave filtering OFF. The ribbon then shows the honest "not active — all items
  // shown" state with a one-tap Apply, instead of claiming a filter that isn't applied
  // (the POC6 bug where "everything" reported the profile as active).
  function captureQuizProfile() {
    savedTaste = {
      roast: (quizAnswers.roast && quizAnswers.roast !== 'any') ? quizAnswers.roast : 'all',
      flavor: quizAnswers.flavor || 'all',
      caffeine: (quizAnswers.caffeine && quizAnswers.caffeine !== 'both') ? quizAnswers.caffeine : 'all'
    };
    activeTaste = { roast: savedTaste.roast, flavor: savedTaste.flavor, caffeine: savedTaste.caffeine };
    filterOn = false;
  }
  function showEverythingFromQuiz() {
    captureQuizProfile();
    closeQuiz();
    showPage('shop');
    applyTasteEverywhere();
    updateRibbon('shop');
  }
  // Both quiz-result choices route through sign-in first — we want to capture the
  // customer's taste profile into their account whenever possible, regardless of
  // which browsing option they pick. See docs/POC_v4_change_list.md.
  window.chooseQuizMatches = function () { pendingQuizAction = 'matches'; closeQuiz(); openSignin(); };
  window.chooseQuizEverything = function () { pendingQuizAction = 'everything'; closeQuiz(); openSignin(); };
  // "Clear filters" (from the no-results empty state): drop the ephemeral Shelf/Region
  // navigation and turn taste filtering off, so everything shows again. The saved
  // profile is KEPT (the ribbon stays, in its off state) — clearing filters is not the
  // same as deleting your profile.
  window.clearProfile = function () {
    filterOn = false;
    activeRegion = 'all'; activeShelf = 'all';
    var groups = document.querySelectorAll('#page-shop .filter-pills');
    for (var g = 0; g < groups.length; g++) {
      var pills = groups[g].querySelectorAll('.pill');
      for (var i = 0; i < pills.length; i++) pills[i].classList.toggle('active', i === 0);
    }
    applyTasteEverywhere();
    renderRibbon();
  };

  // ---------- sign-in ----------
  window.handleAccountClick = function () { if (session.signedIn) showPage('account'); else openSignin(); };
  // Hover-menu dropdowns (Shop, Account) reopen on :hover/:focus-within, which stays
  // true after a click if the cursor hasn't moved off the trigger — so selecting an
  // item didn't close the menu. Force-close on selection, then re-arm once the user's
  // next interaction shows they've moved on. See docs/POC_v4_change_list.md item 2.
  //
  // The old code re-armed ONLY on `mouseleave`. That fires only when a moving pointer
  // physically exits the nav area — so if the cursor stayed inside it after the click
  // (common: the page jumps to top and the trigger sits at the top of that column), or
  // on a touch device (a tablet has no gliding cursor at all), the flag never cleared
  // and the menu went permanently dead (POC6 bug). Re-arm on the FIRST of, then detach:
  //   - mouseleave on the container         (mouse leaves the area)
  //   - pointermove while off the container  (mouse/stylus moves away)
  //   - pointerdown anywhere outside         (a tap elsewhere — the touch case)
  // Pointer events cover mouse, pen, and touch, so this re-arms on PC and tablet alike.
  function forceCloseDropdown(container) {
    if (!container) return;
    container.classList.add('menu-force-closed');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    function rearm() {
      container.classList.remove('menu-force-closed');
      container.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('pointermove', onOutside, true);
      document.removeEventListener('pointerdown', onOutside, true);
    }
    function onLeave() { rearm(); }
    function onOutside(e) { if (!container.contains(e.target)) rearm(); }
    container.addEventListener('mouseleave', onLeave);
    document.addEventListener('pointermove', onOutside, true);
    document.addEventListener('pointerdown', onOutside, true);
  }
  window.closeShopMenu = function () {
    var trigger = $('nav-shop');
    forceCloseDropdown(trigger && trigger.closest('.nav-item'));
  };
  window.closeAccountMenu = function () {
    forceCloseDropdown($('account-wrap'));
  };
  window.openSignin = function () { $('signin-modal').classList.add('active'); };
  window.closeSignin = function () {
    $('signin-modal').classList.remove('active');
    // Dismissed without signing in: still let the customer see the coffee — carry
    // out their quiz choice as a guest instead of stranding them. See item on
    // "capture the user in a profile, if at all possible" in the change list.
    if (pendingQuizAction) {
      var action = pendingQuizAction; pendingQuizAction = null;
      if (action === 'matches') applyProfileAndClose(); else showEverythingFromQuiz();
    }
  };
  window.switchTab = function (tab) {
    var tabs = document.querySelectorAll('.signin-tab');
    tabs[0].classList.toggle('active', tab === 'in');
    tabs[1].classList.toggle('active', tab === 'up');
    $('tab-in').style.display = tab === 'in' ? '' : 'none';
    $('tab-up').style.display = tab === 'up' ? '' : 'none';
  };
  window.simulateSignIn = function () {
    // POC: assume a Founding-Member active subscriber so discounts/portal are visible.
    session.signedIn = true; session.subscriber = true; session.foundingMember = true; session.foundingForfeited = false; session.paused = false;
    $('signin-btn').classList.add('signed-in');
    $('signin-label').textContent = session.name;
    var w = $('account-wrap'); if (w) w.classList.add('is-signed-in');
    // Clear the pending quiz action before closeSignin() runs, so its guest-fallback
    // branch doesn't also fire now that sign-in succeeded.
    var quizAction = pendingQuizAction; pendingQuizAction = null;
    closeSignin();
    renderCart();
    if (quizAction) {
      if (quizAction === 'matches') applyProfileAndClose(); else showEverythingFromQuiz();
      renderAccount();
      return;
    }
    if (pendingSaveProfile) { pendingSaveProfile = false; commitProfile(); toast('Saved to your taste profile.'); renderAccount(); showPage('shop'); return; }
    if (quizAnswers.roast || quizAnswers.flavor || quizAnswers.caffeine) { applyProfileAndClose(); renderAccount(); }
    else { renderAccount(); showPage('account'); }
  };
  window.signOut = function () {
    session.signedIn = false; session.subscriber = false; session.foundingMember = false;
    $('signin-btn').classList.remove('signed-in');
    $('signin-label').textContent = 'Sign In';
    var w = $('account-wrap'); if (w) w.classList.remove('is-signed-in');
    renderCart();
    showPage('home');
    toast('Signed out.');
  };
  window.showSubscriptions = function () { showPage('account'); var e = $('acct-subs'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  window.applySavedProfile = function () {
    if (savedTaste) { activeTaste = { roast: savedTaste.roast, flavor: savedTaste.flavor, caffeine: savedTaste.caffeine }; }
    filterOn = true;
    showPage('shop');
    applyTasteEverywhere();
    updateRibbon('shop');
  };

  // ---------- cart (mock) ----------
  window.addToCart = function (handle, size, isSub, cadence) {
    var p = byHandle[handle];
    if (!p) return;
    var s = (p.sizes || []).filter(function (x) { return x.size === size; })[0] || p.sizes[0];
    // Merge into an existing line only when variant AND selling plan match — a one-time
    // bag and a subscription of the same bag stay separate rows (different selling plans),
    // exactly as Shopify treats them.
    var existing = cart.filter(function (it) {
      return it.handle === handle && it.size === s.size && it.sub === !!isSub && (it.cadence || null) === (cadence || null);
    })[0];
    if (existing) { existing.qty += 1; }
    else { cart.push({ handle: handle, title: p.display_title, shelf: p.shelf, size: s.size, price: s.price, img: p.img, sub: !!isSub, cadence: cadence, qty: 1 }); }
    updateCartCount();
    renderCart();
    toast(isSub ? 'Added — Roccia subscription, every ' + cadence + ' weeks.' : 'Added to your bag.');
  };
  window.removeFromCart = function (idx) { cart.splice(idx, 1); updateCartCount(); renderCart(); };
  window.changeQty = function (idx, delta) {
    var it = cart[idx]; if (!it) return;
    it.qty = (it.qty || 1) + delta;
    if (it.qty < 1) cart.splice(idx, 1);
    updateCartCount();
    renderCart();
  };
  function cartUnits() { return cart.reduce(function (n, it) { return n + (it.qty || 1); }, 0); }
  function updateCartCount() {
    var el = $('cart-count');
    if (!el) return;
    var units = cartUnits();
    el.textContent = units;
    el.classList.toggle('show', units > 0);
  }
  function eligibleForSubscriberDiscount(shelf) { return shelf === 'roccia' || shelf === 'sorpresa' || shelf === 'selezione'; }
  function renderCart() {
    var el = $('cart-view');
    if (!el) return;
    if (!cart.length) {
      el.innerHTML = '<div class="cart-empty"><p style="font-weight:600;color:var(--ci-espresso)">Your bag is empty.</p>' +
        '<p style="font-size:.9rem;margin-top:.25rem">Start with a <button onclick="showPage(\'sorpresa\')" style="background:none;border:none;color:var(--ci-crema);font-weight:600;cursor:pointer;text-decoration:underline">Sorpresa Tour</button> or build a <button onclick="showPage(\'roccia\')" style="background:none;border:none;color:var(--ci-crema);font-weight:600;cursor:pointer;text-decoration:underline">Roccia subscription</button>.</p></div>';
      return;
    }
    var html = '';
    // sign-in / create-account nudge for guests: surfaces BOTH the one-time first-purchase 5%
    // and the ongoing subscriber benefit.
    if (!session.signedIn) {
      html += '<div class="cart-banner"><span>Create an account or sign in to unlock your one-time 5% first-purchase discount — plus subscriber benefits of 10% off Roccia, Sorpresa, and Selezione.</span><button onclick="openSignin()">Sign in</button></div>';
    }
    // discount math (line total = unit price × quantity)
    var subtotal = cart.reduce(function (s, it) { return s + it.price * (it.qty || 1); }, 0);
    var discount = 0, discountLabel = '';
    if (session.signedIn && session.subscriber) {
      // Founding 12% applies only while the founding rate is not forfeited; otherwise the
      // standard subscriber 10%. (Pause preserves the rate; forfeiture drops to 10%.)
      var foundingRate = session.foundingMember && !session.foundingForfeited;
      var rate = foundingRate ? 0.12 : 0.10;
      var eligibleSum = cart.reduce(function (s, it) { return s + (eligibleForSubscriberDiscount(it.shelf) ? it.price * (it.qty || 1) : 0); }, 0);
      discount = eligibleSum * rate;
      discountLabel = (foundingRate ? 'Founding Member 12%' : 'Subscriber 10%') + ' (Roccia · Sorpresa · Selezione)';
      if (session.firstTime) {
        // First-order +5% stacks on the first order only, on all shelves EXCEPT Bottega.
        var firstTimeBase = cart.reduce(function (s, it) { return s + (it.shelf === 'bottega' ? 0 : it.price * (it.qty || 1)); }, 0);
        discount += firstTimeBase * 0.05;
        discountLabel += ' + first-order 5%';
      }
    }
    // free shipping progress (one-time orders; subscriptions always free)
    var allSub = cart.every(function (it) { return it.sub; });
    var shipNote;
    if (allSub) { shipNote = 'Free shipping on every Roccia shipment.'; }
    else if (subtotal >= FREE_SHIP_THRESHOLD) { shipNote = 'You have free shipping.'; }
    else { shipNote = 'Add ' + money(FREE_SHIP_THRESHOLD - subtotal) + ' for free shipping.'; }
    var pct = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100));
    html += '<div class="ship-bar"><div style="font-size:.85rem;color:var(--ci-espresso);font-weight:600">' + esc(shipNote) + '</div><div class="ship-bar-track"><div class="ship-bar-fill" style="width:' + (allSub ? 100 : pct) + '%"></div></div></div>';

    // lines
    cart.forEach(function (it, i) {
      var qty = it.qty || 1;
      html += '<div class="cart-line">' +
        '<div class="cart-line-img card-img ' + imgCls(it.img) + '"' + imgStyle(it.img) + '>' + esc(it.img ? it.img.label.split(' · ')[0] : '') + '</div>' +
        '<div><h4>' + esc(it.title) + '</h4>' +
        '<div class="rn">' + esc(it.size) + (it.sub ? ' · <span class="tag-pill">Roccia subscription · every ' + esc(it.cadence) + ' weeks</span>' : ' · One-time') + '</div>' +
        '<div class="qty-stepper"><button onclick="changeQty(' + i + ',-1)" aria-label="Decrease quantity">&minus;</button>' +
        '<span class="qty-n">' + qty + '</span>' +
        '<button onclick="changeQty(' + i + ',1)" aria-label="Increase quantity">+</button></div>' +
        '</div>' +
        '<div style="text-align:right"><div class="cp">' + money(it.price * qty) + '</div>' +
        (qty > 1 ? '<div class="csz">' + money(it.price) + ' each</div>' : '') +
        '<button class="skip-link" onclick="removeFromCart(' + i + ')">Remove</button></div>' +
        '</div>';
    });

    // summary
    // PROD: Bottega ships from a separate source (not the coffee 3PL), so in production it gets
    // its own Shopify shipping profile/rate and Shopify sums each source. This POC uses one
    // unified estimate. Sales tax is calculated by Shopify Tax at checkout (nexus + address).
    var shipping = (allSub || subtotal >= FREE_SHIP_THRESHOLD) ? 0 : 8.5;
    var total = subtotal - discount + shipping;
    html += '<div class="cart-summary">' +
      '<div class="row"><span>Subtotal</span><span>' + money(subtotal) + '</span></div>' +
      (discount > 0 ? '<div class="row"><span>' + esc(discountLabel) + '</span><span>-' + money(discount) + '</span></div>' : '') +
      '<div class="row"><span>Estimated shipping</span><span>' + (shipping === 0 ? 'Free' : money(shipping)) + '</span></div>' +
      '<div class="row"><span>Estimated tax</span><span>calculated at checkout</span></div>' +
      '<div class="row total"><span>Total</span><span>' + money(total) + '</span></div>' +
      '<button class="btn btn-primary" style="width:100%;margin-top:1rem" onclick="toast(\'This is a preview — checkout is Shopify Checkout on the live store.\')">Checkout</button>' +
      (!session.signedIn ? '<p class="note" style="text-align:center;margin-top:.6rem">You can check out as a guest, or create an account to keep your 5% and manage subscriptions.</p>' : '') +
      '<p class="note" style="text-align:center">No promo code field — earned discounts apply automatically when signed in or via a personal link.</p>' +
      '</div>';
    el.innerHTML = html;
  }

  // ---------- account (mock; Loop portal slot) ----------
  function renderAccount() {
    var el = $('account-view');
    if (!el) return;
    if (!session.signedIn) { el.innerHTML = '<p class="prose">Please <button class="back-btn" style="margin:0" onclick="openSignin()">sign in</button> to view your account.</p>'; return; }
    $('account-greeting').textContent = 'Buongiorno, ' + session.name;
    var profHtml = savedTaste ? tasteTagsHtml(savedTaste) : '';
    el.innerHTML =
      '<div class="acct-grid">' +
        '<div class="acct-card"><h3>Membership</h3>' +
          (session.foundingForfeited
            ? '<span class="badge-founding badge-forfeited">Founding Member · No. 087</span><span class="status-chip sc-lapsed">Rate forfeited</span>' +
              '<p class="prose" style="margin-top:.75rem">Founding rate forfeited. You\'re welcome back anytime at the standard <strong>10%</strong> + free shipping — and No. 087 is always yours.</p></div>'
            : '<span class="badge-founding">Founding Member · No. 087</span><span class="status-chip sc-active">Active</span>' +
              '<p class="prose" style="margin-top:.75rem">Your Founding rate of <strong>12%</strong> applies automatically across Roccia, Sorpresa, and Selezione. Offerta and Bottega are never discounted.</p></div>') +
        '<div class="acct-card"><h3>Taste profile</h3>' +
          (profHtml
            ? '<div class="tags" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.25rem">' + profHtml + '</div>' +
              '<div class="acct-actions"><button class="btn btn-primary" onclick="applySavedProfile()">Apply to Shop</button><button class="btn btn-secondary" onclick="openQuiz()">Change</button></div>'
            : '<p class="prose">Take the taste quiz to set your profile. <button class="inline-link" onclick="openQuiz()">Start</button></p>') +
          '<p class="note">Stored to your account and used to pre-filter the Shop.</p></div>' +
        '<div class="acct-card"><h3>Recent orders</h3>' +
          '<div class="order-list">' +
            orderRow('1042', 'Tour d\'Italia 1', '2026-06-12', '$77.70') +
            orderRow('1031', 'Gardelli — Ethiopia Bombe · 250g', '2026-05-28', '$38.00') +
          '</div>' +
          '<button class="inline-link" style="margin-top:.7rem" onclick="mockAllOrders()">Show all orders</button>' +
          '<!-- PROD: rows link to the native Shopify ORDER DETAIL page (an order may hold multiple line items); "Order again" re-adds that order\'s line items to the native cart, and for Roccia items can convert to a selling_plan (Loop) subscription with a "you\'re leaving 10-12% + free shipping behind" nudge; "Show all orders" -> native Shopify order-history page. Use "Order #" (Shopify order number), NOT "invoice". Reorder is not 1:1 — production needs a graceful "no longer available, here\'s a similar one" path. -->' +
        '</div>' +
        // PROD: name/email/password and the shipping address book for one-time orders
        // (Sorpresa/Selezione/Offerta/Bottega) are native Shopify customer-account
        // territory, separate from Loop — see docs/POC_v4_change_list.md item 3.
        '<div class="acct-card"><h3>Profile &amp; addresses</h3>' +
          '<p class="prose" style="margin:0">Name, email, password, and your shipping address book for one-time orders.</p>' +
          '<p class="prose" style="margin:.4rem 0 0">Email &amp; SMS marketing preferences are managed here too.</p>' +
          // PROD: profile/address book = native Shopify customer accounts; email/SMS marketing
          // consent = native Shopify + the email platform (Shopify Email / Klaviyo) preference
          // centre. Not built in this POC. Transactional order emails are store-level (not a
          // customer toggle). Subscription reminders live in the Loop slot below.
          '<p class="note">Managed via native Shopify customer accounts + our email platform on the live store — not built in this POC.</p></div>' +
      '</div>' +
      '<div class="section-head" id="acct-subs"><p class="eyebrow">Roccia subscription</p><h2>Manage your subscription</h2></div>' +
      subscriptionBlock() +
      '<div class="loop-slot" style="margin-top:1.25rem"><strong>On the live store, this is Loop\'s hosted portal.</strong> Pause, skip, swap roaster / SKU / bag-size (up to 48 h before lock), change cadence, or cancel, and manage ship-to + payment, plus your subscription reminders and delivery notifications — self-service, no fee. Passwordless login, embedded as a theme app block. ' +
      '<!-- LOOP: replace this slot with the Loop customer-portal app block / link. -->' +
      '<!-- PROD: the Founding-rate entitlement (12% while subscribed, 10% once forfeited) is a Shopify Function reading a one-way customer tag flipped by Loop cancel/create webhooks — NOT theme state. This POC fakes it client-side to demonstrate the two Membership states. --></div>';
  }

  // Mock subscription-management block (POC). PROD: this whole area is Loop's hosted portal.
  function subscriptionBlock() {
    if (!session.subscriber) {
      return '<div class="sub-manage"><p class="prose" style="margin:0">You have no active Roccia subscription.</p>' +
        (session.foundingForfeited ? '<p class="note">Your Founding 12% was forfeited when you cancelled. Resubscribe to return at the standard 10% + free shipping.</p>' : '') +
        '<div class="sub-actions"><button class="btn btn-primary" onclick="mockResubscribe()">Resubscribe</button></div></div>';
    }
    if (session.paused) {
      return '<div class="sub-manage"><div class="sub-line"><div><strong>Gardelli — Ethiopia Bombe</strong><div class="rn">250g · every 4 weeks</div></div><span class="status-chip sc-paused">Paused</span></div>' +
        '<p class="note">Paused — your Founding 12% is preserved. Resume anytime.</p>' +
        '<div class="sub-actions"><button class="btn btn-primary" onclick="mockResume()">Resume</button><button class="btn btn-secondary" onclick="mockStartCancel()">Cancel subscription</button></div>' +
        '<div id="cancel-flow"></div></div>';
    }
    return '<div class="sub-manage"><div class="sub-line"><div><strong>Gardelli — Ethiopia Bombe</strong><div class="rn">250g · every 4 weeks · next ships 2026-07-20</div></div><span class="status-chip sc-active">Active</span></div>' +
      '<div class="sub-actions"><button class="btn btn-secondary" onclick="mockPause()">Pause</button><button class="btn btn-secondary" onclick="mockStartCancel()">Cancel subscription</button></div>' +
      '<div id="cancel-flow"></div></div>';
  }
  // Pause-first cancel prompt — the moment the warning does its work.
  window.mockStartCancel = function () {
    var el = $('cancel-flow');
    if (!el) return;
    el.innerHTML =
      '<div class="cancel-warn"><h4>Before you cancel</h4>' +
      '<p>As a Founding Member, your <strong>12%</strong> is active only while you subscribe. <strong>Pause instead</strong> and keep it — with no charge while paused. Cancel and you can return anytime at the standard 10%.</p>' +
      '<div class="sub-actions"><button class="btn btn-primary" onclick="mockPause()">Pause and keep my 12%</button><button class="btn btn-secondary" onclick="confirmForfeit()">Cancel anyway</button></div></div>';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  window.mockPause = function () {
    session.paused = true; renderCart(); renderAccount();
    toast('Paused — your Founding 12% is preserved.');
    var e = $('acct-subs'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.mockResume = function () { session.paused = false; renderCart(); renderAccount(); toast('Subscription resumed.'); };
  window.confirmForfeit = function () {
    session.subscriber = false; session.paused = false; session.foundingForfeited = true;
    renderCart(); renderAccount();
    toast('Cancelled — Founding 12% forfeited. You are welcome back at 10%.');
    var e = $('acct-subs'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.mockResubscribe = function () {
    session.subscriber = true; session.paused = false; renderCart(); renderAccount();
    toast(session.foundingForfeited ? 'Welcome back — subscribed at the standard 10%.' : 'Subscribed.');
  };

  // Recent-orders rows (visual redesign). Reorder/detail behaviors are INSTRUCTED, not
  // modeled — clicking fires a preview toast; the PROD comment in the card documents the
  // real native-Shopify flow.
  function orderRow(no, item, date, amt) {
    return '<div class="order-row">' +
      '<div class="order-open" onclick="mockOrderDetail(\'' + no + '\')">' +
        '<div class="order-top"><span class="order-no">Order #' + no + '</span><span class="order-amt">' + amt + '</span></div>' +
        '<div class="order-sub">' + esc(item) + ' · ' + date + '</div>' +
      '</div>' +
      '<button class="inline-link order-again" onclick="mockOrderAgain(\'' + no + '\')">Order again</button>' +
      '</div>';
  }
  window.mockOrderDetail = function (no) { toast('Preview — Order #' + no + ' opens on the live store (Shopify order detail).'); };
  window.mockOrderAgain = function (no) { toast('Preview — "Order again" re-adds Order #' + no + ' to your cart on the live store.'); };
  window.mockAllOrders = function () { toast('Preview — your full order history lives in your account on the live store.'); };

  // ---------- toast ----------
  window.toast = function (msg) {
    var t = $('ci-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__ciToast);
    window.__ciToast = setTimeout(function () { t.classList.remove('show'); }, 2600);
  };

  // ---------- boot ----------
  function boot() {
    // Close any modal on overlay click — routed through each modal's own close
    // function (rather than just toggling the class) so e.g. closeSignin()'s
    // guest-fallback for a pending quiz action still fires on this dismissal path.
    var overlays = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < overlays.length; i++) {
      overlays[i].addEventListener('click', function (e) {
        if (e.target !== this) return;
        if (this.id === 'signin-modal') closeSignin();
        else if (this.id === 'quiz-modal') closeQuiz();
        else this.classList.remove('active');
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeQuiz(); closeSignin(); }
    });

    // Quiz is invitation-only (brand decision 2026-07-10): it launches from the hero
    // CTA and the sticky "Take the quiz" chip, never as an unbidden first-visit modal.
    // The auto-launch was removed as a mild gimmick inconsistent with the brand.

    var url = window.CI_CATALOG_URL;
    if (!url) { console.warn('CI_CATALOG_URL missing'); return; }
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      CATALOG = data;
      (CATALOG.products || []).forEach(function (p) { byHandle[p.handle] = p; });
      (CATALOG.roasters || []).forEach(function (r) { roasterByHandle[r.handle] = r; });
      (CATALOG.people || []).forEach(function (pn) { peopleById[pn.id] = pn; });
      renderAll();
      renderCart();
    }).catch(function (err) { console.error('Catalog load failed', err); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
