import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import ArtImage from "../ArtImage";
import PhotoGallery, { type PhotoGroup } from "../PhotoGallery";
import shared from "../ProjectPage.module.css";
import styles from "./SportyFotografi.module.css";

// Dedicated case for "Sporty-fotografi": a brand-photography showcase of staff
// portraits and group shots taken for Sporty. The page is gallery-led — the
// text frames the approach, and the images carry the rest. Layout reuses the
// shared ProjectPage structure (hero/meta/blocks/next); the grouped, clickable
// gallery + fullscreen lightbox live in the PhotoGallery client component.

const BASE = "/projects/sporty-fotografi";

// One strong landscape shown large between the text and the gallery.
const FEATURED = { src: `${BASE}/p1067566.webp`, w: 1600, h: 1066 };

// The gallery, split into the same groups as the source folders so related
// shots stay together. Real pixel sizes are passed through so next/image
// reserves each slot and the masonry columns don't reflow while loading. The
// hero cover and the featured shot are left out to avoid repeating them.
const GROUPS: PhotoGroup[] = [
  {
    label: "ansatte",
    alt: "Brandfoto av ansatte for Sporty",
    size: "md",
    id: "galleri-ansatte",
    shots: [
      { name: "jared", w: 1200, h: 1600 },
      { name: "p1000733", w: 1600, h: 1067 },
      { name: "stine", w: 1200, h: 1600 },
      { name: "p1033348", w: 1600, h: 1200 },
      { name: "p1011661", w: 1067, h: 1600 },
      { name: "p1034116-3", w: 1600, h: 1067 },
      { name: "jeanette", w: 1200, h: 1600 },
      { name: "p1044483", w: 1600, h: 1067 },
      { name: "p1067222", w: 1067, h: 1600 },
      { name: "p1000747", w: 1600, h: 1067 },
      { name: "p1077587", w: 1067, h: 1600 },
      { name: "p1033671-2", w: 1600, h: 1200 },
      { name: "p1045024", w: 1066, h: 1600 },
      { name: "p1034277", w: 1600, h: 1066 },
      { name: "p1077819", w: 1200, h: 1600 },
      { name: "p1033707-4", w: 1600, h: 1200 },
      { name: "p1067483-2", w: 1600, h: 1066 },
      { name: "p1077680", w: 1600, h: 1067 },
      { name: "p1067530", w: 1600, h: 1067 },
      { name: "p1033638", w: 1600, h: 900 },
    ].map((s) => ({ ...s, src: `${BASE}/${s.name}.webp` })),
  },
  {
    label: "sporty-sekken",
    alt: "Produktfoto av Sporty-sekken",
    size: "lg",
    id: "galleri-sekken",
    shots: [
      { name: "p1055934", w: 1067, h: 1600 },
      { name: "p1055955", w: 1067, h: 1600 },
      { name: "p1055963", w: 1067, h: 1600 },
      { name: "p1055972", w: 1067, h: 1600 },
      { name: "p1055987", w: 1067, h: 1600 },
      { name: "p1056008", w: 1067, h: 1600 },
      { name: "p1056155", w: 1067, h: 1600 },
      { name: "p1056159", w: 1067, h: 1600 },
    ].map((s) => ({ ...s, src: `${BASE}/sekken/${s.name}.webp` })),
  },
  {
    label: "helene",
    alt: "Brandfoto med Helene for Sporty",
    size: "md",
    id: "galleri-helene",
    shots: [
      { name: "p1067271", w: 1600, h: 1067 },
      { name: "p1067283", w: 1600, h: 1067 },
      { name: "p1067343", w: 1600, h: 1067 },
      { name: "p1067351", w: 1600, h: 1067 },
      { name: "p1067376", w: 1600, h: 1067 },
      { name: "p1067391", w: 1600, h: 1067 },
      { name: "p1067397", w: 1600, h: 1067 },
      { name: "p1067398", w: 1600, h: 1067 },
    ].map((s) => ({ ...s, src: `${BASE}/helene/${s.name}.webp` })),
  },
];

// Gallery group ids, exported so the reading-progress rail can drop a checkpoint
// on each grouping. Kept in sync with the `id`s set on GROUPS above.
export const SECTION_IDS = GROUPS.map((g) => g.id!).filter(Boolean);

export default function SportyFotografi({
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
          alt={`${project.title} — brandfoto for Sporty`}
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
              <dd>Fotografi &amp; retusj</dd>
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
              <dt className="mono">type</dt>
              <dd>Portrett &amp; brandfoto</dd>
            </div>
          </dl>
          <p className={shared.summary}>
            Et utvalg brandbilder tatt for Sporty – portretter av de ansatte,
            alene og sammen. Det er menneskene som møter medlemmene hver dag, og
            måten de fremstår på er en stor del av hvordan merkevaren oppleves.
          </p>
        </section>

        {/* ---- Tilnærmingen ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>tilnærmingen</p>
          <h2 className={shared.h2}>Personen, ikke posituren.</h2>
          <p className={shared.body}>
            Et godt portrett av en kollega handler om å få frem personen, ikke
            posituren. De fleste er ikke vant til å stå foran et kamera, og
            jobben min er like mye å få folk til å slappe av som å trykke på
            utløseren. Når noen ler ekte, eller glemmer at kameraet er der et
            øyeblikk, er det da bildet blir bra. Det er den varmen jeg er ute
            etter – fordi det er den medlemmene møter i døra.
          </p>
        </section>
      </main>

      {/* ---- Featured shot ---- */}
      <figure className={styles.featuredWrap}>
        <Image
          className={styles.featuredImg}
          src={FEATURED.src}
          alt={`${project.title} — brandfoto for Sporty`}
          width={FEATURED.w}
          height={FEATURED.h}
          sizes="(max-width: 1080px) 100vw, 1080px"
        />
        <figcaption className={`${shared.cap} mono`}>
          brandfoto · sporty
        </figcaption>
      </figure>

      <main className={shared.main}>
        {/* ---- Blikket ---- */}
        <section className={shared.block}>
          <p className={`${shared.kicker} mono`}>blikket</p>
          <h2 className={shared.h2}>Egne bilder, ett uttrykk.</h2>
          <p className={shared.body}>
            Bildene skal fungere hver for seg, men også sammen. Et brand lever på
            helhet: like rammer, samme lys, en gjennomgående tone som gjør at et
            profilbilde av én ansatt og et gruppebilde fra et helt senter føles
            som del av samme familie. Mye av arbeidet ligger der – i å fange
            personligheten til hver enkelt, samtidig som alt henger sammen som
            ett uttrykk.
          </p>
        </section>

        {/* ---- Utvalget ---- */}
        <section className={`${shared.block} ${styles.galleryBlock}`}>
          <p className={`${shared.kicker} mono`}>utvalget</p>
          <h2 className={shared.h2}>La bildene snakke.</h2>
          <p className={shared.body}>
            Bildene under er et utdrag – ansatte fra Sporty, fotografert som en
            del av merkevarens visuelle identitet. De er ment å vises, ikke
            forklares. Så jeg lar dem snakke for seg selv. Trykk på et bilde for
            å se det i fullskjerm.
          </p>
        </section>
      </main>

      {/* Grouped, clickable masonry gallery with a fullscreen lightbox. */}
      <PhotoGallery groups={GROUPS} />

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
