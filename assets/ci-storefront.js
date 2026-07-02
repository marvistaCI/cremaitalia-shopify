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

  // ---- filter + quiz + session state ----
  var activeRegion = 'all', activeShelf = 'all';
  var activeTaste = { roast: 'all', flavor: 'all', caffeine: 'all' };
  var quizAnswers = { roast: null, flavor: null, caffeine: null };
  var session = { signedIn: false, subscriber: false, foundingMember: false, firstTime: true, name: 'Steve R.' };
  var cart = [];
  var profileActive = false, savedTaste = null, pendingSaveProfile = false;

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
  function productCard(p) {
    var badge = SHELF_BADGE[p.shelf] || { cls: '', tag: '' };
    return '<div class="card product-card" data-region="' + esc(p.region) + '" data-shelf="' + esc(p.shelf) +
      '" data-roast="' + esc(p.roast) + '" data-flavor="' + esc(p.flavor) + '" data-caffeine="' + esc(p.caffeine) +
      '" onclick="openProduct(\'' + p.handle + '\')">' +
      '<div class="card-img ' + imgCls(p.img) + '"' + imgStyle(p.img) + '>' + esc(p.img ? p.img.label : p.title) + '</div>' +
      '<div class="card-body">' +
        '<span class="cs ' + badge.cls + '">' + esc(badge.tag) + '</span>' +
        '<h3>' + esc(p.display_title) + '</h3>' +
        (rnLine(p) ? '<div class="rn">' + rnLine(p) + '</div>' : '') +
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
  window.showPage = function (name) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
    var t = $('page-' + name);
    if (t) { t.classList.add('active'); window.scrollTo(0, 0); }
    var navBtns = document.querySelectorAll('nav button[id^="nav-"]');
    for (var j = 0; j < navBtns.length; j++) navBtns[j].classList.remove('active');
    var navKey = name;
    if (['roccia', 'sorpresa', 'selezione', 'offerta', 'product', 'cart'].indexOf(name) !== -1) navKey = 'shop';
    if (name === 'roaster') navKey = 'roasters';
    var nb = $('nav-' + navKey);
    if (nb) nb.classList.add('active');
    // Persist the active taste profile onto shelf landing pages reached from the Shop dropdown.
    if (['roccia', 'selezione', 'offerta'].indexOf(name) !== -1) applyTasteToGrid('grid-' + name);
  };

  window.openRoaster = function (handle) {
    var r = roasterByHandle[handle];
    if (!r) return;
    $('roaster-eyebrow').textContent = r.region_label + ' · founded ' + r.founded;
    $('roaster-name').textContent = r.name;
    $('roaster-bio').innerHTML = (r.bio || []).map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('');
    $('roaster-bags-head').textContent = 'Available from ' + r.name.split(' ')[0];
    var bags = CATALOG.products.filter(function (p) { return p.roaster === handle && (p.shelf === 'roccia' || p.shelf === 'sorpresa'); });
    $('roaster-bags').innerHTML = bags.length ? bags.map(productCard).join('') :
      '<p class="prose" style="max-width:65ch">New bags from this roaster are on the way.</p>';
    $('roaster-find').textContent = r.find;
    showPage('roaster');
  };

  window.openProduct = function (handle) {
    var p = byHandle[handle];
    if (!p) return;
    $('product-detail').innerHTML = productDetail(p);
    showPage('product');
  };

  function productDetail(p) {
    var badge = SHELF_BADGE[p.shelf] || { cls: '', tag: '' };
    var img = '<div class="pd-img card-img ' + imgCls(p.img) + '"' + imgStyle(p.img) + '>' + esc(p.img ? p.img.label : p.title) + '</div>';

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
  window.filterRegion = function (el, val) { activeRegion = val; setActive(el); applyFilters(); };
  window.filterShelf = function (el, val) { activeShelf = val; setActive(el); applyFilters(); };
  window.filterTaste = function (el, axis, val) {
    activeTaste[axis] = val; setActiveAll(el); applyFilters();
    if (axis === 'flavor') updateFlavorDesc();
    refreshSaveProfile();
  };
  function tasteChanged() { return activeTaste.roast !== 'all' || activeTaste.flavor !== 'all' || activeTaste.caffeine !== 'all'; }
  function refreshSaveProfile() { var el = $('save-profile'); if (el) el.classList.toggle('show', tasteChanged()); }
  function updateFlavorDesc() {
    var el = $('flavor-desc'); if (!el) return;
    var d = FLAVOR_DESC[activeTaste.flavor];
    if (d) { el.textContent = d; el.classList.add('show'); } else { el.textContent = ''; el.classList.remove('show'); }
  }
  // Save the current Taste selections as the customer's profile.
  window.saveToProfile = function () {
    if (session.signedIn) { commitProfile(); toast('Saved to your taste profile.'); }
    else { pendingSaveProfile = true; openSignin(); }
  };
  function commitProfile() {
    savedTaste = { roast: activeTaste.roast, flavor: activeTaste.flavor, caffeine: activeTaste.caffeine };
    profileActive = true;
    renderProfileTags();
    $('profile-banner').classList.add('active');
    var h = $('pf-hint'); if (h) h.style.display = 'block';
    var sp = $('save-profile'); if (sp) sp.classList.remove('show');
    applyFilters();
  }
  function tasteTagsHtml(t) {
    var lbl = { roast: { light: 'Light & Bright', medium: 'Balanced', dark: 'Rich & Bold' }, flavor: FLAVOR_LABEL, caffeine: { full: 'Caffeinated', decaf: 'Decaf' } };
    var tags = [];
    if (t && t.roast && t.roast !== 'all') tags.push(lbl.roast[t.roast]);
    if (t && t.flavor && t.flavor !== 'all') tags.push(lbl.flavor[t.flavor]);
    if (t && t.caffeine && t.caffeine !== 'all') tags.push(lbl.caffeine[t.caffeine]);
    return tags.filter(Boolean).map(function (x) { return '<span class="profile-tag">' + esc(x) + '</span>'; }).join('');
  }
  function renderProfileTags() {
    var html = tasteTagsHtml(activeTaste);
    var b = $('profile-banner-tags'); if (b) b.innerHTML = html;
    var r = $('result-tags'); if (r) r.innerHTML = html;
  }
  // Apply the active taste profile to a shelf-page grid (Roccia/Selezione/Offerta).
  function applyTasteToGrid(gridId) {
    var cards = document.querySelectorAll('#' + gridId + ' .product-card');
    for (var i = 0; i < cards.length; i++) {
      var d = cards[i].dataset;
      var show = !profileActive || (
        (activeTaste.roast === 'all' || d.roast === activeTaste.roast || d.roast === 'any') &&
        (activeTaste.flavor === 'all' || d.flavor === activeTaste.flavor || d.flavor === 'any') &&
        (activeTaste.caffeine === 'all' || d.caffeine === activeTaste.caffeine || d.caffeine === 'any'));
      cards[i].style.display = show ? '' : 'none';
    }
  }
  function applyProfileToShelves() { ['grid-roccia', 'grid-selezione', 'grid-offerta'].forEach(applyTasteToGrid); }
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
    var visible = 0;
    var cards = document.querySelectorAll('#shop-grid .product-card');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], d = c.dataset;
      var show =
        (activeRegion === 'all' || d.region === activeRegion) &&
        (activeShelf === 'all' || d.shelf === activeShelf) &&
        (activeTaste.roast === 'all' || d.roast === activeTaste.roast || d.roast === 'any') &&
        (activeTaste.flavor === 'all' || d.flavor === activeTaste.flavor || d.flavor === 'any') &&
        (activeTaste.caffeine === 'all' || d.caffeine === activeTaste.caffeine || d.caffeine === 'any');
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
      roast: { light: 'Light & Bright', medium: 'Balanced', dark: 'Rich & Bold', any: 'Any Roast' },
      flavor: { fruit: 'Fruit & Floral', sweet: 'Sweet & Chocolate', terroir: 'Bold & Spiced' },
      caffeine: { full: 'Caffeinated', decaf: 'Decaf', both: 'Both' }
    };
    var tags = [];
    if (quizAnswers.roast && quizAnswers.roast !== 'any') tags.push(lbl.roast[quizAnswers.roast]);
    if (quizAnswers.flavor) tags.push(lbl.flavor[quizAnswers.flavor]);
    if (quizAnswers.caffeine && quizAnswers.caffeine !== 'both') tags.push(lbl.caffeine[quizAnswers.caffeine]);
    $('result-tags').innerHTML = tags.map(function (t) { return '<span class="profile-tag">' + esc(t) + '</span>'; }).join('');
    var title = 'Your Tuscan profile';
    if (quizAnswers.roast === 'light' && quizAnswers.flavor === 'fruit') title = 'The Naturalist';
    else if (quizAnswers.roast === 'medium' && quizAnswers.flavor === 'sweet') title = 'The Classicist';
    else if (quizAnswers.roast === 'dark') title = 'The Traditionalist';
    else if (quizAnswers.caffeine === 'decaf') title = 'The Decaf Discoverer';
    $('result-title').textContent = title;
    nextStep(4);
    var dots = document.querySelectorAll('.quiz-dot');
    for (var i = 0; i < dots.length; i++) dots[i].classList.add('done');
  };
  window.applyProfileAndClose = function () {
    if (quizAnswers.roast && quizAnswers.roast !== 'any') activeTaste.roast = quizAnswers.roast;
    if (quizAnswers.flavor) activeTaste.flavor = quizAnswers.flavor;
    if (quizAnswers.caffeine && quizAnswers.caffeine !== 'both') activeTaste.caffeine = quizAnswers.caffeine;
    savedTaste = { roast: activeTaste.roast, flavor: activeTaste.flavor, caffeine: activeTaste.caffeine };
    profileActive = true;
    $('profile-banner').classList.add('active');
    renderProfileTags();
    var h = $('pf-hint'); if (h) h.style.display = 'block';
    syncFilterPills();
    updateFlavorDesc();
    closeQuiz();
    showPage('shop');
    applyFilters();
    applyProfileToShelves();
  };
  window.clearProfile = function () {
    activeTaste = { roast: 'all', flavor: 'all', caffeine: 'all' };
    activeRegion = 'all'; activeShelf = 'all';
    profileActive = false;
    $('profile-banner').classList.remove('active');
    var h = $('pf-hint'); if (h) h.style.display = 'none';
    var groups = document.querySelectorAll('#page-shop .filter-pills');
    for (var g = 0; g < groups.length; g++) {
      var pills = groups[g].querySelectorAll('.pill');
      for (var i = 0; i < pills.length; i++) pills[i].classList.toggle('active', i === 0);
    }
    updateFlavorDesc();
    refreshSaveProfile();
    applyFilters();
    applyProfileToShelves();
  };
  // reflect activeTaste into the shop filter pills after a quiz
  function syncFilterPills() {
    document.querySelectorAll('#page-shop .filter-pills .pill').forEach(function (pill) {
      var oc = pill.getAttribute('onclick') || '';
      var m = oc.match(/filterTaste\(this,'(\w+)','(\w+)'\)/);
      if (m) {
        var axis = m[1], val = m[2];
        var others = pill.closest('.filter-pills').querySelectorAll('.pill');
        if (val === activeTaste[axis] || (activeTaste[axis] === 'all' && val === 'all')) {
          for (var i = 0; i < others.length; i++) others[i].classList.remove('active');
          pill.classList.add('active');
        }
      }
    });
  }

  // ---------- sign-in ----------
  window.handleAccountClick = function () { if (session.signedIn) showPage('account'); else openSignin(); };
  window.openSignin = function () { $('signin-modal').classList.add('active'); };
  window.closeSignin = function () { $('signin-modal').classList.remove('active'); };
  window.showSigninFromQuiz = function () { closeQuiz(); openSignin(); };
  window.switchTab = function (tab) {
    var tabs = document.querySelectorAll('.signin-tab');
    tabs[0].classList.toggle('active', tab === 'in');
    tabs[1].classList.toggle('active', tab === 'up');
    $('tab-in').style.display = tab === 'in' ? '' : 'none';
    $('tab-up').style.display = tab === 'up' ? '' : 'none';
  };
  window.simulateSignIn = function () {
    // POC: assume a Founding-Member active subscriber so discounts/portal are visible.
    session.signedIn = true; session.subscriber = true; session.foundingMember = true;
    $('signin-btn').classList.add('signed-in');
    $('signin-label').textContent = session.name;
    var w = $('account-wrap'); if (w) w.classList.add('is-signed-in');
    closeSignin();
    renderCart();
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
    profileActive = true;
    renderProfileTags();
    $('profile-banner').classList.add('active');
    var h = $('pf-hint'); if (h) h.style.display = 'block';
    syncFilterPills();
    updateFlavorDesc();
    showPage('shop');
    applyFilters();
    applyProfileToShelves();
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
      var rate = session.foundingMember ? 0.12 : 0.10;
      var eligibleSum = cart.reduce(function (s, it) { return s + (eligibleForSubscriberDiscount(it.shelf) ? it.price * (it.qty || 1) : 0); }, 0);
      discount = eligibleSum * rate;
      discountLabel = (session.foundingMember ? 'Founding Member 12%' : 'Subscriber 10%') + ' (Roccia · Sorpresa · Selezione)';
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
    var profHtml = (profileActive || savedTaste) ? tasteTagsHtml(savedTaste || activeTaste) : '';
    el.innerHTML =
      '<div class="acct-grid">' +
        '<div class="acct-card"><h3>Membership</h3>' +
          (session.foundingMember ? '<span class="badge-founding">Founding Member · No. 087</span>' : '<span class="tag-pill">Active subscriber</span>') +
          '<p class="prose" style="margin-top:.75rem">Your ' + (session.foundingMember ? '12%' : '10%') + ' benefit applies automatically across Roccia, Sorpresa, and Selezione. Offerta and Bottega are never discounted.</p></div>' +
        '<div class="acct-card"><h3>Taste profile</h3>' +
          (profHtml
            ? '<div class="tags" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.25rem">' + profHtml + '</div>' +
              '<div class="acct-actions"><button class="btn btn-primary" onclick="applySavedProfile()">Apply to Shop</button><button class="btn btn-secondary" onclick="openQuiz()">Change</button></div>'
            : '<p class="prose">Take the taste quiz to set your profile. <button class="inline-link" onclick="openQuiz()">Start</button></p>') +
          '<p class="note">Stored to your account and used to pre-filter the Shop.</p></div>' +
        '<div class="acct-card"><h3>Recent orders</h3>' +
          '<p class="prose" style="margin:0">Tour d\'Italia 1 — shipped 2026-06-12</p>' +
          '<p class="prose" style="margin:.25rem 0 0">Gardelli Ethiopia Bombe 250g — delivered 2026-05-28</p></div>' +
      '</div>' +
      '<div class="section-head" id="acct-subs"><p class="eyebrow">Roccia subscription</p><h2>Manage your subscription</h2></div>' +
      '<div class="loop-slot"><strong>Loop customer portal mounts here.</strong> Pause, skip, swap roaster / SKU / bag-size (up to 48 hours before lock), change cadence, or cancel — all self-service, no fee. ' +
      'On the live store this is Loop\'s hosted portal (passwordless login) embedded as a theme app block. ' +
      '<!-- LOOP: replace this slot with the Loop customer-portal app block / link. --></div>';
  }

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
    // close any modal on overlay click
    var overlays = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < overlays.length; i++) {
      overlays[i].addEventListener('click', function (e) { if (e.target === this) this.classList.remove('active'); });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeQuiz(); closeSignin(); }
    });

    // First-visit taste quiz — auto-launch once, then remember dismissal.
    try { if (!localStorage.getItem('ci_quiz_seen')) openQuiz(); } catch (e) {}

    var url = window.CI_CATALOG_URL;
    if (!url) { console.warn('CI_CATALOG_URL missing'); return; }
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      CATALOG = data;
      (CATALOG.products || []).forEach(function (p) { byHandle[p.handle] = p; });
      (CATALOG.roasters || []).forEach(function (r) { roasterByHandle[r.handle] = r; });
      renderAll();
      renderCart();
    }).catch(function (err) { console.error('Catalog load failed', err); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
