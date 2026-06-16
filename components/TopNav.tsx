"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./TopNav.module.css";

// One persistent navigation bar, mounted in the root layout so it survives
// route changes — that's what lets the sliding indicator animate smoothly when
// moving between "/" and "/om" instead of snapping after a remount.
//
// "forside" and "arbeid" are the two views of the home page ("/"), told apart
// by the `?view=arbeid` query; "om meg" is its own route ("/om"). Linking
// arbeid straight to "/?view=arbeid" also means a click from the about page
// lands on the list in one hop instead of two.
export default function TopNav() {
  const pathname = usePathname();
  const params = useSearchParams();

  const state =
    pathname === "/om"
      ? "om"
      : pathname.startsWith("/prosjekt") || params.get("view") === "arbeid"
        ? "arbeid"
        : "forside";

  return (
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
        <div className={`${styles.toggle} mono`} data-state={state}>
          <span className={styles.slider} aria-hidden="true" />
          <Link
            href="/"
            className={styles.navItem}
            data-active={state === "forside" ? "" : undefined}
            aria-current={state === "forside" ? "page" : undefined}
          >
            forside
          </Link>
          <Link
            href="/?view=arbeid"
            className={styles.navItem}
            data-active={state === "arbeid" ? "" : undefined}
            aria-current={state === "arbeid" ? "page" : undefined}
          >
            arbeid
          </Link>
          <Link
            href="/om"
            className={styles.navItem}
            data-active={state === "om" ? "" : undefined}
            aria-current={state === "om" ? "page" : undefined}
          >
            om meg
          </Link>
        </div>
      </nav>
    </header>
  );
}
