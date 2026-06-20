import Link from "next/link";
import type { Project } from "@/lib/projects";
import ArtImage from "../ArtImage";
import ProcessTimeline, { type ProcessStep } from "../ProcessTimeline";
import PhotoGallery, { type PhotoGroup } from "../PhotoGallery";
import shared from "../ProjectPage.module.css";
import styles from "./SbdHelene.module.css";

// Dedicated case for "SBD — video med Helene": a story-led, video-first project.
// When one of Sporty's own PTs, Helene Anker Eide, became Norwegian champion and
// set a national record in the bench press, that performance was turned into a
// teaching video for the members. The centrepiece is the YouTube film; the
// ProcessTimeline carries the idea→manus→opptak→klipp→publisering workflow, and
// the stills shot during the same production round out the page. Structural
// layout (hero/meta/blocks/next) is reused from the shared ProjectPage.

// Stills folder — the Helene shoot lives alongside the Sporty-fotografi assets.
const BASE = "/projects/sporty-fotografi/helene";

// YouTube id for the published film (privacy-enhanced nocookie embed).
const VIDEO_ID = "LyVS_WejCg8";
const ARTICLE_URL =
  "https://sporty.no/sporty-magasinet/bli-sterkere-med-tips-fra-en-norgesmester";
const VIDEO_URL = `https://youtu.be/${VIDEO_ID}`;

// The production workflow, step by step — drives the scroll-driven timeline.
const STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Vinkelen",
    body: "Vi landet på leksjonsformatet: Helene tar seeren gjennom de tre løftene, ett for ett, med konkrete tips. En tydelig rød tråd som gjorde innholdet både feirende og nyttig.",
  },
  {
    num: "02",
    title: "Manus",
    body: "Jeg skrev manus – strukturen for videoen og spørsmålene som skulle få frem det viktigste fra Helene: oppsett på benkpress, stabilitet i knebøy, kontakt med stangen i markløft, og de gode vanene bak resultatene.",
  },
  {
    num: "03",
    title: "Opptak",
    body: "Jeg filmet videoen på senteret, og tok stillbilder av Helene til bruk i magasinartikkelen og tilhørende flater.",
  },
  {
    num: "04",
    title: "Redigering",
    body: "Jeg klippet og redigerte filmen til ferdig format – en stram mini-leksjon der teknikken er lett å følge.",
  },
  {
    num: "05",
    title: "Publisering",
    body: "Videoen og bildene ble publisert i Sporty-magasinet sammen med artikkelen, som en samlet sak om Helene, rekorden og rådene hennes.",
  },
];

// The stills shot during the same production, shown as a justified gallery with
// a fullscreen lightbox (reused PhotoGallery client component).
const STILLS: PhotoGroup[] = [
  {
    label: "stillbilder",
    alt: "Stillbilder av Helene Anker Eide for Sporty-magasinet",
    size: "md",
    id: "galleri-stillbilder",
    shots: [
      { name: "p1067271", w: 1600, h: 1067 },
      { name: "p1067283", w: 1600, h: 1067 },
      { name: "p1067343", w: 1600, h: 1067 },
      { name: "p1067351", w: 1600, h: 1067 },
      { name: "p1067376", w: 1600, h: 1067 },
      { name: "p1067391", w: 1600, h: 1067 },
      { name: "p1067397", w: 1600, h: 1067 },
      { name: "p1067398", w: 1600, h: 1067 },
    ].map((s) => ({ ...s, src: `${BASE}/${s.name}.webp` })),
  },
];

// Checkpoints for the reading-progress rail — the video, the process and the
// stills. Kept in sync with the `id`s set on the sections below.
export const SECTION_IDS = ["video", "prosessen", "galleri-stillbilder"];

export default function SbdHelene({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  return (
    <article className={shared.root}>
      {/* ---- Hero band ---- */}
      <header className={shared.hero}>
        <ArtImage
          className={shared.heroImg}
          src={project.image}
          portrait={project.imagePortrait}
          ultrawide={project.imageUltrawide}
          alt={`${project.title} — hovedbilde`}
          priority
        />
        <div className={shared.heroScrim} aria-hidden="true" />
        <div className={shared.heroInner}>
          <Link href="/?view=arbeid" className={`${shared.back} mono`}>
            <span aria-hidden="true">←</span> arbeid
          </Link>
          <p className={`${shared.kicker} mono`}>
            {project.tag} · {project.year}
          </p>
          <h1 className={shared.title}>{project.title}</h1>
        </div>
      </header>

      <main className={shared.main}>
        {/* ---- Meta + ingress ---- */}
        <section className={shared.meta}>
          <dl className={shared.metaList}>
            <div className={shared.metaRow}>
              <dt className="mono">rolle</dt>
              <dd>Manus, foto &amp; klipp</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">år</dt>
              <dd>{project.year}</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">kunde</dt>
              <dd>Sporty</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">leveranse</dt>
              <dd>Video &amp; magasinsak</dd>
            </div>
          </dl>
          <p className={shared.summary}>
            Da en av Sportys egne PT-er ble norgesmester og satte norsk rekord i
            benkpress, ble det en historie verdt å fortelle. Resultatet ble en
            video der Helene Anker Eide deler sine beste råd om styrkeløft – fra
            manus og foto til ferdig redigert film.
          </p>
        </section>

        {/* ---- Utfordringen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>utfordringen</p>
          <h2 className={shared.h2}>En rekord lever kort.</h2>
          <p className={shared.body}>
            Sporty hadde en ekte ekspert internt: en personlig trener som
            nettopp hadde prestert på toppnivå. Spørsmålet var hvordan vi best
            kunne bruke det. En rekord er en fin nyhet, men den lever kort. Målet
            var å gjøre prestasjonen om til noe varig og nyttig for medlemmene –
            innhold som både feirer Helene og gir folk noe de faktisk kan bruke
            på senteret.
          </p>
        </section>
      </main>

      {/* ---- Videoen — the centrepiece ---- */}
      <figure id="video" className={styles.videoWrap}>
        <div className={styles.videoFrame}>
          <iframe
            className={styles.videoEmbed}
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`}
            title="Bli sterkere med tips fra en norgesmester – video med Helene Anker Eide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <figcaption className={`${shared.cap} mono`}>
          video · sporty-magasinet
        </figcaption>
      </figure>

      <main className={shared.main}>
        {/* ---- Idéen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>idéen</p>
          <h2 className={shared.h2}>Fra rekord til leksjon.</h2>
          <p className={shared.body}>
            I stedet for bare å melde om rekorden, gjorde vi Helene til lærer.
            Konseptet ble en mini-leksjon i de tre store styrkeløftøvelsene –
            benkpress, knebøy og markløft – der norgesmesteren forklarer teknikk,
            oppsett og de små detaljene som skiller et godt løft fra et dårlig.
            Slik ble en personlig prestasjon til kunnskap medlemmene kan ta med
            seg, og samtidig en historie som bygger troverdighet for Sporty som
            fagmiljø.
          </p>
        </section>

        {/* ---- Prosessen — the timeline ---- */}
        <section id="prosessen" className={`${shared.block} ${styles.processBlock}`}>
          <p className={`${shared.kicker} mono`}>prosessen</p>
          <h2 className={shared.h2}>Fra vinkel til ferdig sak.</h2>
          <p className={shared.body}>
            Hele veien fra idé til publisert magasinsak – manus, opptak, foto og
            klipp – gjort i én og samme hånd.
          </p>
        </section>

        <div className={styles.timelineWrap}>
          <ProcessTimeline steps={STEPS} />
        </div>

        {/* ---- Stillbildene ---- */}
        <section className={`${shared.block} ${styles.galleryBlock}`}>
          <p className={`${shared.kicker} mono`}>stillbildene</p>
          <h2 className={shared.h2}>Bildene fra samme dag.</h2>
          <p className={shared.body}>
            Mens vi filmet, tok jeg også stillbilder av Helene – brukt i
            magasinartikkelen og på tilhørende flater. Trykk på et bilde for å se
            det i fullskjerm.
          </p>
        </section>
      </main>

      {/* Justified gallery with a fullscreen lightbox. */}
      <PhotoGallery groups={STILLS} />

      <main className={shared.main}>
        {/* ---- Resultatet ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>resultatet</p>
          <h2 className={shared.h2}>En nyhet som ble til lærdom.</h2>
          <p className={shared.body}>
            En video og en magasinsak som tok en intern prestasjon og gjorde den
            om til noe medlemmene kan lære av. Prosjektet er et eksempel på
            hvordan jeg jobber helhetlig – fra idé og manus til kamera og klipp –
            og hvordan en god vinkel kan løfte en enkel nyhet til innhold som
            faktisk gir verdi.
          </p>
          <div className={styles.links}>
            <a
              className={`${styles.linkBtn} mono`}
              href={ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Les saken i Sporty-magasinet
              <span aria-hidden="true"> ↗</span>
            </a>
            <a
              className={`${styles.linkBtn} mono`}
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Se videoen på YouTube
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </section>
      </main>

      {/* ---- Neste prosjekt ---- */}
      <Link
        href={`/prosjekt/${next.slug}`}
        className={shared.next}
        aria-label={`Neste prosjekt: ${next.title}`}
      >
        <ArtImage
          className={shared.nextImg}
          src={next.image}
          portrait={next.imagePortrait}
          ultrawide={next.imageUltrawide}
          alt=""
        />
        <div className={shared.nextScrim} aria-hidden="true" />
        <div className={shared.nextInner}>
          <p className={`${shared.kicker} mono`}>neste prosjekt</p>
          <span className={shared.nextTitle}>
            {next.title}
            <span className={shared.nextArrow} aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
