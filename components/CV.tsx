import ScrollProgress from "./ScrollProgress";
import SmoothScroll from "./SmoothScroll";
import styles from "./CV.module.css";

// Ids the scroll-progress rail anchors its checkpoint nodes to — one per CV
// section, in document order.
const SECTION_IDS = ["cv-om", "cv-erfaring", "cv-utdanning", "cv-ferdigheter"];

// On-screen CV in the site's design system. The "last ned pdf" button links to
// a static PDF in /public (a temporary export of this same page, generated with
// headless Chrome, so it matches the site 1:1 — dark background, grid, fonts and
// lime accent). Swap that file when a hand-made CV is ready. A @media print
// block in CV.module.css also keeps the page itself printable as a fallback.
const PDF_HREF = "/cv/martin-magnussen-cv.pdf";

const PROFILE = {
  name: "Martin Magnussen",
  title: "Designer & visuell kommunikatør",
  location: "Bergen",
  email: "martin.magnussen@outlook.com",
  phone: "+47 950 71 791",
};

const ABOUT =
  "Designer og visuell kommunikatør fra Bergen. Det som driver meg mest er den tidlige fasen av et prosjekt, der en utfordring skal bli til en idé, og ideen til noe som faktisk virker. En god idé er sjelden den første som dukker opp; den krever at man tør å tenke nytt og strekke den lenger enn man skulle tro var nødvendig. Jeg jobber gjerne helhetlig, fra idé til ferdig design, foto og film.";

type Role = {
  title: string;
  org: string;
  period: string;
  points: { lead: string; rest: string }[];
};

const EXPERIENCE: Role[] = [
  {
    title: "Innholdsprodusent",
    org: "Sporty",
    period: "aug. 2024 – i dag",
    points: [
      {
        lead: "Rebranding av fire kjeder til én.",
        rest: "Utviklet konsept, navn og logo som ga styret grunnlaget for å samle Aktiv Trening, Aktiv365, Sporty24 og Family Sports Club under merkevaren Sporty — og fulgte arbeidet videre gjennom rebrandingen og den løpende utviklingen av brandet.",
      },
      {
        lead: "Eierskap over den visuelle identiteten.",
        rest: "Står bak det meste av det som kommuniseres visuelt fra selskapet.",
      },
      {
        lead: "Konseptutvikling, Sporty x Q-protein.",
        rest: "Helhetlig konsept koblet til VGTV-serien Svart Trøye: eget «limited edition»-kartongdesign med egne ikoner og budskapet «Sporty start. Fyll på smart.», en challenge, og en felles kampanjeside med et Norseman-inspirert spill. Også «Svart Trøye GT Challenge» for Sportys medlemmer.",
      },
      {
        lead: "Annonser for eksterne annonsører.",
        rest: "Tok utgangspunkt i kundens egne flater, definerte selv budskap og utforming, og leverte ferdige annonser godkjent av annonsør.",
      },
      {
        lead: "Lansering og produksjon.",
        rest: "Foreslo og produserte lanseringsvideoen på den internasjonale melkedagen — fra manus til opptak, redigering og publisering. Onboardingvideo til alle nye medlemmer, samt HTML5-annonser for digitale flater.",
      },
    ],
  },
  {
    title: "Designer (konsulent / freelance)",
    org: "STS / STS ISONOR",
    period: "2022 – 2023",
    points: [
      {
        lead: "Jubileumslogo for STS sitt 50-årsjubileum (2022).",
        rest: "Idéen og det kreative grepet var mitt, ut fra en brief om å videreføre STS sin identitet.",
      },
      {
        lead: "Ny logo ved fusjonen STS ISONOR (2023).",
        rest: "Logoen selskapet bruker i dag.",
      },
    ],
  },
];

const SKILLS: { label: string; value: string }[] = [
  {
    label: "sterkest innen",
    value:
      "kreativ konseptutvikling · design (visuell identitet og merkevare) · foto",
  },
  {
    label: "også",
    value: "filming og redigering · webdesign (three.js / 3D)",
  },
  {
    label: "verktøy",
    value:
      "Adobe InDesign, Illustrator, Photoshop, Lightroom, Premiere Pro (og noe After Effects) · Figma · DaVinci Resolve Studio · HTML5-annonser · kjennskap til Unreal Engine og Blender",
  },
];

export default function CV() {
  return (
    <div className={styles.root}>
      <SmoothScroll />
      <ScrollProgress sections={SECTION_IDS} />

      {/* Floating action — downloads the static PDF; hidden when printing. */}
      <div className={styles.actions}>
        <a
          href={PDF_HREF}
          download
          className={`${styles.printBtn} mono`}
        >
          last ned pdf
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <article className={styles.sheet}>
        {/* ---- Header (a div, not <header>: the print stylesheet hides the
            page's <header> nav, and we don't want this caught by that). ---- */}
        <div className={styles.head}>
          <div className={styles.identity}>
            <span className={styles.monogram} aria-hidden="true">
              mm
            </span>
            <div>
              <h1 className={styles.name}>{PROFILE.name}</h1>
              <p className={styles.title}>{PROFILE.title}</p>
            </div>
          </div>

          <dl className={styles.contact}>
            <div className={styles.contactRow}>
              <dt className="mono">sted</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div className={styles.contactRow}>
              <dt className="mono">e-post</dt>
              <dd>{PROFILE.email}</dd>
            </div>
            <div className={styles.contactRow}>
              <dt className="mono">telefon</dt>
              <dd>{PROFILE.phone}</dd>
            </div>
          </dl>
        </div>

        {/* ---- Om meg ---- */}
        <section className={styles.section} id="cv-om">
          <p className={`${styles.label} mono`}>om meg</p>
          <div className={styles.sectionBody}>
            <p className={styles.lead}>{ABOUT}</p>
          </div>
        </section>

        {/* ---- Erfaring ---- */}
        <section className={styles.section} id="cv-erfaring">
          <p className={`${styles.label} mono`}>erfaring</p>
          <div className={styles.sectionBody}>
            {EXPERIENCE.map((role) => (
              <div key={role.org} className={styles.role}>
                <div className={styles.roleHead}>
                  <h2 className={styles.roleTitle}>
                    {role.title} <span className={styles.org}>— {role.org}</span>
                  </h2>
                  <span className={`${styles.period} mono`}>{role.period}</span>
                </div>
                <ul className={styles.points}>
                  {role.points.map((p) => (
                    <li key={p.lead}>
                      <strong>{p.lead}</strong> {p.rest}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Utdanning ---- */}
        <section className={styles.section} id="cv-utdanning">
          <p className={`${styles.label} mono`}>utdanning</p>
          <div className={styles.sectionBody}>
            <div className={styles.role}>
              <div className={styles.roleHead}>
                <h2 className={styles.roleTitle}>
                  Bachelor i visuell kommunikasjon
                </h2>
                <span className={`${styles.period} mono`}>2024</span>
              </div>
              <p className={styles.eduPlace}>Universitetet i Bergen, KMD</p>
            </div>
          </div>
        </section>

        {/* ---- Ferdigheter ---- */}
        <section className={styles.section} id="cv-ferdigheter">
          <p className={`${styles.label} mono`}>ferdigheter</p>
          <div className={styles.sectionBody}>
            <dl className={styles.skills}>
              {SKILLS.map((s) => (
                <div key={s.label} className={styles.skillRow}>
                  <dt className="mono">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </article>
    </div>
  );
}
