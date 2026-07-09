# Social share (Open Graph) images

These are the 1200×630 PNGs used for `og:image` / `twitter:image`, wired up in
each page's metadata via `lib/og/meta.ts` (`ogImages(slug, alt)`).

They are shipped as **static files on purpose**. They were originally generated
with `next/og` (satori + resvg), but that renders through WebAssembly, which is
memory-hungry at build time and can OOM on constrained builders. Serving
pre-rendered PNGs keeps `next/og` out of the production build entirely.

## Files → routes

| File | Route | Headline |
|---|---|---|
| `home.png` | `/` | Payments that just *work* |
| `pricing.png` | `/pricing` | Transparent *interchange-plus* pricing |
| `about.png` | `/about` | Payments, *done right* |
| `partnerships.png` | `/partnerships` | Grow with a *partner* |
| `contact.png` | `/contact` | Let's price *your business* |
| `product-payments.png` | `/products/payments` | Accept every *card* |
| `product-pos.png` | `/products/pos` | Take a payment *anywhere* |
| `product-online.png` | `/products/online` | A checkout that *converts* |
| `product-invoicing.png` | `/products/invoicing` | Send a link, *get paid* |
| `product-recurring.png` | `/products/recurring` | Predictable *revenue* |
| `product-terminal.png` | `/products/terminal` | Key in a sale *anytime* |
| `product-ach.png` | `/products/ach` | Move money for *pennies* |
| `product-api.png` | `/products/api` | Payments, *your way* |
| `industry-retail.png` | `/industries/retail` | Built for *the counter* |
| `industry-food.png` | `/industries/food` | Turn tables *faster* |
| `industry-services.png` | `/industries/services` | Get paid for *the work* |
| `industry-ecommerce.png` | `/industries/ecommerce` | A checkout customers *trust* |
| `industry-nonprofits.png` | `/industries/nonprofits` | More of every gift *goes to work* |
| `industry-highrisk.png` | `/industries/highrisk` | Approved when *others say no* |
| `industry-agents.png` | `/industries/agents` | Grow your *portfolio* |

## Regenerating

The originating `next/og` template lives in git history at commit
`85a2653` (`lib/og/render.tsx` + the `opengraph-image.tsx` routes). To change a
card: on a normal dev machine (where WASM has room), restore those files, run
`next dev`, fetch each `…/opengraph-image` route into this folder, then remove
the routes again before deploying. Or simply replace the PNG here with any
1200×630 image.
