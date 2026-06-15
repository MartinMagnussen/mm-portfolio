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

### Rettelser (runde 7, etter tilbakemelding)
- **Liste-preview mye større og bak teksten:** preview-kortet er nå sentrert bak titlene (`clamp(340px, 52vw, 720px)`, 16:9), ikke lenger et lite kort som følger cursoren. Teksten ligger over bildet med `mix-blend-mode: difference` (scopet via `isolation: isolate` på seksjonen), så titlene inverterer over bildet og holder seg lesbare — og leser lyst mot den nær-svarte bakgrunnen ellers. Behold ±10°-len og myk inn-/ut-toning. På touch/≤768px (ingen preview) settes blend tilbake til normal.

### Rettelser (runde 8, etter tilbakemelding)
- **Glass-bobler på spiral/liste-toggle:** toggle-gruppen er nå en glass-pille (backdrop-blur + saturate, svak hvit kant, inset-highlight, dyp skygge) så etikettene er lesbare over både spiral og liste. Aktiv etikett får en egen glass-lozenge. Meny-knappen oppgradert til samme glass-look. (Ekte refraksjon/displacement er ikke pålitelig støttet i CSS på tvers av nettlesere — brukte derfor polert glassmorfisme.)
- **Liste-preview enda større:** `clamp(440px, 68vw, 960px)` så kortet dekker hele titlene. Teksten ligger foran kortet og inverterer via `mix-blend-mode: difference` for lesbarhet ved lav kontrast.

### Rettelser (runde 9, etter tilbakemelding)
- **Liste-preview mindre + magnetisk, ankret på linjen:** kortet er nå `clamp(320px, 44vw, 560px)` (ikke for stort), forankret i den hovrede radens senter og forskyves mot musepekeren (`--px/--py`, faktor 0.2) — peker oppe-til-høyre for teksten → kortet er der også; nede-til-venstre → likeså. Teksten ligger fortsatt foran og inverterer via `mix-blend-mode: difference`.
- **Tydeligere glass-pille:** sterkere fyll/kant/skygge på spiral/liste-toggle (bg 0.10, kant 0.22, blur 18 + saturate 1.8) så bakgrunnen rundt knappene er synlig; aktiv-lozenge også sterkere.

### Rettelser (runde 10, etter tilbakemelding)
- **Glidende toggle:** spiral/liste er nå en to-kolonners glass-pille med en lozenge som *glir* mellom etikettene (`translateX` på `[data-view]`, 0.38s ease, fryser ved reduced-motion).
- **Blur bak knappene:** pillen har backdrop-blur (18px) og den glidende lozengen har egen blur (6px) så etikettene er lesbare uansett hva som ligger bak.

### Rettelser (runde 11, etter tilbakemelding)
- **Tykkere display-font med mer personlighet:** byttet Space Grotesk → **Bricolage Grotesque** (vekter 500–800). Logo 800, liste-titler 700, kort-titler 700, strammere letter-spacing.

### Rettelser (runde 12, etter tilbakemelding)
- **Ringen rettet opp:** forrige forsøk la dybden på feil akse — midtbåndet havnet bakerst (lite + blurry) og kortene snudde rundt. Nå er banen en ellipse i skjermplanet: kortene stiger på **venstre** side og kommer **ned igjen på høyre** (`x = −sin·ampX`, `y = cos·ampY`, én sømløs løkke). Størst når de sveiper gjennom midten (`scale` topper ved midthøyde), mindre øverst/nederst. Kun den **øvre buen** vipper bakover (`z = −far·240`), der den dempes og blurres lett (opptil 4px). Ingen opp-ned-vending. Stabling etter dybde; bakgrunnsbildet følger det fremste (nederste) kortet.

### Rettelser (runde 13, etter tilbakemelding)
- **Transportbånd-løkke i stedet for flat ring:** fronten er nå *identisk* som før (kort stiger opp midten, svinger sideveis, går ut av skjermen topp/bunn). Andre halvdel av syklusen er en **retur-bane** som kommer ned igjen lengre **bak** (`z = −520px`) og til **høyre** (`+17% av bredden`), dempet og blurret (5px). Banebyttene skjer utenfor skjermkanten der kortene har fadet ut (vertikal fade `0.32→0.6·vh`). Front-bane over retur-bane i stabling.

### Rettelser (runde 14, etter tilbakemelding)
- **Fast avstand mellom kort + duplikater:** løkka fylles nå etter en *gitt avstand* (`CARD_GAP_FRAC = 0.32·vh`), ikke etter antall prosjekter. Antall slots = `prosjekter × kopier`, der `kopier` rundes fra ideelt antall (~10 slots) delt på prosjektantallet — alltid et helt multiplum, så hver kopi havner jevnt ut av fase (én på front-banen, dens duplikat på retur-banen). Med 5 prosjekter → 10 slots (2 kopier hver). Duplikat-kort er `aria-hidden` + `tabIndex −1` så skjermleser/tastatur kun ser originalene. Når det er nok prosjekter (≥ ideelt antall) brukes ingen duplikater.

### Rettelser (runde 15, etter tilbakemelding)
- **Retur-bane-kort (de som går motsatt vei nedover):** tre justeringer. (1) *Mindre* — egen `BACK_SCALE = 0.58` brukes nå i skala-formelen i stedet for den gamle 0.82. (2) *Ikke klikkbare/hoverbare* — `pointerEvents` settes kun `auto` for front-bane-kort; et `backCard[]`-flagg ekskluderer dem også fra magnet-/engasjement-løkka, så de kan verken klikkes eller løftes fram. (3) *Lengre til høyre* — `BACK_SHIFT` hevet fra 0.17 → 0.27 (× viewport-bredde).

### Rettelser (runde 17, etter tilbakemelding)
- **Mykt/dempet scroll for desktop (treghet):** musehjul mater nå en hastighet som blør inn i målet og decay-er, så transportbåndet glir mykt til ro i stedet for å hakke. `WHEEL_IMPULSE = 1 − friction` gjør at total scroll-distanse er uendret — kun jevnere. Touch (mobil/iPad) skriver fortsatt målet direkte og er helt upåvirket. `prefers-reduced-motion` hopper over tregheten. (Valgte lett egenutviklet treghet framfor GSAP ScrollSmoother, som er en betalt Club-plugin og uansett er laget for ekte side-scroll, ikke dette faste lerretet.)

### Interaktivt grid (runde 19)
- **Pikselert spotlight på bakgrunns-gridet:** den statiske CSS-grid-div-en i CanvasView er byttet ut med `components/GridGlow.tsx` — et lett `<canvas>` som tegner grid-linjene (samme 64px-celler, `--line`-alpha) og lyser opp cellene rundt musepekeren. Hver celle får jevn lysstyrke etter avstanden fra cellas *senter* til pekeren (smoothstep-falloff), så fade-en er kvantisert per firkant = pikselert. Glow-en eases mykt mot pekeren, og kun cellene innenfor radien tegnes (billig uansett skjermstørrelse). rAF-loopen stopper når pekeren hviler/forsvinner og starter igjen ved bevegelse. `prefers-reduced-motion` → kun statiske linjer, ingen glow. `pointer-events: none` så kortene fortsatt er klikkbare. Justerbare knapper i fila: `RADIUS` (rekkevidde i celler), `MAX_ALPHA` (lysstyrke), `EASE` (treghet).

### Rettelser (runde 18, etter tilbakemelding)
- **Mobil-klemme reversert:** runde 17 begrenset front-kortenes svingutslag så de holdt seg innenfor skjermkanten — men det gjorde bevegelsen unaturlig (kortene kunne ikke svinge langt nok ut). Fjernet helt; `ampX` er tilbake til `min(vw·0.27, 360)`. Kortene får igjen gå utenfor viewporten som før.
- **Tydeligere desktop-treghet:** glidet var nesten umerkelig (`WHEEL_FRICTION = 0.85` dødde raskere enn den eksisterende `current→target`-glattingen og ble dermed maskert). Hevet til `0.93` så glidet varer lengre enn glattingens tidskonstant og faktisk merkes. Distansen er fortsatt bevart via `WHEEL_IMPULSE`.

### Ytelse (runde 16)
- **Bildeoptimalisering (–87 % nedlasting):** prosjektbildene var 4K JPEG (3840×2160, ~2,56 MB totalt) men vises aldri bredere enn ~500px. Skalert til 1600px + WebP (q80) → ~338 KB totalt, visuelt identisk. Originalene flyttet til `assets/project-originals` (utenfor `public/`, deployes ikke) for re-eksport. Skript: `scripts/optimize-images.mjs`, kjør med `npm run optimize-images` (idempotent). `lib/projects.ts` peker nå på `.webp`. `sharp` lagt til som dev-avhengighet.
- **Mindre layout-arbeid i render-loopen:** `getBoundingClientRect` på alle kort leses nå kun når musepekeren er inne i viewporten (magnet-effekten kan uansett ikke skje ellers). Sparer en layout-flush per frame uten synlig endring.

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
