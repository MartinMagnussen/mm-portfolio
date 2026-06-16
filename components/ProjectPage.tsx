import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import styles from "./ProjectPage.module.css";

// Placeholder case template. Only the LAYOUT and VISUALS are meant to be reused
// — the body copy below is filler and the imagery is generic Sporty-themed
// placeholder art. The hero/meta pull the real fields (title/year/tag) from the
// project so the same template adapts to every slug.
export default function ProjectPage({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  return (
    <article className={styles.root}>
      {/* ---- Hero band ---- */}
      <header className={styles.hero}>
        <Image
          className={styles.heroImg}
          src="/projects/case/hero.webp"
          alt={`${project.title} — hovedbilde`}
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroInner}>
          <Link href="/?view=arbeid" className={`${styles.back} mono`}>
            <span aria-hidden="true">←</span> arbeid
          </Link>
          <p className={`${styles.kicker} mono`}>
            {project.tag} · {project.year}
          </p>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
      </header>

      <main className={styles.main}>
        {/* ---- Meta + lead ---- */}
        <section className={styles.meta}>
          <dl className={styles.metaList}>
            <div className={styles.metaRow}>
              <dt className="mono">rolle</dt>
              <dd>Konsept &amp; design</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className="mono">år</dt>
              <dd>{project.year}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className="mono">kunde</dt>
              <dd>Placeholder AS</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className="mono">leveranse</dt>
              <dd>Identitet, kampanje, digitalt</dd>
            </div>
          </dl>
          <p className={styles.summary}>
            En kort ingress som rammer inn prosjektet: hva oppdraget var, hvilken
            idé som bar det, og hva resultatet ble. Dette er plassholdertekst –
            kun layout og det visuelle er ment å gjenbrukes.
          </p>
        </section>

        {/* ---- Utfordringen ---- */}
        <section className={styles.block}>
          <p className={`${styles.kicker} mono`}>utfordringen</p>
          <h2 className={styles.h2}>Et tydelig problem å løse.</h2>
          <p className={styles.body}>
            Her beskrives utgangspunktet og rammene for oppdraget. Hva skulle
            kommuniseres, til hvem, og hvorfor var det vanskelig? Plassholdertekst
            som viser hvordan en avsnittsblokk ligger i spalten med god lesbarhet
            og luft.
          </p>
        </section>

        <figure className={styles.figureWide}>
          <Image
            src="/projects/case/context.webp"
            alt="Kontekst – oversiktsbilde"
            width={1600}
            height={900}
            sizes="(max-width: 1080px) 100vw, 1080px"
          />
          <figcaption className={`${styles.cap} mono`}>
            oversikt · plassholder
          </figcaption>
        </figure>

        {/* ---- To-kolonne bildepar ---- */}
        <div className={styles.pair}>
          <figure className={styles.figurePair}>
            <Image
              src="/projects/case/app.webp"
              alt="App-grensesnitt – plassholder"
              width={1122}
              height={1402}
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </figure>
          <figure className={styles.figurePair}>
            <Image
              src="/projects/case/brand.webp"
              alt="Merkevareelementer – plassholder"
              width={1122}
              height={1402}
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </figure>
        </div>

        {/* ---- Løsningen ---- */}
        <section className={styles.block}>
          <p className={`${styles.kicker} mono`}>løsningen</p>
          <h2 className={styles.h2}>Idéen, satt i system.</h2>
          <p className={styles.body}>
            Her forklares grepet: konseptet, det visuelle systemet og hvordan det
            spiller ut på tvers av flater. Plassholdertekst som demonstrerer
            rytmen mellom tekstblokker og bilder nedover siden.
          </p>
        </section>
      </main>

      {/* ---- Full bredde: i bruk ---- */}
      <figure className={styles.figureBleed}>
        <Image
          src="/projects/case/billboard.webp"
          alt="Kampanjen i bruk – plassholder"
          width={1916}
          height={821}
          sizes="100vw"
        />
      </figure>

      <main className={styles.main}>
        <section className={styles.block}>
          <p className={`${styles.kicker} mono`}>resultatet</p>
          <h2 className={styles.h2}>Fra idé til ferdig uttrykk.</h2>
          <p className={styles.body}>
            En avsluttende refleksjon: hva ble levert, og hvilken effekt hadde
            det? Plassholdertekst. Den ekte casen fylles inn senere – her er det
            kun strukturen og det visuelle som teller.
          </p>
        </section>
      </main>

      {/* ---- Neste prosjekt ---- */}
      <Link
        href={`/prosjekt/${next.slug}`}
        className={styles.next}
        aria-label={`Neste prosjekt: ${next.title}`}
      >
        <Image
          className={styles.nextImg}
          src="/projects/case/teaser.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.nextScrim} aria-hidden="true" />
        <div className={styles.nextInner}>
          <p className={`${styles.kicker} mono`}>neste prosjekt</p>
          <span className={styles.nextTitle}>
            {next.title}
            <span className={styles.nextArrow} aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
