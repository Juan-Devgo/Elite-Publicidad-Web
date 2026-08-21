# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

- `pnpm dev` / `pnpm start` — Astro dev server
- `pnpm build` — production build to `dist/` (runs `astro check` type validation first via `@astrojs/check`)
- `pnpm preview` — serve the built site
- `pnpm astro -- <cmd>` — run the Astro CLI (e.g. `pnpm astro -- check`)

No test runner or lint script is configured. Formatting is Prettier with `prettier-plugin-astro` (config in `prettierrc.json`); run via `pnpm exec prettier`.

There is no automated type-check script other than what `pnpm build` runs. To type-check without building: `pnpm astro -- check`.

## Architecture

Static marketing site for "Élite Publicidad" built with **Astro 5 + React 19 islands + Tailwind 4**, rendered from content stored in a **Strapi CMS**. The Astro app is presentation-only; all copy, images, navigation, and contact data come from Strapi at build/request time.

### CMS data flow (the core pattern)

1. **`lib/content-manager.ts`** is the single CMS gateway. Each `get*` function builds a Strapi `populate` query with `qs` and calls `getContent()`, which fetches `CMS_BASE_URL + url` and returns `data.data` (Strapi's envelope). `getContent` swallows errors and returns `null` — callers must tolerate `null`/missing fields (note the heavy `?.` and `?? []`/`?? ""` defaulting throughout the components).
2. **`CMS_BASE_URL`** comes from `PUBLIC_CMS_URL` (`.env` → `http://localhost:1337`, `.env.production` → the live CMS). These `.env` files are gitignored.
3. **`lib/utils.ts` `getMedia(raw, size)`** normalizes a raw Strapi media object into the local `Media` type (`types/media.ts`), resolving the right `formats[size]` (`large`/`small`/`thumbnail`), prefixing the URL with `CMS_BASE_URL`, and detecting image-vs-video. Always run CMS media through `getMedia` before use; never read Strapi media fields directly in markup.
4. **`src/layouts/main.astro`** is the shared shell. It fetches navbar, footer, contact bar, and WhatsApp button data itself, so every page wrapped in `<Main>` gets these chrome elements without re-fetching. Page-specific content is fetched in the page's own frontmatter (e.g. `index.astro` calls `getHeaderInicio()`).

When adding a new CMS-backed section: add a `get*` function in `content-manager.ts` with its `populate` shape, fetch it in the relevant page/layout frontmatter, map media fields through `getMedia`, and pass plain props down to components.

### Components

- `.astro` components are server-rendered. `.tsx` components are React islands and need a `client:*` directive when used (see `client:load` on `NavbarClient`, `WhatsAppButton`).
- Several icons exist in both `.astro` and `.tsx` form (e.g. `icons/WhatsApp.astro` vs `WhatsApp.tsx`) — use the `.tsx` version inside React islands, the `.astro` version in Astro markup.
- Images from the CMS are optimized through Astro's `getImage` (`astro:assets`) — see `Navbar.astro` and the WhatsApp avatar in `main.astro`. `astro.config.mjs` whitelists remote image hosts via `image.remotePatterns`, so new CMS image domains must be added there.

### Routes

File-based routing in `src/pages/`: top-level pages (`index`, `nosotros`, `contactanos`) plus a `servicios/` subtree (`publicidad-exterior`, `insumos-publicitarios`, `promocionales`, `corte-laser-y-avisos`). `@astrojs/sitemap` auto-generates the sitemap.

### Conventions

- Domain/content field names are in **Spanish** (`paginas`, `subpaginas`, `redes`, `telefonos`, `conocenos`, `callToAction`) because they mirror the Strapi schema. Match this when touching CMS-mapped code.
- Path aliases are not configured; imports use relative paths (`../../lib/...`, `../../types/...`).
