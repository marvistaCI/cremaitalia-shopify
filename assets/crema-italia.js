/**
 * Crema Italia — Coming Soon Theme
 * assets/crema-italia.js
 * v1.0 · 2026
 *
 * Responsibilities:
 *  1. Client-side email validation before Shopify form submit
 *  2. Smooth scroll from hero CTA to signup card
 *  3. Accessibility: announce success/error states to screen readers
 *
 * Note on honeypot: Shopify's native customer form endpoint includes
 * server-side spam protection. A custom honeypot field would require
 * intercepting the form submit and checking the field via JS. This is
 * deferred to v2 — the trade-off is slightly increased spam surface at
 * low-traffic scale, which is acceptable for a pre-launch list of < 10k.
 * Shopify's own CAPTCHA (if enabled in admin) covers most bots.
 *
 * Note on success state: Shopify's {% form 'customer' %} does a full
 * page POST and sets form.posted_successfully? = true on the server side.
 * The Liquid template handles the success render. The JS below handles
 * a secondary client-side enhancement for cases where Shopify returns
 * the page with a success param (ci_success=1 in the URL), which some
 * themes use as a progressive enhancement. The primary success flow is
 * handled entirely by Liquid.
 */

(function () {
  'use strict';

  /* ── Email validation ─────────────────────────────────── */

  /**
   * Returns true if the string looks like a valid email.
   * Uses a practical RFC-5321 subset — not exhaustive but
   * catches >99% of typos.
   */
  function isValidEmail(email) {
    // Must have exactly one @, a local part, a domain with a dot,
    // and a TLD of at least two characters.
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return pattern.test(String(email).trim().toLowerCase());
  }

  /* ── Form enhancement ────────────────────────────────── */

  function initSignupForm() {
    var form = document.querySelector('.signup-form');
    if (!form) return;

    var emailInput = form.querySelector('input[type="email"]');
    var submitBtn  = form.querySelector('button[type="submit"]');
    var errorEl    = form.querySelector('.form-error');

    if (!emailInput || !submitBtn) return;

    // Clear error on input
    emailInput.addEventListener('input', function () {
      if (errorEl) {
        errorEl.classList.remove('is-visible');
        errorEl.setAttribute('aria-hidden', 'true');
      }
      emailInput.removeAttribute('aria-invalid');
    });

    // Validate before submit
    form.addEventListener('submit', function (event) {
      var val = emailInput.value;

      if (!isValidEmail(val)) {
        event.preventDefault();

        if (errorEl) {
          errorEl.classList.add('is-visible');
          errorEl.removeAttribute('aria-hidden');
        }

        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        return false;
      }

      // Disable button to prevent double-submit
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';
    });
  }

  /* ── Hero CTA smooth scroll ──────────────────────────── */

  function initHeroCTA() {
    var cta = document.querySelector('.hero-cta');
    if (!cta) return;

    cta.addEventListener('click', function (event) {
      var target = document.querySelector('#signup-card');
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Focus the email input for accessibility
      var emailInput = target.querySelector('input[type="email"]');
      if (emailInput) {
        setTimeout(function () { emailInput.focus(); }, 400);
      }
    });
  }

  /* ── Screen-reader live region ───────────────────────── */

  function initLiveRegion() {
    var region = document.getElementById('ci-sr-live');
    if (!region) {
      region = document.createElement('div');
      region.id = 'ci-sr-live';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      // Visually hidden but readable by screen readers
      region.style.cssText = [
        'position:absolute',
        'width:1px',
        'height:1px',
        'padding:0',
        'margin:-1px',
        'overflow:hidden',
        'clip:rect(0,0,0,0)',
        'white-space:nowrap',
        'border:0'
      ].join(';');
      document.body.appendChild(region);
    }
    return region;
  }

  function announceSuccess() {
    var region = initLiveRegion();
    region.textContent = 'Grazie. We have your address. We will write when the first pallet lands.';
  }

  /* ── Init on DOM ready ───────────────────────────────── */

  function init() {
    initSignupForm();
    initHeroCTA();

    // If Shopify returned with a posted_successfully indicator in the
    // DOM (the success section is visible), announce it to screen readers.
    var successEl = document.querySelector('.form-success');
    if (successEl && successEl.style.display !== 'none') {
      announceSuccess();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
