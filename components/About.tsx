import Link from "next/link";
import PortraitDeck from "./PortraitDeck";
import styles from "./About.module.css";

// Placeholder deck: the same portrait repeated so the card-stack interaction is
// visible. Swap these for distinct images later — order top → bottom.
const PHOTOS = [
  "/om/martin.webp",
  "/om/martin.webp",
  "/om/martin.webp",
  "/om/martin.webp",
  "/om/martin.webp",
];

// Contact details live here so they're trivial to update. Email and phone are
// shown as plain text (no mailto:/tel: links, by request); only social
// profiles are clickable. Each renders only when filled in.
const EMAIL = "martin.magnussen@outlook.com";
const PHONE = "+47 950 71 791";
const SOCIALS: { label: string; href: string }[] = [
  { label: "linkedin", href: "https://www.linkedin.com/in/martin-b-magnussen" },
];

export default function About() {
  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <PortraitDeck images={PHOTOS} alt="Martin Magnussen" />

          <div className={styles.bio}>
            <p className={`${styles.kicker} mono`}>om meg</p>
            <h1 className={styles.heading}>
              Designer &amp; visuell kommunikatør fra Bergen.
            </h1>

            <div className={styles.lead}>
              <p>
                Til daglig jobber jeg med merkevare, design og innhold – fra
                rebranding til kampanjer. Det som driver meg mest er den tidlige
                fasen av et prosjekt, der en utfordring skal bli til en idé, og
                ideen til noe som faktisk virker.
              </p>
              <p>
                En god idé er sjelden den første som dukker opp; den krever at
                man tør å tenke nytt og strekke den lenger enn man skulle tro var
                nødvendig. Jeg jobber gjerne helhetlig – fra idé til ferdig
                design, foto og film.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.contact} id="kontakt">
          <p className={`${styles.kicker} mono`}>kontakt</p>
          <h2 className={styles.contactHeading}>La oss lage noe sammen.</h2>
          <p className={styles.contactText}>
            Basert i Bergen. Åpen for oppdrag, samarbeid og en uforpliktende
            prat.
          </p>

          <dl className={styles.details}>
            {EMAIL ? (
              <div className={styles.detailRow}>
                <dt className="mono">e-post</dt>
                <dd>{EMAIL}</dd>
              </div>
            ) : null}
            {PHONE ? (
              <div className={styles.detailRow}>
                <dt className="mono">telefon</dt>
                <dd>{PHONE}</dd>
              </div>
            ) : null}
          </dl>

          <div className={styles.socials}>
            {/* Internal link to the CV page, where it can be viewed or saved
                as PDF. Shares the social-pill look (and its lime glow). */}
            <Link href="/cv" className={`${styles.socialBtn} mono`}>
              cv
              <svg
                className={styles.extIcon}
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
              >
                <path
                  d="M14 3v5h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {SOCIALS.length > 0 ? (
              SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialBtn} mono`}
                >
                  {s.label}
                  {/* Arrow that nudges out on hover — signals an external link. */}
                  <svg
                    className={styles.extIcon}
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 17 17 7M9 7h8v8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="visually-hidden">(åpner i ny fane)</span>
                </a>
              ))
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
