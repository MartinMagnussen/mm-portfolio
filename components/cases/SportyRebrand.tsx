import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import ArtImage from "../ArtImage";
import shared from "../ProjectPage.module.css";
import styles from "./SportyRebrand.module.css";

// Dedicated case for "Sporty Rebrand" — the flagship project. A total rebranding
// that merged four gym chains under one brand: concept, logo, full visual
// identity, and the living system Martin still owns. The page is identity-led:
// two big chapters ("Identiteten" — logo / type / colour / pattern, and
// "Systemet i bruk" — brand photo / templates / posters), each broken into
// labelled facets with real brand assets. The colour palette is rendered as live
// CSS swatches from the actual brand hexes. Structural layout (hero/meta/blocks/
// next) is reused from the shared ProjectPage.

const BASE = "/projects/sporty-rebrand";
const PHOTO = "/projects/sporty-fotografi"; // staff photos reused for brandfoto

// The brand palette, rendered as live swatches from the real hex values.
const COLORS: { name: string; hex: string; note: string }[] = [
  { name: "primær", hex: "#F23A3D", note: "logo & aksent" },
  { name: "sekundær", hex: "#420001", note: "store flater" },
  { name: "støtte", hex: "#D1B2FA", note: "lilla" },
  { name: "støtte", hex: "#F9DECD", note: "krem" },
  { name: "støtte", hex: "#B9E7B2", note: "grønn" },
];

// Staff portraits (reused from the photography shoot) for the brandfoto facet.
const BRAND_PHOTOS = ["jared", "stine", "jeanette", "p1077819"];

export default function SportyRebrand({
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
          alt={`${project.title} — Sporty-logoen på dyp rød bakgrunn`}
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
              <dd>Konsept, logo &amp; identitet</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">år</dt>
              <dd>{project.year}</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">kunde</dt>
              <dd>Sporty (Family Sports Club)</dd>
            </div>
            <div className={shared.metaRow}>
              <dt className="mono">leveranse</dt>
              <dd>Total rebranding &amp; designsystem</dd>
            </div>
          </dl>
          <p className={shared.summary}>
            Sporty er resultatet av en total rebranding som samlet fire
            treningskjeder under én merkevare. Jeg utviklet konseptet, logoen og
            hele den visuelle identiteten – og eier den løpende utviklingen den
            dag i dag.
          </p>
        </section>

        {/* ---- Utfordringen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>utfordringen</p>
          <h2 className={shared.h2}>Fire merkevarer, ett uttrykk.</h2>
          <p className={shared.body}>
            Family Sports Club eide fire ulike kjeder – Aktiv Trening, Aktiv365,
            Sporty24 og Family Sports Club selv. Fire navn, fire uttrykk, fire
            merkevarer å bygge. For å gjøre merkevarebyggende markedsføring mer
            effektiv var det behov for å samle alt under én tydelig, gjenkjennbar
            identitet. Oppgaven var ikke bare å designe en logo, men å skape et
            helhetlig system som kunne bære et helt selskap på tvers av sentre,
            flater og kanaler.
          </p>
        </section>

        {/* ---- Min rolle ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>min rolle</p>
          <h2 className={shared.h2}>Fra idé som utløste hele rebrandingen.</h2>
          <p className={shared.body}>
            Jeg begynte å jobbe med logo og navn før selve rebrandingen var
            besluttet. Da jeg hadde et konsept å vise frem, ble det grunnlaget
            styret tok stilling til – og beslutningen om å rebrande til Sporty
            ble tatt. Slik hadde jeg en rolle både i å utløse rebrandingen, i
            gjennomføringen av den, og i den videre utviklingen av merkevaren
            etterpå. I dag står jeg bak det meste av det som kommuniseres visuelt
            fra Sporty.
          </p>
        </section>
      </main>

      {/* ======================================================= */}
      {/* IDENTITETEN */}
      {/* ======================================================= */}
      <main className={shared.main}>
        <section id="identiteten" className={`${shared.block} ${styles.lead}`}>
          <p className={`${shared.kicker} mono`}>identiteten</p>
          <h2 className={shared.h2}>Byggeklossene i merkevaren.</h2>
          <p className={shared.body}>
            Logo, typografi, farger og mønster – fire deler som sammen gir Sporty
            ett gjenkjennelig uttrykk på tvers av alt.
          </p>
        </section>

        {/* ---- Logo ---- */}
        <section className={`${shared.block} ${styles.facet}`}>
          <p className={`${shared.kicker} mono`}>logo</p>
          <h3 className={styles.h3}>En figur i bevegelse.</h3>
          <p className={shared.body}>
            Logoen består av et logosymbol og et navntrekk. Symbolet er en
            stilisert figur i bevegelse som representerer aktivitet, energi og
            mestring, mens navntrekket gir en tydelig og moderne avsender. Logoen
            er overordnet for alle Sporty-sentre og konsepter, og binder
            identiteten sammen på tvers av flater.
          </p>
        </section>
        <figure className={styles.media}>
          <Image
            className={styles.mediaImg}
            src={`${BASE}/logo-symbol.webp`}
            alt="Sporty-logosymbolet – en stilisert figur i bevegelse"
            width={1770}
            height={1266}
            sizes="(max-width: 1080px) 100vw, 1080px"
          />
          <figcaption className={`${shared.cap} mono`}>
            logosymbol · figur i bevegelse
          </figcaption>
        </figure>

        {/* ---- Typografi ---- */}
        <section className={`${shared.block} ${styles.facet}`}>
          <p className={`${shared.kicker} mono`}>typografi</p>
          <h3 className={styles.h3}>To fonter, ett system.</h3>
          <p className={shared.body}>
            Identiteten skiller mellom to fonter: PP Right Grotesk Spatial til
            titler og display, og GT Walsheim Pro til mengdetekst. Displaytekst
            settes som hovedregel i black og i blokkbokstaver, for et tydelig og
            energisk uttrykk – med rom for unntak der et lettere uttrykk passer
            bedre.
          </p>
        </section>
        <div className={styles.typoGrid}>
          <dl className={styles.typoSpec}>
            <div className={styles.typoRow}>
              <dt className="mono">display / tittel</dt>
              <dd>PP Right Grotesk Spatial — Black, blokkbokstaver</dd>
            </div>
            <div className={styles.typoRow}>
              <dt className="mono">underoverskrift</dt>
              <dd>PP Right Grotesk Spatial — Medium</dd>
            </div>
            <div className={styles.typoRow}>
              <dt className="mono">mengdetekst</dt>
              <dd>GT Walsheim Pro — Regular</dd>
            </div>
          </dl>
          <figure className={styles.typoFigure}>
            <Image
              className={styles.mediaImg}
              src={`${BASE}/poster-red.webp`}
              alt="Plakat som viser displaytypografien i bruk: «Hva venter du på? Bli Sporty!»"
              width={1836}
              height={2592}
              sizes="(max-width: 760px) 100vw, 460px"
            />
            <figcaption className={`${shared.cap} mono`}>
              display i bruk · plakat
            </figcaption>
          </figure>
        </div>

        {/* ---- Farger ---- */}
        <section className={`${shared.block} ${styles.facet}`}>
          <p className={`${shared.kicker} mono`}>farger</p>
          <h3 className={styles.h3}>Energi, bevegelse, vitalitet.</h3>
          <p className={shared.body}>
            Fargepaletten er bygget for å formidle energi, bevegelse og
            vitalitet. Primærfargen – en varm rød (#F23A3D) – er sentral i logoen
            og sikrer sterk gjenkjennelse, mens en dyp sekundærfarge (#420001)
            bærer større flater og gir balanse. Sammen med et sett støttefarger
            gir paletten et fleksibelt, men konsekvent uttrykk på tvers av
            kanaler.
          </p>
        </section>
        <div className={styles.media}>
          <ul className={styles.swatches}>
            {COLORS.map((c) => (
              <li key={c.hex} className={styles.swatch}>
                <span
                  className={styles.swatchChip}
                  style={{ background: c.hex }}
                  aria-hidden="true"
                />
                <span className={`${styles.swatchName} mono`}>{c.name}</span>
                <span className={`${styles.swatchHex} mono`}>{c.hex}</span>
                <span className={`${styles.swatchNote} mono`}>{c.note}</span>
              </li>
            ))}
          </ul>
          <div className={styles.posters}>
            {[
              { f: "poster-purple", a: "Plakat i lilla støttefarge" },
              { f: "poster-cream", a: "Plakat i krem støttefarge" },
              { f: "poster-green", a: "Plakat i grønn støttefarge" },
            ].map((p) => (
              <Image
                key={p.f}
                className={styles.posterImg}
                src={`${BASE}/${p.f}.webp`}
                alt={p.a}
                width={1665}
                height={2352}
                sizes="(max-width: 760px) 50vw, 330px"
              />
            ))}
          </div>
          <p className={`${shared.cap} mono`}>
            samme plakat, ulike støttefarger
          </p>
        </div>

        {/* ---- Mønster ---- */}
        <section className={`${shared.block} ${styles.facet}`}>
          <p className={`${shared.kicker} mono`}>mønster</p>
          <h3 className={styles.h3}>Hentet rett fra logoen.</h3>
          <p className={shared.body}>
            Mønsteret er hentet direkte fra logoen: utsnitt fra logoikonet
            bearbeides med en halvtoneeffekt til et prikkbasert mønster. Det
            knytter alt det visuelle tilbake til kjernen i merkevaren, og kan
            brukes videre på alt fra bakgrunner til produktdesign.
          </p>
        </section>
        <div className={`${styles.media} ${shared.pair}`}>
          <figure className={shared.figurePair}>
            <Image
              className={styles.pairImg}
              src={`${BASE}/logo-detail.webp`}
              alt="Halvtonemønster avledet fra logoikonet"
              width={1770}
              height={1266}
              sizes="(max-width: 760px) 100vw, 520px"
            />
          </figure>
          <figure className={shared.figurePair}>
            <Image
              className={styles.pairImg}
              src={`${BASE}/can.webp`}
              alt="Sporty Energy-boks med mønsteret brukt i produktdesign"
              width={3546}
              height={2850}
              sizes="(max-width: 760px) 100vw, 520px"
            />
          </figure>
        </div>
      </main>

      {/* ======================================================= */}
      {/* SYSTEMET I BRUK */}
      {/* ======================================================= */}
      <main className={shared.main}>
        <section id="systemet" className={`${shared.block} ${styles.lead}`}>
          <p className={`${shared.kicker} mono`}>systemet i bruk</p>
          <h2 className={shared.h2}>En merkevare lever ikke i en manual.</h2>
          <p className={shared.body}>
            Den lever i bruk. Identiteten er bygget ut til et komplett system som
            de ansatte faktisk kan jobbe i – fra foto til malverk til
            plakatering.
          </p>
        </section>

        {/* ---- Brandfoto og profilbilder ---- */}
        <section className={`${shared.block} ${styles.facet}`}>
          <p className={`${shared.kicker} mono`}>brandfoto &amp; profilbilder</p>
          <h3 className={styles.h3}>Ett felles visuelt språk.</h3>
          <p className={shared.body}>
            Retningslinjer for hvordan ansatte fotograferes – engasjerte,
            imøtekommende og tilgjengelige, med treningsmiljøet synlig i
            bakgrunnen. Et felles visuelt språk som gjør at et profilbilde fra
            ett senter og et gruppebilde fra et annet hører til samme familie.
          </p>
        </section>
        <div className={styles.media}>
          <div className={styles.photoGrid}>
            {BRAND_PHOTOS.map((name) => (
              <Image
                key={name}
                className={styles.photoImg}
                src={`${PHOTO}/${name}.webp`}
                alt="Brandfoto av ansatt for Sporty"
                width={1200}
                height={1600}
                sizes="(max-width: 760px) 50vw, 260px"
              />
            ))}
          </div>
        </div>

        {/* ---- Malverk ---- */}
        <section className={`${shared.block} ${styles.facet}`}>
          <p className={`${shared.kicker} mono`}>malverk</p>
          <h3 className={styles.h3}>On-brand uten designbakgrunn.</h3>
          <p className={shared.body}>
            Sporty bruker Canva Teams som plattform for malverket, med ferdige
            maler for plakater, sosiale medier, presentasjoner og visittkort. Det
            gjør at folk uten designbakgrunn kan produsere on-brand materiell selv
            – og malverket utvikles løpende basert på behov.
          </p>
        </section>

        {/* ---- Plakatering ---- */}
        <section className={`${shared.block} ${styles.facet}`}>
          <p className={`${shared.kicker} mono`}>plakatering</p>
          <h3 className={styles.h3}>Konsekvent, men fleksibelt.</h3>
          <p className={shared.body}>
            Et system for plakater på sentrene, med faste plakater til definerte
            plasseringer og frie plakater senterlederne kan bruke der det passer.
            Profilering som er konsekvent, men fleksibel nok til å fungere i en
            travel senterhverdag.
          </p>
        </section>
        <figure className={styles.media}>
          <Image
            className={styles.mediaImg}
            src={`${BASE}/poster-flyer.webp`}
            alt="Trykt plakat/flyer for Sporty med brandfoto og kontaktinfo"
            width={1356}
            height={1416}
            sizes="(max-width: 1080px) 100vw, 1080px"
          />
          <figcaption className={`${shared.cap} mono`}>
            plakat på senteret · trykk
          </figcaption>
        </figure>

        {/* ---- Resultatet ---- */}
        <section id="resultatet" className={shared.block}>
          <p className={`${shared.kicker} mono`}>resultatet</p>
          <h2 className={shared.h2}>Bygget for å vare og vokse.</h2>
          <p className={shared.body}>
            Sporty er en levende merkevare bygget for å vare og vokse –
            dokumentert i en 57-siders brand guide, men viktigere: i daglig bruk
            på tvers av et helt selskap. Det er det prosjektet jeg er mest stolt
            av, fordi det viser hele spennet jeg jobber i: fra den strategiske
            idéen som utløste rebrandingen, til logoen, systemet og de tusen små
            anvendelsene som gjør at en merkevare faktisk henger sammen.
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

// Checkpoints for the reading-progress rail — the two big chapters + result.
export const SECTION_IDS = ["identiteten", "systemet", "resultatet"];
