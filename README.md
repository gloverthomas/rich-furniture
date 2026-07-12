# ARV — Danish furniture, made to be inherited

An immersive ecommerce site for a third-generation Copenhagen joinery selling
solid-oak tables — seven pieces across dining, coffee and side tables.
Editorial light-luxury design, cinematic scroll animation, and a commerce layer
shaped like the Shopify Storefront API so real Shopify can be dropped in later.

## Stack

- **Next.js 16** (App Router, TypeScript, CSS Modules — no UI framework)
- **GSAP + ScrollTrigger + SplitText** for scroll-driven motion, **Lenis** for smooth scroll
- **Fraunces** (display serif) + **Instrument Sans** via `next/font`
- **Mock commerce provider** with a local catalog and cookie-backed cart
- **Vitest** (unit) + **Playwright** (E2E, screenshots, reduced-motion checks)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (static + SSG product pages)
npm test           # vitest unit tests (commerce provider, money formatting)
npx playwright test e2e/shop-flow.spec.ts    # E2E cart flow + reduced motion
npx playwright test e2e/screenshots.spec.ts  # screenshots at 320/768/1024/1440 + overflow checks
```

## Architecture notes

- `src/lib/commerce/types.ts` mirrors Shopify Storefront API objects
  (`MoneyV2`, `ProductVariant`, `Cart`). Editorial fields (story, details,
  dimensions) map to Shopify metafields.
- `src/lib/commerce/index.ts` selects the provider via `COMMERCE_PROVIDER`
  (only `mock` exists today). A `ShopifyProvider` implements the same three
  methods with GraphQL and swaps the cart cookie from serialized lines to a
  Shopify cart id, with checkout going to the real `cart.checkoutUrl`.
- All motion lives in `src/components/layout/AnimationOrchestrator.tsx`,
  driven by `data-*` attributes; GSAP and Lenis are dynamically imported and
  fully disabled under `prefers-reduced-motion`. Pages render complete
  without JavaScript.
- Route transitions are a CSS-only ink veil in `src/app/template.tsx`.

## Going live checklist

1. Create a Shopify store + Storefront API access token.
2. Implement `ShopifyProvider` against `src/lib/commerce/provider.ts`.
3. Replace the remaining Unsplash site imagery (`public/site/`) with brand
   photography — product images are already the real catalogue.
4. `vercel deploy` — no config needed.
