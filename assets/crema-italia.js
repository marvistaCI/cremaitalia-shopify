/**
 * Crema Italia — Coming Soon Theme
 * assets/crema-italia.js
 * v1.1 · 2026
 *
 * Progressive enhancement for the pre-launch signup form on
 * templates/password.liquid. Everything here is optional polish — the
 * form works fully without JavaScript, because Shopify's
 * {% form 'customer' %} does a normal server-side POST.
 *
 * Responsibilities:
 *   1. Client-side email validation before submit (catches typos early)
 *   2. Prevent double-submit (disable the button after a valid submit)
 *   3. Announce the success state to screen readers
 *
 * Note on spam: Shopify's customer endpoint has server-side spam
 * protection, and admin-enabled CAPTCHA covers most bots. A custom
 * honeypot is deferred to v2 — acceptable for a pre-launch list at low
 * volume.
 */

(function () {
  'use strict';

  /* ── Email validation ─────────────────────────────────── */

  /**
   * Returns true if the string looks like a valid email.
   * Practical RFC-5321 subset — not exhaustive, but catches >99% of typos.
   */
  function isValidEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return pattern.test(String(email).trim().toLowerCase());
  }

  /* ── Signup form enhancement ──────────────────────────── */

  function initSignupForm() {
    var form = document.querySelector('.signup-form');
    if (!form) return;

    var emailInput = form.querySelector('input[type="email"]');
    var submitBtn  = form.querySelector('button[type="submit"]');
    var errorEl    = form.querySelector('.form-error');

    // On the success render there is no email input — nothing to enhance.
    if (!emailInput || !submitBtn) return;

    // Clear the error as soon as the visitor starts fixing it.
    emailInput.addEventListener('input', function () {
      if (errorEl) {
        errorEl.classList.remove('is-visible');
        errorEl.setAttribute('aria-hidden', 'true');
      }
      emailInput.removeAttribute('aria-invalid');
    });

    // Validate before allowing the POST; block a bad email client-side.
    form.addEventListener('submit', function (event) {
      if (!isValidEmail(emailInput.value)) {
        event.preventDefault();
        if (errorEl) {
          errorEl.classList.add('is-visible');
          errorEl.removeAttribute('aria-hidden');
        }
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        return;
      }

      // Valid: disable the button so an impatient double-click can't
      // submit twice.
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    });
  }

  /* ── Screen-reader success announcement ──────────────── */

  /**
   * The success block (.form-success) is rendered by Liquid ONLY after a
   * successful POST. If it's present, announce it via a visually-hidden
   * live region so screen-reader users hear the confirmation.
   */
  function announceSuccessIfPresent() {
    if (!document.querySelector('.form-success')) return;

    var region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.cssText = [
      'position:absolute', 'width:1px', 'height:1px', 'padding:0',
      'margin:-1px', 'overflow:hidden', 'clip:rect(0,0,0,0)',
      'white-space:nowrap', 'border:0'
    ].join(';');
    region.textContent =
      'Grazie. We have your address. We will write when the first pallet lands.';
    document.body.appendChild(region);
  }

  /* ── Init on DOM ready ───────────────────────────────── */

  function init() {
    initSignupForm();
    announceSuccessIfPresent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
