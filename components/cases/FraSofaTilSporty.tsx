import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import ArtImage from "../ArtImage";
import ProcessTimeline, { type ProcessStep } from "../ProcessTimeline";
import shared from "../ProjectPage.module.css";
import styles from "./FraSofaTilSporty.module.css";

// Dedicated case for "Fra sofa til Sporty". The concept and its process are the
// point of this page, so the centrepiece is the scroll-driven ProcessTimeline.
// Imagery is sparse by design (a film, portraits, finished ads), so media lives
// in clearly-labelled slots that can be swapped for the real assets later —
// until then they render as styled placeholder frames, not broken images.

const STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Problemstillingen",
    body: "Vi startet med innsikten: nyttår gir en topp i motivasjon, men også den høyeste terskelen for å faktisk komme i gang. Hvordan møter vi folk i det gapet – på en måte som drar dem mot senteret i stedet for å minne dem om at de ikke er der ennå?",
  },
  {
    num: "02",
    title: "Idéen",
    body: "Ut av problemstillingen vokste konseptet: kontrasten mellom julero og treningsbevegelse, gjort konkret og litt humoristisk. En person godt plantet i sofaen, chips i hånd, blikket på TV-en – og så den brå overgangen til treningssenteret. «Fra sofa til Sporty» ble både tittelen og selve bevegelsen.",
  },
  {
    num: "03",
    title: "Skissen",
    body: "Vi skisserte hvordan idéen kunne gjennomføres som film: den fysiske overgangen fra stue til treningsrom, fortalt på få sekunder. Her tok konseptet form som en faktisk produksjonsplan.",
  },
  {
    num: "04",
    title: "Nedkokingen",
    body: "Med begrenset tid og budsjett kokte vi konseptet ned til sin minste virksomme kjerne – det som lot seg produsere raskt og rimelig, uten å miste idéen. Løsningen ble en kombinasjon: stillbilder som bar kontrasten, og en kort film der vi møter personen foran TV-en med snacks, før det kuttes til at samme person trener på senteret.",
  },
  {
    num: "05",
    title: "Resultatet",
    body: "Filmen ble vist på kino, og kampanjen levde videre på flater rundt om i Bergen. Den endelige produksjonen var enklere enn den opprinnelige visjonen – men kontrasten, og dermed idéen, stod like støtt.",
  },
];

export default function FraSofaTilSporty({
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
              <dd>Konsept &amp; design</dd>
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
              <dd>Reklamekonsept, film, kampanje</dd>
            </div>
          </dl>
          <p className={shared.summary}>
            Et reklamekonsept for å få folk tilbake til trening etter jul – når
            nyttårsforsettene er ferske, men sofaen fortsatt vinner. Bygget på én
            enkel kontrast: avstanden mellom der man er, og der man vil være.
          </p>
        </section>

        {/* ---- Utfordringen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>utfordringen</p>
          <h2 className={shared.h2}>Høyest motivasjon, høyest terskel.</h2>
          <p className={shared.body}>
            Romjul og nyttår er paradokset i treningsbransjen. Aldri er
            motivasjonen høyere – og aldri er terskelen for å faktisk møte opp
            større. Folk har kost seg gjennom julen med familie, god mat og lite
            aktivitet, og sitter igjen med et forsett de ikke helt vet hvordan de
            skal innfri. Oppgaven var å møte den følelsen, ikke pirke i den: å
            gjøre veien fra sofa til treningssenter til noe gjenkjennelig og
            lavterskel, ikke nok en pekefinger.
          </p>
        </section>
      </main>

      {/* ---- Hovedbilde fra kampanjen. Byttes til <video> når filmen er klar. ---- */}
      <figure className={styles.filmWrap}>
        <Image
          className={styles.filmImg}
          src={project.image}
          alt={`${project.title} — stillbilde fra kampanjen`}
          width={1600}
          height={900}
          sizes="(max-width: 1080px) 100vw, 1080px"
        />
        <figcaption className={`${shared.cap} mono`}>
          fra sofa til senter · kampanjen
        </figcaption>
      </figure>

      <main className={shared.main}>
        {/* ---- Prosessen — the centrepiece ---- */}
        <section className={`${shared.block} ${styles.processBlock}`}>
          <p className={`${shared.kicker} mono`}>prosessen</p>
          <h2 className={shared.h2}>Fra innsikt til ferdig film.</h2>
          <p className={shared.body}>
            En kronologisk vei fra problemstilling til kino – der hvert steg
            strammet idéen i stedet for å fortynne den.
          </p>
        </section>

        <div className={styles.timelineWrap}>
          <ProcessTimeline steps={STEPS} />
        </div>

        {/* ---- Annonsene: liggende + stående. Placeholder frames until the
            finished ads are dropped in. ---- */}
        <section className={`${shared.block} ${styles.adsBlock}`}>
          <p className={`${shared.kicker} mono`}>annonsene</p>
          <h2 className={shared.h2}>Kontrasten, satt på flater.</h2>
        </section>

        <div className={styles.ads}>
          <figure className={`${styles.adLandscape} ${styles.placeholder}`}>
            <span className={`${styles.slotLabel} mono`}>
              annonse · liggende
            </span>
          </figure>
          <figure className={`${styles.adPortrait} ${styles.placeholder}`}>
            <span className={`${styles.slotLabel} mono`}>annonse · stående</span>
          </figure>
        </div>

        {/* ---- Resultatet ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>resultatet</p>
          <h2 className={shared.h2}>En idé som tålte å bli forenklet.</h2>
          <p className={shared.body}>
            Kampanjen ble vist på kino, på Flesland og i parkeringshus i Bergen.
            Men det viktigste med dette prosjektet er ikke flatene den endte på –
            det er at idéen bar hele veien, også etter at den ble kokt ned til det
            produksjonen tillot. En sterk idé tåler å bli forenklet. Det er den
            typen konseptutvikling jeg vil jobbe mer med: der en enkel, tydelig
            tanke styrer alt som lages etterpå.
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
