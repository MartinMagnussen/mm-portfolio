import Link from "next/link";
import type { Project } from "@/lib/projects";
import ArtImage from "../ArtImage";
import ProcessTimeline, { type ProcessStep } from "../ProcessTimeline";
import shared from "../ProjectPage.module.css";
import styles from "./SportyOnboarding.module.css";

// Dedicated case for "Sporty Onboarding": the instructional video every new
// member meets right after signing up. Unlike the concept cases, the job here is
// clarity over creative idea — making something technical and potentially dull
// feel like a helping hand. Video-first: the YouTube film is the centrepiece and
// the ProcessTimeline carries the manus→struktur→opptak→klipp→distribusjon
// workflow. Structural layout (hero/meta/blocks/next) reused from ProjectPage.

const VIDEO_ID = "M4myMxNmHDU";
const VIDEO_URL = `https://youtu.be/${VIDEO_ID}`;

// The production workflow, step by step — drives the scroll-driven timeline.
const STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Manus",
    body: "Jeg skrev manus med utgangspunkt i medlemmets egen reise – hvilke spørsmål som dukker opp, og i hvilken rekkefølge. Hvert steg ble brutt ned til det helt nødvendige, med klare instruksjoner og en vennlig, muntlig tone.",
  },
  {
    num: "02",
    title: "Struktur",
    body: "Manus vekslet bevisst mellom vert og skjerm: verten rammer inn og beroliger, mens nærbilder av app, dør og nettside viser nøyaktig hva man skal gjøre. Det holder videoen både personlig og konkret.",
  },
  {
    num: "03",
    title: "Opptak",
    body: "Jeg filmet både verten og alle demonstrasjonene – app, døråpning med QR-kode, booking i app og på nettsiden – slik at hvert steg kunne vises i praksis, ikke bare forklares.",
  },
  {
    num: "04",
    title: "Redigering",
    body: "Jeg klippet det hele sammen til en stram, lettfulgt video, med grafikk som fremhever det viktigste, som kontaktinfo og nøkkelsteg.",
  },
  {
    num: "05",
    title: "Distribusjon",
    body: "Videoen sendes ut til alle nye medlemmer som en del av onboardingen – en fast del av møtet mellom Sporty og medlemmet.",
  },
];

// Checkpoints for the reading-progress rail — the video and the process.
export const SECTION_IDS = ["video", "prosessen"];

export default function SportyOnboarding({
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
          alt={`${project.title} — stillbilde fra onboardingvideoen`}
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
              <dd>Onboardingvideo</dd>
            </div>
          </dl>
          <p className={shared.summary}>
            Onboardingvideoen er det første nye medlemmer møter etter at de har
            meldt seg inn. Den tar dem gjennom alt de trenger for å komme i gang
            – fra app til døråpning til booking – så terskelen for det første
            besøket blir så lav som mulig. Jeg skrev manus, filmet og redigerte.
          </p>
        </section>

        {/* ---- Utfordringen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>utfordringen</p>
          <h2 className={shared.h2}>Mange små steg blir én terskel.</h2>
          <p className={shared.body}>
            De første dagene som nytt medlem er der flest faller fra. Appen skal
            lastes ned, innloggingen skal sitte, døren skal åpnes med QR-kode,
            gruppetimer skal bookes – mange små steg som hver for seg er enkle,
            men som til sammen kan bli en terskel. Oppgaven var å fjerne den
            terskelen: å samle alt det praktiske i én video som føles som en
            hjelpende hånd, ikke en bruksanvisning.
          </p>
        </section>
      </main>

      {/* ---- Videoen — the centrepiece ---- */}
      <figure id="video" className={styles.videoWrap}>
        <div className={styles.videoFrame}>
          <iframe
            className={styles.videoEmbed}
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`}
            title="Sporty onboardingvideo for nye medlemmer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <figcaption className={`${shared.cap} mono`}>
          onboardingvideo · sporty
        </figcaption>
      </figure>

      <main className={shared.main}>
        {/* ---- Idéen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>idéen</p>
          <h2 className={shared.h2}>Som å bli vist rundt.</h2>
          <p className={shared.body}>
            Nøkkelen var å gjøre informasjonen menneskelig. I stedet for en tørr
            gjennomgang av funksjoner, bygde vi videoen rundt en vert som tar
            seeren med steg for steg – vekslende mellom å snakke direkte til
            medlemmet og konkrete demonstrasjoner av appen, døren og bookingen.
            Tonen er rolig og imøtekommende, og rekkefølgen følger akkurat den et
            nytt medlem selv vil møte: last ned, logg inn, kom deg inn, book, få
            hjelp. Resultatet skal føles som at noen viser deg rundt, ikke som at
            du leser en manual.
          </p>
        </section>

        {/* ---- Prosessen — the timeline ---- */}
        <section id="prosessen" className={`${shared.block} ${styles.processBlock}`}>
          <p className={`${shared.kicker} mono`}>prosessen</p>
          <h2 className={shared.h2}>Fra manus til ferdig film.</h2>
          <p className={shared.body}>
            En praktisk produksjon der hvert steg handlet om å gjøre det
            kompliserte enkelt – skrevet, filmet og klippet i én hånd.
          </p>
        </section>

        <div className={styles.timelineWrap}>
          <ProcessTimeline steps={STEPS} />
        </div>

        {/* ---- Resultatet ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>resultatet</p>
          <h2 className={shared.h2}>Det kompliserte, gjort enkelt.</h2>
          <p className={shared.body}>
            En video som tar det praktiske rotet ut av de første dagene og gjør
            det enkelt å komme i gang. Den når hvert eneste nye medlem, og er et
            eksempel på instruksjonsinnhold der jobben er å gjøre det
            kompliserte enkelt – fra manus til ferdig film.
          </p>
          <div className={styles.links}>
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
