# MM Portfolio — Progress

Porteføljenettside for Martin Magnussen (brand: **MM**). Kreativ konseptutvikler og designer.

## Status: Fase 1 — Forside ✅ FERDIG (venter på godkjenning)

### Fase 1 — Forside
- `app/layout.tsx`: tre fonter (Space Grotesk / Archivo / Space Mono), full SEO + Open Graph, `lang="nb"`
- `app/globals.css`: designtokens, reset, svakt rutenett, `:focus-visible`, `prefers-reduced-motion`
- `components/Home.tsx`: orkestrering, canvas/liste-toggle, roterende showreel-badge, meny-knapp
- `components/CanvasView.tsx`: floating kort (CSS 3D + GSAP), dra-for-å-panorere, cursor-parallax, idle-float
- `components/ListView.tsx`: ren liste med gradient-preview som følger cursor
- `components/MenuOverlay.tsx`: fullskjerm-dialog (Esc, fokusfelle, scroll-lock)
- `lib/projects.ts`: placeholder-data (8 prosjekter, 2 featured)
- A11y/responsivt verifisert: reduced-motion + ≤768px → liste-fallback, ingen horisontal overflow på mobil, WCAG-kontrast, tastaturnav

### Fase 0 — Oppsett

### Gjort
- Next.js 16 (App Router, TypeScript, ESLint) scaffoldet
- Node oppgradert til v26 (Next 16 krever ≥20.9)
- GSAP + Lenis lagt til
- UI UX Pro Max-skill installert i `.claude/skills/`
- `.gitignore` justert (Python-cache fra skill)
- GitHub: https://github.com/MartinMagnussen/mm-portfolio (offentlig)
- Vercel: auto-deploy fra `main` → **https://mm-portfolio-zeta.vercel.app**

### Senere
- Eget domene (martinmagnussen.no) — kobles på slutten via Vercel → Settings → Domains

## Designbeslutninger (godkjent)
- **Estetikk:** near-black canvas (~#0A0A0B), off-white tekst, svakt rutenett. Farge fra prosjekt-thumbnails, nøytralt UI.
- **Forside:** floating "canvas"-visning (CSS 3D + GSAP) + ren liste-visning med toggle. Liste = reduced-motion/tastatur-fallback.
- **Identitet:** MM-monogram (logo + favicon), mono-mikrotekster.
- **Ingen lyd:** ingen bakgrunnslyd, ingen lyd-toggle i UI.
- **Prosjektsider:** hero-bånd → case → "neste prosjekt". Hero: "Fra sofa til Sporty" + Sporty-rebrand.
- **Tech:** Next.js + GSAP + Lenis. three.js kun ved faktiske 3D-modeller.
- **Krav:** WCAG AA, `prefers-reduced-motion`, alt-tekst, tastaturnav, høy Lighthouse, progressiv bildelasting.

## Faseplan (checkpoint mellom hver)
0. **Oppsett** — ✅ ferdig
1. **Forside** — ✅ ferdig (canvas + liste + menu, placeholder-kort)
2. **Prosjektsider** — mal + fyll inn per levert mappe
3. **Om meg / kontakt**
4. **Polish** — ytelse, a11y, responsivt, SEO/OG, pre-delivery-sjekkliste

## Neste steg
Fase 2 — prosjektsider (`/prosjekt/[slug]`): hero-bånd → case → "neste prosjekt". Starter når Fase 1 er godkjent og første prosjektmappe er levert.

## Filstrategi
- Inspo-materiale: midlertidig, utenfor repo, slettes etter designgodkjenning (allerede godkjent — kan slettes).
- Web-klare bilder/video: i repoet (komprimert).
- Tunge fullversjoner: hostes eksternt, lazy-load. Ikke Git LFS.
