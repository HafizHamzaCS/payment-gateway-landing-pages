# Techosolution — Payment Gateway Landing Pages

Premium lead-generation landing pages for Techosolution's WooCommerce payment gateway plugins:

| Page | Product | Plugin version |
|---|---|---|
| `index.html` | Hub — all gateways, bundle & custom | — |
| `kuraimi.html` | Kuraimi E-Pay (Kuraimi Islamic Bank, PIN flow) | v1.2.1 |
| `cashpay.html` | CashPay (Tamkeen, OTP flow) | v1.1.0 |
| `alamal-bank.html` | Al Amal Bank (SMS confirmation) | v1.1.1 |

**Live site:** `https://hafizhamzacs.github.io/payment-gateway-landing-pages/` *(after GitHub Pages is enabled)*

## Before going live

**Set the WhatsApp number.** Open `assets/js/pg.js` and replace the `WHATSAPP_NUMBER` constant at the top:

```js
var WHATSAPP_NUMBER = 'REPLACE_ME';   // → e.g. '967777123456' (digits only, no +)
```

Until it is replaced, CTA buttons gracefully fall back to the lead form and the form shows a "not connected yet" notice — no broken links.

## Pricing (on the pages)

| Product | Single Site | Installed (most popular) |
|---|---|---|
| Kuraimi E-Pay | $89/year | $189 one-time |
| CashPay | $99/year | $199 one-time |
| Al Amal Bank | $89/year | $189 one-time |

All-3-gateway bundle: **$199/year**. Custom gateway development: **from $499**. Renewals at 40% after year one. 7-day money-back: if we can't get it running on your stack, you get a refund.

## Tech

- **Tailwind CSS** via CDN + shared custom CSS in `assets/css/pg.css`
- **Vanilla JS only** in `assets/js/pg.js` — wrapped in an IIFE, zero globals
- **Mobile-first**, real media queries, premium fintech design (Inter font, gradient accents)
- Lead form has **no backend**: it validates, then opens a prefilled `wa.me` chat + shows an inline success state. Includes a honeypot anti-spam field.

## Embedding in WordPress (zero conflicts)

**Recommended: iframe embed.** Fully isolated — no CSS/JS can leak into the theme.

```html
<iframe src="https://hafizhamzacs.github.io/payment-gateway-landing-pages/kuraimi.html"
        width="100%" height="2800" style="border:0;max-width:100%;"
        title="Kuraimi E-Pay gateway for WooCommerce" loading="lazy"></iframe>
```

Swap the `src` for `cashpay.html`, `alamal-bank.html`, or `index.html`. Adjust `height` to taste (pages are long; ~2600–3000px). Paste into a **Custom HTML block**.

**Alternative: direct paste.** All custom CSS is scoped under the `.pg-landing` wrapper and there are no global resets, so pasting the page markup into a Custom HTML block won't restyle the theme. (Note: the Tailwind CDN script applies its preflight to the whole page — the iframe method avoids this entirely, which is why it's recommended.)

## Honest-claims policy

Copy claims only what the code does: "built for the latest WordPress/WooCommerce", "Checkout Blocks + classic checkout", "HPOS compatible". No "tested on live stores" claims — staging verification is still pending. Update the copy once staging tests pass.

## Structure

```
index.html  kuraimi.html  cashpay.html  alamal-bank.html
assets/css/pg.css   ← all custom styles, scoped under .pg-landing
assets/js/pg.js     ← IIFE: mobile nav, FAQ accordion, smooth scroll,
                      WhatsApp CTAs, lead-form → wa.me
```
