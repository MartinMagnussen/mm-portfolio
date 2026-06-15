# MM Portfolio — Progress

Porteføljenettside for Martin Magnussen (brand: **MM**). Kreativ konseptutvikler og designer.

## Status: Fase 1 — Forside ✅ FERDIG (venter på godkjenning)

### Fase 1 — Forside
- `app/layout.tsx`: tre fonter (Space Grotesk / Archivo / Space Mono), full SEO + Open Graph, `lang="nb"`
- `app/globals.css`: designtokens, reset, svakt rutenett, `:focus-visible`, `prefers-reduced-motion`
- `components/Home.tsx`: orkestrering, spiral/liste-toggle, roterende showreel-badge, meny-knapp
- `components/CanvasView.tsx`: **3D spiral** (CSS 3D + GSAP). Låst view — skroll/sveip beveger kortene opp/ned langs en sløyfende ribbe, looper sømløst. Hover-zoom på kort.
- `components/Intro.tsx`: introanimasjon (mm-monogram + navn stiger inn, fader til forsiden). Spilles én gang per økt, hopper over ved reduced-motion. Ingen lyd.
- `components/ListView.tsx`: ren liste, aktiv rad lyser opp + skalerer, gradient-preview følger cursor
- `components/MenuOverlay.tsx`: fullskjerm-dialog (Esc, fokusfelle, scroll-lock)
- `lib/projects.ts`: placeholder-data (8 prosjekter, 2 featured)
- A11y/responsivt verifisert: reduced-motion + ≤768px → liste-fallback, ingen horisontal overflow på mobil, WCAG-kontrast, tastaturnav

### Rettelser (runde 2, etter tilbakemelding)
- **Font-bug fikset:** `--font-display/body/mono` var selvrefererende (cyklisk `var()`) → CSS ugyldig → falt tilbake til serif. Nå peker de på egne `--ff-*`-variabler fra next/font.
- Canvas → ekte **spiral** drevet av skroll (var tidligere fri dra-panorering).
- Hint: "dra for å utforske" → "skroll for å utforske".
- Lagt til introanimasjon og tydeligere hover på både kort og liste.

### Rettelser (runde 3, etter tilbakemelding)
- Spiral: tregere idle-drift, mild side-til-side sway, full frys ved hover, fikset klikkbarhet (pointer-events), større kort.
- **Liste-preview:** byttet ut mild rock-animasjon med at preview-kortet skalerer litt opp og _lener_ seg til en tilfeldig side ved hover — vinkel mellom −35…−10° eller 10…35° (settes per rad via `--tilt`).

### Rettelser (runde 4, etter tilbakemelding)
- **Liste-len skjer kun én gang per kort:** vinkelen trekkes på nytt bare når man faktisk bytter rad (guard `if (active === i) return`), ikke ved hver musbevegelse innen samme rad.
- **Spiral – feil overlapp fikset:** dybde (`z`) følger nå prominens (senter frem, kanter bak) i takt med `z-index`, så kort ikke lenger klipper over hverandre i feil rekkefølge.
- **Hover virker på alle synlige kort:** senket pointer-events-terskel (0.4 → 0.12), så semi-synlige kort også reagerer på hover/klikk.
- **Idle path-rotasjon:** hele banen vipper/ruller sakte på egen klokke (rotateX/Z, ~52s syklus) — uavhengig av scroll, fryser ved hover.

### Rettelser (runde 5, etter tilbakemelding)
- **Scroll mens man hoverer:** hover pauser nå kun spiralens *egen* idle-bevegelse (drift/sway/path). Smoothing mot `target` kjører alltid, så man kan scrolle gjennom spiralen selv med pekeren på et kort — ingen oppsamlings-bug/hopp lenger.
- **Stabil stabling (z-index):** dybde + z-index settes per kort i et fast vev `1,2,3,2,…` (uavhengig av skjermposisjon), nabokort deler aldri lag. Et kort som ligger bak et annet blir liggende bak.
- **Ekte placeholder-bilder:** lagt inn 5 nedlastede bilder i `public/projects/` (fra-sofa-til-sporty, sporty-rebrand, eide-bruktbil, sbg-helene, gt-challenge). Fjernet alle «Konsept X»-placeholdere. Kort og liste-preview viser nå bildene (gradient beholdt som fallback).

### Rettelser (runde 6, etter tilbakemelding)
- **Ingen cropping:** kort (spiral + liste-preview) er nå 16:9 som kildebildene, så hele bildet vises.
- **Hover på alle kort:** engasjement bestemmes av nærhet til kortets *senter* (ikke piksel under peker), og det aktive kortet løftes foran alt annet — delvis skjulte kort svarer nå.
- **Liste-len dempet:** maks ±20°, og maks 15° endring per bytte (kan ikke hoppe fra 20 til −20); vandrer rolig fra 0.
- **Blurry bakgrunn:** uskarp, dempet versjon av senter-/aktivt kortbilde dekker bakgrunnen, bak rutenettet (egen grid-layer over wash-en).
- **Scroll påvirker rotasjon:** scroll legger til en knapt merkbar rull på hele banen.
- **Magnetiske kort:** kort trekkes mot musepekeren når den er innenfor en omkrets — sterkest nær senter, null lenger unna; kortet følger pekeren mens man beveger den.

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
