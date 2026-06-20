import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import ArtImage from "../ArtImage";
import ProcessTimeline, { type ProcessStep } from "../ProcessTimeline";
import shared from "../ProjectPage.module.css";
import styles from "./SportySkjermer.module.css";

// Dedicated case for "Sporty-skjermer". This page is NOT about a single ad — it
// covers the network of screens on Sporty's gym floors: editorial content,
// operations, and real advertiser production on one surface. The advertiser
// workflow is the centrepiece, told through the scroll-driven ProcessTimeline.
// One real screen photo is shown as a featured example; the rest of the gallery
// uses labelled placeholder frames until the finished ad shots are dropped in
// (swap each .placeholder <figure> for an <Image>).

// The advertiser workflow, step by step — drives the ProcessTimeline.
const STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Briefen",
    body: "Utgangspunktet varierer fra annonsør til annonsør. Noen kommer med ferdige bilder og et konkret budskap de vil ha ut. Andre gir meg lite mer enn navnet sitt – og da starter jobben med å forstå hva de faktisk skal kommunisere.",
  },
  {
    num: "02",
    title: "Innsikten",
    body: "For annonsørene uten ferdig materiell henter jeg ut det jeg trenger fra deres egne flater – nettside, profil, visuell identitet – og danner meg et bilde av hvem de er og hva de vil si.",
  },
  {
    num: "03",
    title: "Budskapet",
    body: "Ut fra det lander jeg et budskap: hva annonsen skal si, til hvem, og hvorfor det fungerer på akkurat denne flaten. Dette er kjernen i jobben – å oversette en kundes mål til noe som faktisk kommuniserer på en skjerm folk går forbi.",
  },
  {
    num: "04",
    title: "Produksjonen",
    body: "Jeg utformer og produserer den ferdige annonsen, tilpasset skjermformatet og Sportys kanal.",
  },
  {
    num: "05",
    title: "Godkjenningen",
    body: "Annonsen sendes til annonsøren for godkjenning, justeres ved behov, og publiseres på skjermene.",
  },
];

// The gallery of ads that ran on the screens. Items with a `src` render the
// real shot; the rest stay as labelled placeholder frames until those photos
// are prepared (just add a `src` to swap one in).
const ADS: { src?: string; label: string }[] = [
  { src: "/projects/sporty-skjermer.webp", label: "Auto 8-8 · skjerm" },
  { src: "/projects/sporty-skjerm-eiendomsmegler.webp", label: "EiendomsMegler 1 · skjerm" },
  { src: "/projects/sporty-skjerm-vancowill.webp", label: "Vancowill AS · skjerm" },
  { src: "/projects/sporty-skjerm-juliussen.webp", label: "Juliussen Trafikkskole · skjerm" },
];

export default function SportySkjermer({
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
          alt={`${project.title} — annonse på skjerm i treningssenteret`}
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
              <dd>Innhold, drift &amp; annonseproduksjon</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">år</dt>
              <dd>{project.year}</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">kunde</dt>
              <dd>Sporty + eksterne annonsører</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">flate</dt>
              <dd>Skjermer på treningssentrene</dd>
            </div>
          </dl>
          <p className={shared.summary}>
            Sporty-skjermene er nettverket av skjermer på treningssentrene – en
            kanal jeg har vært med på å bygge fra start. Her møtes drift,
            redaksjonelt innhold og reell annonsørproduksjon på én flate, og jeg
            eier hele kjeden: fra å sette opp skjermene, til å produsere det som
            vises på dem.
          </p>
        </section>

        {/* ---- Utfordringen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>utfordringen</p>
          <h2 className={shared.h2}>En kanal som aldri tar pause.</h2>
          <p className={shared.body}>
            En skjerm på et treningssenter skal informere medlemmer, selge PT- og
            GT-tjenester, lyse ut stillinger, varsle om events – og samtidig
            fungere som en betalt annonseflate for eksterne annonsører. Oppgaven
            er å holde denne kanalen levende, relevant og teknisk stabil, samtidig
            som det som vises faktisk treffer: riktig budskap, til riktig medlem,
            til riktig tid.
          </p>
        </section>

        {/* ---- Rollen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>rollen</p>
          <h2 className={shared.h2}>Fra å sette opp skjermene til å fylle dem.</h2>
          <p className={shared.body}>
            Jeg har vært med på dette fra begynnelsen, og rollen spenner bredt. På
            innholdssiden produserer jeg skjermreklame som sendes ut fra Sporty –
            alt fra PT- og GT-kampanjer og stillingsutlysninger til kommende
            events og generelle, positive meldinger til medlemmene, som «Takk for
            at du er Sporty». På annonsørsiden jobber jeg både med å publisere og
            produsere. Og på den tekniske siden setter jeg opp skjermene i
            publiseringssystemet, styrer det som ligger ute, og feilsøker når noe
            svikter.
          </p>
        </section>
      </main>

      {/* ---- Featured example: a real screen photo ---- */}
      <figure className={styles.featuredWrap}>
        <Image
          className={styles.featuredImg}
          src={project.image}
          alt={`${project.title} — annonse for knespesialistene.no på skjerm`}
          width={1600}
          height={901}
          sizes="(max-width: 1080px) 100vw, 1080px"
        />
        <figcaption className={`${shared.cap} mono`}>
          annonse på skjerm · senteret
        </figcaption>
      </figure>

      <main className={shared.main}>
        {/* ---- Prosessen — the centrepiece ---- */}
        <section className={`${shared.block} ${styles.processBlock}`}>
          <p className={`${shared.kicker} mono`}>prosessen — annonsørarbeidet</p>
          <h2 className={shared.h2}>Fra brief til godkjent skjerm.</h2>
          <p className={shared.body}>
            For de eksterne annonsørene går jobben gjennom de samme stegene – fra
            et utgangspunkt som varierer mye, til en ferdig annonse kunden stiller
            seg bak.
          </p>
        </section>

        <div className={styles.timelineWrap}>
          <ProcessTimeline steps={STEPS} />
        </div>

        {/* ---- Annonsene: gallery of screen ads. Placeholder frames until the
            finished ad shots are dropped in. ---- */}
        <section className={`${shared.block} ${styles.galleryBlock}`}>
          <p className={`${shared.kicker} mono`}>annonsene</p>
          <h2 className={shared.h2}>Flere kampanjer, samme flate.</h2>
          <p className={shared.body}>
            Et knippe av annonsene som har rullet på skjermene – fra eiendom og
            industri til trafikkskole.
          </p>
        </section>

        <div className={styles.gallery}>
          {ADS.map((ad, i) =>
            ad.src ? (
              <figure key={i} className={styles.adFigure}>
                <Image
                  className={styles.adImg}
                  src={ad.src}
                  alt={`${project.title} — ${ad.label}`}
                  width={1600}
                  height={901}
                  sizes="(max-width: 760px) 100vw, 540px"
                />
                <figcaption className={`${shared.cap} mono`}>
                  {ad.label}
                </figcaption>
              </figure>
            ) : (
              <figure
                key={i}
                className={`${styles.screen} ${styles.placeholder}`}
              >
                <span className={`${styles.slotLabel} mono`}>{ad.label}</span>
              </figure>
            ),
          )}
        </div>

        {/* ---- Resultatet ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>resultatet</p>
          <h2 className={shared.h2}>Byråarbeid i miniatyr.</h2>
          <p className={shared.body}>
            Sporty-skjermene er en kanal jeg kjenner fra begge sider av bordet –
            som redaksjonell flate for Sporty, og som annonseplass jeg produserer
            for på vegne av eksterne kunder. Det siste er det jeg tar med meg som
            mest verdifullt: erfaringen med å ta en kundes utgangspunkt, definere
            budskapet selv, og levere noe de stiller seg bak. Det er byråarbeid i
            miniatyr – og en arbeidsform jeg vil gjøre mer av.
          </p>
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
