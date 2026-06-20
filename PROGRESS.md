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

### Scroll-dempning (Lenis) + progresjonsrail på CV (runde 35)
- **Mykt/dempet scroll på under-sidene:** prosjektsider, om-siden og CV-en får nå Lenis-basert scroll-dempning via en liten klient-komponent (`SmoothScroll.tsx`) som monteres per side (ikke i root-layouten, så forsiden beholder sin egen faste-lerret-treghet og blir ikke rørt). Lenis scroller det ekte vinduet (ingen transform-wrapper), så native `scroll`-events fortsatt fyres og `getBoundingClientRect` er korrekt — de scroll-drevne tidslinjene fungerer uendret. `lerp: 0.09` gir tyngden; touch holdes native (finger-scroll har egen momentum). `prefers-reduced-motion` hopper over Lenis helt. Lenis var allerede en avhengighet, men ikke tatt i bruk før nå; la til bibliotekets anbefalte base-CSS i `globals.css`.
- **Progresjonsrail på CV-en:** en fast, vertikal lesefremdrifts-rail i samme visuelle språk som prosess-tidslinjen på «Fra sofa til Sporty» — dim spor, lime glow-fyll som vokser med scroll, og en sjekkpunkt-node per CV-seksjon (om meg, erfaring, utdanning, ferdigheter) som lyser opp når fyllet passerer den. Ny gjenbrukbar komponent `ScrollProgress.tsx` (+ `.module.css`): tar en liste med seksjons-id-er, regner ut hvilken scroll-andel hver seksjon krysser lese-linja (midt i viewport) på, plasserer noden der og tenner den på samme terskel — `--progress` og `data-active` driver alt i CSS. Pinnet til høyre kant (unna nedlastings-knappen nede til venstre), skjult under 900px og i print/PDF. Dekorativ (`aria-hidden`); overskriftene bærer fortsatt strukturen.

### Cursor (kun prikk) + navbar-glow + mobil-trykk + bildevarianter (runde 34)
- **Cursor forenklet til én prikk:** den store outline-firkanten (ringen) er fjernet helt – forsøket på å la den omslutte og rotere med kort/knapper ble droppet. Igjen står den lille lime-firkanten som peker, med velocity-squeeze og press-dipp som før, nå med mer etterheng (`DOT_SPEED 0.35→0.14`). Firkanten holder seg akse-rettet (følger bakgrunnsrutenettet) og roterer ikke lenger med farten — den bare skvises/strekkes. All ring-logikk (form-/rotasjons-/radius-matching, `data-cursor="hide"`-soner, `data-cursor-shape`-markører i ListView/PortraitDeck) er tatt vekk.
- **Klikk på forsidekort drives nå av glow-en, ikke nettleserens hit-test:** kortene reagerte ikke på trykk (spesielt lavere nede / venstre side) selv om glow-en slo inn. Årsak: nettleserens native treff-deteksjon på `<a>` er upålitelig inne i `preserve-3d`/`perspective`-rommet — den tester ofte mot en akse-rettet boks som ikke matcher det skrå, roterte kortet du faktisk ser, så treffsonen forskyves mest for kort som er mest skjeve (lengre ned/til siden). Løsning: rAF-løkka speiler det «engasjerte» kortet (det som glower) ut i en ref, og en `click`-lytter på viewporten navigerer til det kortet via `router.push` i stedet for å stole på ankerets eget treff. Dermed gjelder regelen «glower det, så åpner et klikk det». `<a>`-en beholdes for tastatur, SEO og cmd/ctrl/shift/midt-klikk («åpne i ny fane»): de faller gjennom til ankeret, vanlige venstreklikk håndteres av løkka. Touch bruker fortsatt ankeret direkte.
- **Kort-stabling på forsiden fikset (stabil rekkefølge):** front-banens kort lå alle på `z = 0` med samme `z-index: 1000`, så overlapp falt tilbake på DOM-rekkefølge — et kort som lå bak kunne klippe over (og fange klikk fra) det foran. Nå rangeres front-kortene etter hvor langt de har kommet langs banen (`lp`), ikke etter sentralitet: siden alle kortene beveger seg i samme takt er lp-avstanden mellom to kort konstant, så de bytter aldri rekkefølge mens begge er synlige (de eneste hopp skjer ved bane-overgangene utenfor skjermkanten der kortet alt er falmet til 0). Kort lavere i banen (nylig inn) ligger foran og trekker seg bakover når de stiger — så et kort beholder rekkefølgen det hadde da det kom inn i view. Implementert som en liten ekte dybde-dytt (`z = (1−lp)·4px`, det `preserve-3d` faktisk sorterer på, neglisjerbart mot 1400px perspektiv) speilet i `z-index` (`1000 + (1−lp)·1000`). Fikser samtidig klikk-treffsikkerheten: visuell stabling og hit-test er nå samstemte, så et kort bak fanger ikke lenger trykk ment for kortet foran.
- **Grid-glowet etterhenger nå:** den lime spotlighten som lyser opp rutene bak (`GridGlow`) fulgte pekeren momentant (`EASE 1`). Nå trekker den etter med halve farten til musepeker-firkanten (`EASE 0.07` = 2× tregere enn `DOT_SPEED 0.14`), så glowet glir mykt etter prikken i stedet for å klistre seg til den.
- **Navbar-glow beholdt:** nav-pillen får lime-rim + glow på hover, og logo-bokstavene får lime text-shadow – ren CSS-hover, uavhengig av cursoren.
- **Glow på portrettet (om-siden):** når man hovrer bildedekket lyser kun det øverste kortet opp (lime rim + halo lagt oppå dybdeskyggen, `.stack:hover .top`), samme interaktive lime-språk som resten av siden.
- **Mobil – trykking av forside-kort fikset:** to grep i `CanvasView`. (1) På `coarse`-pekere er all idle-bevegelse (drift/sway/path) og peker-magnetisme av, så kortene står stille og er lette å treffe. (2) Tap-vs-scroll-terskel: en touch flytter ikke båndet (og `preventDefault`-er ikke) før fingeren har beveget seg forbi `TAP_SLOP = 10px` — under det regnes det som et trykk, så lenken under fingeren får klikket sitt (tidligere stjal den minste skjelving trykket).
- **Prosjektbilder – bredde-tilpassede varianter:** ny `ArtImage`-komponent (`components/ArtImage.tsx` + `.module.css`) for de full-bleed båndene (hero + neste-prosjekt) som før crop-zoomet med `fill`+cover. Bruker `<picture>` med `<source media>` som velger riktig *aspekt-tilpasset* fil per viewport: **9:16** på mobil (≤760px), **21:9/32:9** på store skjermer (≥1600px), ellers **16:9**-basisen. Variantene er valgfrie — en `<source>` lages kun når filen finnes, så ingenting knekker før de er lastet opp (faller tilbake til basisbildet overalt). `Project`-typen har nå `imagePortrait`/`imageUltrawide`; legg inn filene i `/public/projects` (navnekonvensjon `foo-portrait.webp` / `foo-ultrawide.webp`) og pek feltene dit for å aktivere. Tatt i bruk på hero + neste-bånd i både `ProjectPage` og `FraSofaTilSporty`.
- Verifisert: `npm run build` ✅, eslint rent.

### Prosjektside «Fra sofa til Sporty» + scroll-prosess-tidslinje (runde 33)
- **Ny dedikert case** (`components/cases/FraSofaTilSporty.tsx` + `.module.css`) for slug `fra-sofa-til-sporty`. Gjenbruker `ProjectPage.module.css` for struktur (hero, spalte, blokker, meta, neste-bånd) og legger til case-spesifikke biter. Ekte tekst lagt inn: ingress, utfordringen, prosessen (5 steg) og resultatet — at det ble film på kino i en nedkokt form.
- **Prosessen som faktisk vertikal progressbar** (`components/ProcessTimeline.tsx` + `.module.css`, det brukeren ba om): en dim spor-linje løper nedover venstre, og en lime «glow»-fyll vokser fra toppen mens man scroller. Hvert steg har en checkpoint-node som tennes (lime rim + halo) når fyllet når den, og steg-teksten toner fra dempet til full. Drevet av en rAF-throttlet scroll-lytter: lese-linje midt i viewport, `--progress` (0..1) som CSS-var, node-tilstand via `data-active`. All maling skjer i CSS; `prefers-reduced-motion` viser alt fylt og tent.
- **Media-slots:** siden har lite bildemateriale (film, portretter, ferdige annonser liggende+stående). La inn tydelig merkede placeholder-rammer (stiplet kant + mono-label «film · kommer», «annonse · liggende/stående») som byttes ut med ekte `<Image>`/`<video>` når filene kommer. Hero og neste-bånd bruker ekte eksisterende bilder (`project.image`/`next.image`).
- **Ruting:** `app/prosjekt/[slug]/page.tsx` har nå et `CASES`-oppslag som sender `fra-sofa-til-sporty` til den dedikerte casen og faller tilbake til den generiske `ProjectPage`-malen for de andre slugene.
- Verifisert: `npm run build` ✅ (alle 6 prosjektsider pre-renderes statisk), eslint rent. Tidslinje-matematikken bekreftet via DOM-måling (progress ≈ 0.5 midt i, nodene tennes kronologisk). NB: rAF kjører ikke i bakgrunnsfane, så live-fyllet vises først i ekte forgrunns-nettleser.

### CV-side (/cv) + nedlastbar PDF (runde 32)
- Ny rute `/cv` (`app/cv/page.tsx` + `components/CV.tsx` + `CV.module.css`) bygd i samme designsystem som resten av siden: mørk bakgrunn, Bricolage/Archivo/Space Mono-fontene, lime-aksent og mono-labels + verdi, akkurat som prosjekt- og om-meg-sidene. Innhold hentet fra `CV-innhold-MM.md` (om meg, erfaring med tankestrek-punkter, utdanning, ferdigheter).
- **«Last ned pdf»-knapp** laster ned en statisk PDF (`public/cv/martin-magnussen-cv.pdf`). PDF-en er foreløpig en eksport av selve `/cv`-siden, generert med headless Chrome (`--print-to-pdf`), så den matcher siden 1:1 — mørk bakgrunn, grid, fonter og lime-aksent. Byttes ut når Martin lager en egen CV.
- **Print-stylesheet beholdt som fallback:** `@media print` reformaterer siden for A4 (`@page size: A4; margin: 0`), skjuler nav + grid-canvas + knapp, tvinger på fargene (`print-color-adjust: exact`), lar bakgrunnen blø helt ut til kanten (ingen hvit ramme), og reproduserer nettsidens grid som en CSS-bakgrunn (32px, `rgba 0.07`) siden JS-canvas-en ikke printer pålitelig.
- Lagt «cv»-lenke i kontakt-seksjonen på om-meg-siden (samme pille-stil og glow som LinkedIn-knappen) som tar deg videre til CV-siden.
- Verifisert i preview: desktop + mobil (header og seksjoner stables til én kolonne ≤680px), layout sammenhengende fra topp til ferdigheter; PDF serveres (200) og lenken har `download`.

### Lime glow utvidet til alle klikkbare flater (runde 31)
- Utvidet den grønne glowen til resten av de klikkbare elementene: **arbeid-listens** preview-kort (`.preview[data-show="true"]` i ListView), **prosjektsidens** «← arbeid»-lenke (mild text-shadow) og «neste prosjekt»-bånd (inset rim + indre halo + ytre cast siden det er full-bleed), og **LinkedIn-knappen** på om-meg-siden (`.socialBtn:hover`). Alle bruker samme lagdelte `color-mix(--accent)`-mønster og fikk `box-shadow` lagt til transition-listen for myk inn/ut.

### Lime glow rundt hovret kort (runde 30)
- La til en grønn (lime) glow rundt kortet man hovrer i canvas-visningen. Lagt på samme box-shadow som engasjert/fokusert tilstand (`[data-engaged="true"]` + `:focus-visible`), så den arver den myke transitionen og gjelder både mus (magnetisk engasjement) og tastatur. Glowen er lagdelt: en tett 1px-rim + to myke halo-lag (`color-mix` med `--accent`) oppå dybdeskyggen.

### Showreel-badge → «Martin Magnussen · år» + sentrert stjerne (runde 29)
- Den roterende badgen nederst til venstre på forsiden sa «showreel · 2025» (uten faktisk showreel). Endret til «Martin Magnussen · [år]» der året hentes dynamisk via `new Date().getFullYear()`.
- **Bug 1 – stjernen ikke sentrert:** `✦`-spennet brukte `className="center"` (global klasse) i stedet for `className={styles.center}`, så CSS-modulens sentrering ble aldri brukt og stjernen falt ned i normal flyt. Rettet → stjernens sentrum matcher nå badge-sentrum nøyaktig.
- **Bug 2 – fontstørrelse hadde ingen effekt:** `.mono`-klassen tvang `font-size: 0.72rem` (og `text-transform: lowercase`), så SVG-ens `font-size`-attributt ble overstyrt – og navnet ville blitt «martin magnussen». Stiler nå `<text>` inline (mono-font, 13px, letter-spacing) uten lowercase, så frasen fyller ~91 % av ringen og navnet beholder stor forbokstav.

### «Placeholder»-kort på forside + arbeid (runde 28)
- La til et prosjekt med slug `placeholder` (tittel «Placeholder», tag «placeholder», 2025) i `lib/projects.ts`. Siden forside-canvas og arbeid-liste mater fra samme array, dukker kortet opp begge steder og lenker til `/prosjekt/placeholder` (samme mal). Thumbnail: hero-bildet skalert til `public/projects/placeholder.webp` (9 KB). Lime/svart gradient som fallback.

### Prosjektside-mal (placeholder) (runde 27)
- **Fase 2 startet:** bygget en delt mal for prosjektsider på `/prosjekt/[slug]` (dynamisk rute, `generateStaticParams` + `generateMetadata`, alle 5 prosjekter pre-rendres som statisk HTML). `notFound()` på ukjent slug.
- **Layout:** hero-bånd (fullbredde bilde + scrim + tittel/kicker/«← arbeid») → meta-rad (rolle/år/kunde/leveranse) + ingress → tekstblokk «utfordringen» → bred figur → to-kolonne bildepar (app + merkevare, stables på mobil) → tekstblokk «løsningen» → fullbredde «i bruk»-bilde → tekstblokk «resultatet» → «neste prosjekt»-bånd som lenker videre (wrap-around) med lime pil.
- **Viktig:** alt innhold er plassholder – kun layout og det visuelle skal gjenbrukes. Tekst er filler; hero/meta henter ekte felt (tittel/tag/år) fra prosjektdataene så malen tilpasser seg hver slug.
- **Bilder:** 6 AI-genererte placeholder-bilder (Sporty-tema, på palett) konvertert til WebP i `public/projects/case/` (23–48 KB hver via `sharp`, kvalitet 80).
- **Lenker live:** `PROJECTS_READY = true` → prosjektlenkene i liste/canvas peker nå til `/prosjekt/[slug]` i stedet for forsiden.
- **Nav:** `TopNav` markerer «arbeid» på prosjektsider (slideren havner riktig).
- **Responsivt + a11y:** bildepar og meta kollapser til én kolonne under 760px, scrim sikrer kontrast på tittel, `prefers-reduced-motion` skrur av hover-zoom/pil-animasjon, alt-tekster satt.

### Glow-effekten på touch-enheter (runde 26)
- **Problem:** glow-en fulgte pekeren — på mobil/nettbrett finnes ingen svevende peker, så den «teleporterte» til hvert trykk og så ødelagt ut.
- **Løsning:** `GridGlow` oppdager nå grove pekere (`(hover: none), (pointer: coarse)`). På slike enheter kobles ingen peker-lyttere på (trykk flytter aldri glow-en); i stedet driver glow-en rundt av seg selv mot tilfeldige mål med mild easing, hviler kort ved hvert mål før den glir videre, og loopen holdes i live mens komponenten er montert. Spotlighten er litt større der (`WANDER_RADIUS = 7` mot `RADIUS = 4`) så den leses som en ambient effekt. `prefers-reduced-motion` på touch gir ingen glow i det hele tatt (rutenettet står stille). Desktop er uendret — peker-følging som før.

### Fjernet skillelinje på om meg (runde 25)
- Skillelinja mellom bio og kontakt lot seg ikke linje opp med rutenettet: rutenettet er festet til viewporten mens seksjonen scroller, så en linje i innholdet driver i forhold til rutenettet uansett scroll-posisjon. Etter Martins ønske fjernet (i stedet for å la den stå skjevt). Litt mer luft over kontakt-seksjonen kompenserer for separasjonen.

### Fiks: doble grid-linjer på arbeid/om meg (runde 24)
- **Årsak:** rutenettet ble tegnet to ulike steder — forsiden viste det skarpe canvas-rutenettet (linjer rundet til hel piksel + 0.5), mens liste/om meg viste kroppens CSS-gradient-rutenett. CSS-gradienten kan ikke piksel-snappe, så hver 1px-linje anti-aliaset over to rader og så dobbel/uskarp ut.
- **Løsning:** `GridGlow` tegner nå de skarpe linjene i *begge* moduser, og CSS-rutenettet på `body` (`background-image`/`-size`/`-position`/`-attachment`) er fjernet. Alle sider viser dermed nøyaktig samme piksel-snappede rutenett (forsidens spiral ligger på ugjennomsiktig bakgrunn og legger sitt eget identiske rutenett oppå). Fikset også en latent bug: `resize` tegner nå rutenettet på nytt (canvas tømmes ved resize, så de statiske linjene forsvant til neste pekerbevegelse mens loopen var i ro).

### Portrett som kortstokk (runde 23)
- **`components/PortraitDeck.tsx` (klient):** portrettet på om meg-siden er nå en liten kortstokk — flere kort stablet bak topp-kortet (forskjøvet/rotert/skalert per dybde via inline `transform` + synkende `z-index`). Klikk på stabelen «dealer» topp-kortet bakerst så neste bilde kommer fram, med en `transform`-transition (0.55s) som kort-stokk-animasjon. Firkant-prikker nederst i midten indikerer hvilket bilde som vises (aktiv = lime, klikkbare for å hoppe rett til et bilde). A11y: stabel = `<button aria-label="Vis neste bilde">`, prikker med `aria-current`/`aria-label`, ikke-topp-kort er `aria-hidden`.
- **Placeholder:** `PHOTOS`-array i `About.tsx` med 5 duplikater av `/om/martin.webp` for å visualisere — byttes ut med egne bilder senere (rekkefølge topp → bunn). Erstattet den statiske `<figure>`-en; gammel `.portrait`-CSS fjernet.

### Delt nav + accent-farge + glow overalt (runde 22)
- **Accent-farge `#baff18` (lime):** ny `--accent`-token i `globals.css`. Brukt på logoen, aktivt nav-segment, LinkedIn-knapp (hover), `::selection` (lime bakgrunn / mørk tekst) og cursor-glowet. (Valgt over lilla/rosa fra portrettet — Martin listet lime først med «Bruk dette».)
- **Delt, vedvarende topbar (`components/TopNav.tsx`):** flyttet logo + tre-segments pille ut av `Home`/`About` og inn i rot-layouten, så den **ikke remountes ved navigasjon** — derfor glir indikatoren nå jevnt mellom `/` og `/om` i stedet for å hoppe. Leser gjeldende segment fra URL (`usePathname` + `useSearchParams`, pakket i `<Suspense>`). Slider: forside→0, arbeid→100%, om→200%.
- **«arbeid» i ett klikk fra om meg:** visningen er nå URL-styrt (`/?view=arbeid` → liste, ellers spiral). `Home` leser `useSearchParams` (pakket i `<Suspense>` i `page.tsx`); reduced-motion → `router.replace('/?view=arbeid')` så nav og lerret holdes synkront. Lenken «arbeid» peker rett på `/?view=arbeid`, så et klikk fra `/om` lander på lista i ett hopp (ikke to).
- **Frostet bakgrunn langs hele menypilla:** blur + svak fyll dekker hele pilla; den glidende lozengen er nå kun et lyst highlight (eget blur fjernet) som markerer aktivt segment.
- **Cursor-glow på liste- og om meg-siden:** `<GridGlow asBackground />` mountes én gang i layouten (`position: fixed; z-index: -1`), tegner kun glow-cellene (ikke linjer — kroppens CSS-grid leverer linjene) i lime. Spiral-visningen beholder sitt eget interne grid over en ugjennomsiktig bakgrunn. `background-attachment: fixed` på `body` pinner rutenettet til viewporten så det holder seg på linje med det faste glow-lerretet ved scroll.
- **Skillelinje på om meg justert:** byttet den innrykkede 1px `border-top` med en **full-bredde** `::before` (100vw, 2px, `--line-strong`), så linja leser som del av rutenettet og er litt tykkere.
- **LinkedIn som knapp:** ren tekstlenke → pille-knapp (ramme + svak fyll) med en ekstern-lenke-pil som dytter ut (`translate(2px,-2px)`) ved hover; hover farger knappen lime. Skjult «(åpner i ny fane)» for skjermlesere.
- **Favicon → «m»:** slettet default `app/favicon.ico`, la til `app/icon.svg` — lime «m» (stroke-basert) på mørk avrundet firkant, matcher mm-logoen.

### Om meg-side (runde 21)
- **`/om` opprettet:** ny statisk rute `app/om/page.tsx` + `components/About.tsx` (+ `.module.css`), server-komponent (ingen klient-JS). Egen `<title>`/OG-metadata via `generateMetadata`-objekt, `canonical: /om`.
- **Innhold:** kicker + display-overskrift «Designer & visuell kommunikatør fra Bergen.», bio-teksten fra Martin (to avsnitt), og portrettbildet (`public/om/martin.webp`, 516×689, ~45 KB, allerede web-klart) via `next/image` med `priority` + `sizes`. Portrettet har en lett −2°-helning som retter seg opp ved hover.
- **Topbar gjenbrukt:** samme logo + tre-segments pille som forsiden, men her er «om meg» gjeldende side (`data-view="om"` → slideren hviler under tredje segment, `aria-current="page"`); «forside»/«arbeid» lenker tilbake til `/`.
- **Kontakt-seksjon (`#kontakt`):** overskrift + «Basert i Bergen»-tekst, e-post (`martin.magnussen@outlook.com`) og telefon (`+47 950 71 791`) som **ren tekst i en `<dl>` — ikke klikkbare** (ingen `mailto:`/`tel:`, etter ønske), samt LinkedIn-lenke (ren URL uten utm-sporeparametre, eneste klikkbare). `EMAIL`/`PHONE`/`SOCIALS` ligger øverst i `About.tsx` og rendres kun når de er fylt inn.

### Meny + liste-rotasjon (runde 20)
- **Forenklet meny → én tre-segments pille:** "Arbeid" var duplikat av "Forside" og "Kontakt" av "Om meg" — begge kuttet, og meny-knappen + hele `MenuOverlay`-komponenten er fjernet. Toggelen er nå én glass-pille med tre segmenter — **forside** (spiral-visning), **arbeid** (liste-visning) og **om meg** (lenke til `/om`) — der den glidende indikatoren beveger seg mellom forside/arbeid som før (slider-bredde nå `33.333% − 3.333px`, grid med tre kolonner). "om meg" deler segment-stilen men er en `<Link>`, så den navigerer i stedet for å toggle. `/om` bygges i Fase 3 (404 inntil da).
- **Liste-kortet roterer med musen (posisjonsbasert):** preview-kortet lener seg nå etter *hvor* pekeren står, ikke farten. Når man treffer en rad får kortet en liten tilfeldig «base»-helning til én side (`BASE_MIN..BASE_MAX = 3..7°`, under 5–10°-taket) og vises straks med den. Deretter legges en andel av `SWING = 8°` til, proporsjonalt med hvor langt pekeren står fra rad-senteret mot `RANGE = 460px` (% av maks) — venstre for senteret heller venstre, høyre heller høyre. Totalen klippes til `MAX_TILT = 12°`. Siden vinkelen er en ren funksjon av pekerposisjonen holder kortet helningen når pekeren hviler i stedet for å nullstilles (det gamle fart-baserte forslaget eased alltid tilbake mot 0). En kort `rotate 0.3s`-transition glatter retargetingen per mousemove. `prefers-reduced-motion` → flatt (CSS tvinger `rotate: 0`).

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
2. **Prosjektsider** — ✅ mal bygget (placeholder); fyll inn ekte innhold per levert mappe
3. **Om meg / kontakt**
4. **Polish** — ytelse, a11y, responsivt, SEO/OG, pre-delivery-sjekkliste

## Neste steg
Prosjektside-malen står (placeholder). Når ekte prosjektmapper leveres: bytt ut placeholder-bilder/-tekst med faktisk case-innhold per slug, og vurder å utvide `Project`-typen med case-felter (ingress, seksjoner, bildeliste) i stedet for hardkodet filler i `ProjectPage`.

## Filstrategi
- Inspo-materiale: midlertidig, utenfor repo, slettes etter designgodkjenning (allerede godkjent — kan slettes).
- Web-klare bilder/video: i repoet (komprimert).
- Tunge fullversjoner: hostes eksternt, lazy-load. Ikke Git LFS.
