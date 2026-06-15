import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.css";

// Contact details live here so they're trivial to update. Links only render
// when filled in, so the contact block never shows half-empty placeholders.
const EMAIL = "martin.magnussen@outlook.com";
const SOCIALS: { label: string; href: string }[] = [
  { label: "linkedin", href: "https://www.linkedin.com/in/martin-b-magnussen" },
];

export default function About() {
  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <Link
          href="/"
          className={styles.logo}
          aria-label="Martin Magnussen — forside"
        >
          <span>m</span>
          <span>m</span>
        </Link>

        <nav className={styles.centerNav} aria-label="Hovednavigasjon">
          {/* Same pill as the front page; here "om meg" is the current page so
              the sliding indicator rests under it and the others are links. */}
          <div className={`${styles.toggle} mono`} data-view="om">
            <span className={styles.slider} aria-hidden="true" />
            <Link href="/" className={styles.navItem}>
              forside
            </Link>
            <Link href="/" className={styles.navItem}>
              arbeid
            </Link>
            <span className={styles.navItem} data-active aria-current="page">
              om meg
            </span>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <figure className={styles.portrait}>
            <Image
              src="/om/martin.webp"
              alt="Martin Magnussen"
              width={516}
              height={689}
              priority
              sizes="(max-width: 768px) 70vw, 380px"
            />
          </figure>

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

          {EMAIL ? (
            <a className={styles.emailBtn} href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          ) : null}

          {SOCIALS.length > 0 ? (
            <ul className={`${styles.socials} mono`}>
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </main>
    </div>
  );
}
