# Chaitanya — developer portfolio

Next.js, React, TypeScript, and a fixed black-and-silver theme. Static export; no backend or paid runtime service is required.

## Run and verify

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run test:portrait
npm run test:contributions
npm run test:contact
npm run build
```

Development URL: http://localhost:3000. Production files are exported to `out/`. The project uses Webpack for compatibility with this Windows environment.

## Content

`src/data/site-config.ts` contains contact information, experience, skills, and articles. Contact links and footer Say hello open the EmailJS popup form; direct Email and Call links open mail and calling apps. The supplied LinkedIn profile is linked in the popup and footer, using its clean profile URL without share tracking parameters. Add a résumé and canonical `site.url` when available; no URLs are invented.

`src/data/projects.ts` contains twelve entries: six live websites, three supplied mobile applications, and three earlier concept/research studies. Rakshak is discoverable in Mobile apps, Applied AI, and Research through multiple categories. Both the cards and project detail routes use the same data.

The six live website previews are actual homepage captures from 29 October 2026, stored locally as 1440px WebP images with lazy loading. They total about 391 KB versus 6 MB for the original captures. The cards link to the supplied deployments. Captures represent that date rather than a live iframe.

Moto Stock, MediStock, Rakshak, OppTrack, CampusConnect, and Weather-aware fuel prediction use matching scalable SVG interface illustrations. The three new covers total about 11.5 KB. The labels distinguish built-app illustrations, concepts, and research; the weather chart is explicitly illustrative. Regenerate all six with `node scripts/create-app-previews.cjs`. Public app downloads have not been supplied.

The About section uses the owner's new outdoor photo, in full color and without cropping. `public/images/chaitanya-about.svg` embeds a lossless WebP version of all 707 × 709 original pixels, verified byte-for-byte after decoding. It is an SVG container for a photograph, not a vector tracing or AI upscale. Regenerate with `node scripts/create-about-portrait.cjs PATH_TO_ORIGINAL_PNG`. It is lazy loaded and does not replace the hero particle portrait.

## Navigation and project gallery

The project already uses the shadcn-style `src/components/ui/` directory, configured by `components.json` and the `@/components/ui` alias; global styles live in `src/app/globals.css`. No framework migration is needed. `src/lib/utils.ts` provides the usual `cn` helper through clsx and tailwind-merge.

`m-random-letter-swap-1.tsx` integrates the supplied navigation into the existing header. The missing primitive is adapted from Cnippet UI's MIT-licensed RandomLetterSwap source (license in `licenses/cnippet-ui.txt`), using the shared framer-motion dependency. Letters swap in random order on pointer hover or keyboard focus, with the supplied 0.025-second stagger and 0.6-second spring. Existing anchors, active-section indicators, mobile navigation, and the Contact popup remain connected. Reduced motion keeps readable static labels.

`ProjectGallery.tsx` uses the supplied `shared-element-gallery.tsx` composition with the real project assets. Masonry expands from one to four columns; filtering retains all existing categories. Selecting a preview opens a shared-element lightbox with the project description, website link where supplied, and case-study link. Native dialog semantics handle keyboard focus. Escape, the close button, backdrop click, or a vertical drag dismiss it; reduced motion removes the spatial animation. Closing restores focus and scroll position. No demo stock photographs are used.

`ExperienceSection.tsx` applies the supplied `animated-background.tsx` hover component to the five real roles. Cards use three columns on desktop, two on tablets, and one on phones. The shared spring background follows hover or keyboard focus, preserves each child's handlers, and respects reduced motion; no unsupported selection ARIA is added to static articles.

Experience includes Dealatecorp, RAG research at IIIT Dharwad, cybersecurity at Aegion Dynamic Solutions, Vice President at CODEIAM, and Aegion Dynamic Community. Dates and metrics are omitted where not supplied.

The current Dealatecorp role is Web and App Development Intern, also reflected in About and page metadata.

## Contact popup and EmailJS

The standalone “Have something in mind?” section is removed. Navigation Contact, the hero Contact link, Let’s talk, and footer Say hello open the contact popup on every portfolio route. The footer retains the `#contact` anchor and direct Email, Call, LinkedIn, and GitHub links.

The native modal contains keyboard focus. Escape, the close button, or the backdrop dismiss it and restore focus and scroll position. The form and decorative globe load on demand; drafts and in-flight submissions survive closing/reopening. Mobile shows the form first and skips the globe.

The form validates name, email, optional company, and message, prevents duplicate submissions, and sends through EmailJS using the existing public settings in `src/data/contact-config.ts` (template `template_opzte3v`). Email delivery to `chaitu4765@gmail.com` was previously confirmed by the owner. No private key is required. See `emailjs/README.md` for template configuration; `npm run test:contact` uses mocked transport and does not send real messages.

## Hero and performance

The reference-inspired sequence is glowing falling dot → line revealing PORTFOLIO → CHAITANYA → assembling portrait. The permanent role line shows Full-stack Developer and Android Developer. On mobile, the portrait sits above the name and the roles stack to fit the screen.

`src/lib/portrait-renderer.ts` draws all 52,042 particles using one WebGL draw call per frame, with no JavaScript particle loop. The static vertex buffer is uploaded once. Its 416,336-byte binary replaces the previous 1,732,933-byte JSON download, a 76% reduction. Quantization preserves the sample count and positions to within 0.008 source pixels.

Particle data is preloaded at high priority. Rendering starts on the first frame after the actual name animation finishes, using its Web Animations completion promise rather than a new timer after hydration. The cloud is visible immediately and settles over 2.1 seconds, then drawing stops. Hidden tabs and offscreen scenes pause work. Pointer movement translates the settled canvas instead of drawing the particles again. Pixel density is capped at 2x and the framebuffer at approximately four million pixels.

The high-resolution 1440×1920 WebP fallback is requested only if WebGL/data fails (or JavaScript is disabled). It stays hidden until the text and particle sequence completes (normally 7.7 seconds); it never flashes under the forming particles. Reduced-motion visitors see the settled portrait immediately. The original portrait and SVG remain available as source assets, but the large SVG/JSON are not requested by the hero.

Regenerate portrait assets in order:

```sh
node scripts/create-portrait-particles.cjs
node scripts/optimize-portrait.cjs
```

`npm run test:portrait` checks every packed sample against the source and exercises renderer lifecycle with simulated browser APIs: delayed start, settling, hidden/offscreen pause, resize, reduced motion, network/GPU fallback, context restoration, cleanup, and mobile geometry. These checks do not measure real-device FPS or replace a browser GPU test.

The offline videos in `public/media/` are earlier reference renders, not browser recordings; the live CSS/WebGL website is authoritative.

## GitHub skyline

The skyline appears immediately after the hero, with projects after it. Saved public contribution data ships with the page, so the chart renders without waiting for an API call or an extra chart chunk. Live activity refreshes in the background and failures keep the existing chart visible.

Activity uses `chaitu4765` through the public GitHub Contributions API. A dated saved snapshot is visibly labeled when the service is unavailable. No fabricated demo counts are used. The component supports 2D/3D views, orbit dragging, keyboard navigation, and reduced motion.

## Deploy

Run `npm run build` and publish `out/` to a static host, or import into a Next.js-compatible host. Set `site.url` before publishing to generate the canonical sitemap. No deployment was made by these local updates.

## Doodle Crew footer

The supplied React component is integrated at `src/components/ui/doodle-crew-footer.tsx`, configured through `PortfolioFooter.tsx`. Its wordmark is CHAITANYA, with real portfolio navigation and contact actions. It uses the fixed dark palette and existing local font choices. The component loads as the footer approaches the viewport. Offscreen and hidden-tab animation loops stop; reduced-motion users get a static scene. No extra dependencies are required.
