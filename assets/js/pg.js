/* ==========================================================================
   Techosolution — Payment Gateway landing pages (shared script)
   --------------------------------------------------------------------------
   Wrapped in an IIFE: creates ZERO globals, safe to embed in WordPress.
   Handles: mobile nav, sticky-nav shadow, FAQ accordion, smooth in-page
   scrolling, WhatsApp CTA links, and the no-backend lead form.
   ========================================================================== */
(function () {
  'use strict';

  /* ========================================================================
   * WHATSAPP_NUMBER — the business WhatsApp number that receives leads.
   * Format: international digits ONLY, no "+", no spaces, no dashes.
   * Example: '967777123456'
   * >>> REPLACE_ME must be replaced before the pages go live. <<<
   * Until it is replaced, CTA buttons fall back to the lead form and the
   * form shows a "not connected yet" notice instead of opening WhatsApp.
   * ====================================================================== */
  var WHATSAPP_NUMBER = '966551872875';

  var WA_CONFIGURED = /^[0-9]{7,15}$/.test(WHATSAPP_NUMBER);

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var root = qs('.pg-landing');
  if (!root) { return; }

  /* ---------------- Sticky nav shadow on scroll ---------------- */
  var nav = qs('.pg-nav', root);
  function onScroll() {
    if (nav) { nav.classList.toggle('pg-nav-scrolled', window.scrollY > 12); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav toggle ---------------- */
  qsa('.pg-nav-toggle', root).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var menu = qs('.pg-mobile-menu', root);
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------------- FAQ accordion (one open at a time) ---------------- */
  qsa('.pg-faq-item', root).forEach(function (item) {
    var q = qs('.pg-faq-q', item);
    var a = qs('.pg-faq-a', item);
    if (!q || !a) { return; }
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      qsa('.pg-faq-item.open', root).forEach(function (other) {
        other.classList.remove('open');
        qs('.pg-faq-a', other).style.maxHeight = '0px';
        qs('.pg-faq-q', other).setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------- Smooth in-page scrolling (scoped, no global CSS) ---- */
  qsa('a[href^="#"]', root).forEach(function (link) {
    link.addEventListener('click', function (ev) {
      var id = link.getAttribute('href');
      if (id.length < 2) { return; }
      var target = qs(id, root) || document.querySelector(id);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var menu = qs('.pg-mobile-menu', root);
        if (menu) { menu.classList.remove('open'); }
      }
    });
  });

  /* ---------------- WhatsApp CTA links ---------------- */
  // Buttons carry data-wa-message; JS wires the real wa.me URL.
  // If the number is not configured yet, they gracefully fall back to #lead.
  qsa('[data-wa-message]', root).forEach(function (el) {
    if (WA_CONFIGURED) {
      el.setAttribute('href',
        'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(el.getAttribute('data-wa-message')));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    } else {
      el.setAttribute('href', '#lead');
      el.setAttribute('title', 'WhatsApp ordering connects soon — use the form below for now');
    }
  });

  /* ---------------- Lead form -> WhatsApp ---------------- */
  qsa('.pg-lead-form', root).forEach(function (form) {
    var gateway = form.getAttribute('data-gateway') || 'a payment gateway';
    var okBox = qs('.pg-form-success', form.parentElement);
    var warnBox = qs('.pg-form-warn', form.parentElement);

    function markInvalid(input, bad) {
      input.classList.toggle('pg-err', bad);
      return !bad;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      // Honeypot: bots fill it, humans never see it.
      var hp = qs('input[name="company_website"]', form);
      if (hp && hp.value) { return; } // silently drop spam

      var name = qs('[name="name"]', form);
      var phone = qs('[name="whatsapp"]', form);
      var email = qs('[name="email"]', form);
      var store = qs('[name="store_url"]', form);
      var message = qs('[name="message"]', form);
      var interest = qs('[name="interest"]', form);

      var valid = true;
      valid = markInvalid(name, !name.value.trim()) && valid;
      valid = markInvalid(phone, !/^[+\d][\d\s\-()]{5,}$/.test(phone.value.trim())) && valid;
      if (email && email.value.trim()) {
        valid = markInvalid(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) && valid;
      }
      if (!valid) { return; }

      if (!WA_CONFIGURED) {
        if (warnBox) { warnBox.style.display = 'block'; }
        return;
      }

      var lines = [
        'Hi Techosolution! I am ' + name.value.trim() + '.',
        'I am interested in: ' + (interest && interest.value ? interest.value : gateway) + '.',
        'My store: ' + (store && store.value.trim() ? store.value.trim() : 'not shared yet'),
        'My WhatsApp: ' + phone.value.trim()
      ];
      if (email && email.value.trim()) { lines.push('Email: ' + email.value.trim()); }
      if (message && message.value.trim()) { lines.push('Details: ' + message.value.trim()); }

      window.open(
        'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')),
        '_blank', 'noopener'
      );

      form.style.display = 'none';
      if (okBox) { okBox.style.display = 'block'; }
    });

    // Clear error styling while typing.
    qsa('input, textarea, select', form).forEach(function (input) {
      input.addEventListener('input', function () { input.classList.remove('pg-err'); });
    });
  });
})();
