"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/projects";
import CanvasView from "@/components/CanvasView";
import ListView from "@/components/ListView";
import Intro from "@/components/Intro";
import styles from "./Home.module.css";

export default function Home({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const router = useRouter();
  // The view is URL-driven so the shared top-nav indicator and the canvas stay
  // in sync, and so "arbeid" is reachable in a single click from any page.
  const showList = params.get("view") === "arbeid";

  // Reduced-motion visitors get the calmer list by default. Redirect the URL
  // (rather than only swapping what's rendered) so the nav indicator matches.
  useEffect(() => {
    if (params.get("view")) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) router.replace("/?view=arbeid");
  }, [params, router]);

  return (
    <div className={styles.root}>
      <main className={styles.stage}>
        {showList ? (
          <ListView projects={projects} />
        ) : (
          <CanvasView projects={projects} />
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
          {/* Styled inline rather than via `.mono`, which forces 0.72rem and
              lowercases — that would shrink this and break the name's casing. */}
          <text
            fill="var(--muted)"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              letterSpacing: "0.04em",
            }}
          >
            {/* One phrase ~fills the ring, so its end meets its start cleanly. */}
            <textPath href="#badge-circle" startOffset="0%">
              {`Martin Magnussen · ${new Date().getFullYear()} · `}
            </textPath>
          </text>
        </svg>
        <span className={styles.center}>✦</span>
      </div>

      <Intro />
    </div>
  );
}
