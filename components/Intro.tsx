"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Intro.module.css";

export default function Intro() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const seen = sessionStorage.getItem("mm-intro-seen");

    if (reduced || seen) {
      setDone(true);
      return;
    }
    sessionStorage.setItem("mm-intro-seen", "1");

    const root = rootRef.current;
    if (!root) return;

    const finish = () => setDone(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.from(`.${styles.mark} span`, {
        yPercent: 120,
        rotate: 8,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          `.${styles.line}`,
          { y: 14, opacity: 0, duration: 0.6, ease: "power2.out" },
          "-=0.25",
        )
        .to({}, { duration: 0.7 })
        .to(root, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        });
    }, root);

    // Let an impatient visitor skip straight through.
    const skip = () => {
      ctx.kill();
      finish();
    };
    root.addEventListener("pointerdown", skip);

    return () => {
      root.removeEventListener("pointerdown", skip);
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.inner}>
        <span className={styles.mark}>
          <span>m</span>
          <span>m</span>
        </span>
        <span className={`${styles.line} mono`}>
          martin magnussen — kreativ konseptutvikler &amp; designer
        </span>
      </div>
    </div>
  );
}
