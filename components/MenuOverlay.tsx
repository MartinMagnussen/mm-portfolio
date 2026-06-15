"use client";

import { useEffect, useRef } from "react";
import styles from "./MenuOverlay.module.css";

const links = [
  { href: "/", label: "Forside" },
  { href: "/#arbeid", label: "Arbeid" },
  { href: "/om", label: "Om meg" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Meny"
    >
      <div className={styles.bar}>
        <button
          ref={closeRef}
          type="button"
          className={`${styles.close} mono`}
          onClick={onClose}
        >
          lukk ✕
        </button>
      </div>

      <nav className={styles.nav}>
        {links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            ref={i === 0 ? firstLinkRef : undefined}
            onClick={onClose}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className={`${styles.meta} mono`}>
        <span>martin magnussen</span>
        <span>© 2025</span>
      </div>
    </div>
  );
}
