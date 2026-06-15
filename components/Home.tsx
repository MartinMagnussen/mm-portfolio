"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import CanvasView from "@/components/CanvasView";
import ListView from "@/components/ListView";
import MenuOverlay from "@/components/MenuOverlay";
import Intro from "@/components/Intro";
import styles from "./Home.module.css";

type View = "spiral" | "list";

export default function Home({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<View>("spiral");
  const [menuOpen, setMenuOpen] = useState(false);

  // Spiral is the default everywhere (incl. mobile); only fall back to the
  // calmer list view when the visitor has asked for reduced motion.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deliberate post-mount preference read: rendering "spiral" on both the
    // server and the first client paint keeps hydration in sync, then we
    // downgrade reduced-motion visitors to the list here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reduced) setView("list");
  }, []);

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.logo} aria-label="Martin Magnussen — forside">
          <span>m</span>
          <span>m</span>
        </Link>

        <div
          className={`${styles.toggle} mono`}
          role="group"
          aria-label="Bytt visning"
          data-view={view}
        >
          <span className={styles.slider} aria-hidden="true" />
          <button
            type="button"
            data-active={view === "spiral"}
            aria-pressed={view === "spiral"}
            onClick={() => setView("spiral")}
          >
            spiral
          </button>
          <button
            type="button"
            data-active={view === "list"}
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            liste
          </button>
        </div>

        <button
          type="button"
          className={`${styles.menuBtn} mono`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          meny <span className={styles.dot} aria-hidden="true" />
        </button>
      </header>

      <main className={styles.stage}>
        {view === "spiral" ? (
          <CanvasView projects={projects} />
        ) : (
          <ListView projects={projects} />
        )}
      </main>

      <div className={styles.badge} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <defs>
            <path
              id="badge-circle"
              d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
            />
          </defs>
          <text className="mono" fill="var(--muted)" fontSize="9">
            <textPath href="#badge-circle" startOffset="0%">
              showreel · 2025 · showreel · 2025 ·
            </textPath>
          </text>
        </svg>
        <span className="center">✦</span>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Intro />
    </div>
  );
}
