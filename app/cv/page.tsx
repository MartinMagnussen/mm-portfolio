import type { Metadata } from "next";
import CV from "@/components/CV";

export const metadata: Metadata = {
  title: "CV",
  description:
    "CV for Martin Magnussen — designer og visuell kommunikatør fra Bergen. Erfaring, utdanning og ferdigheter.",
  alternates: { canonical: "/cv" },
  openGraph: {
    title: "CV — Martin Magnussen",
    description:
      "Designer og visuell kommunikatør fra Bergen. Erfaring, utdanning og ferdigheter.",
    url: "/cv",
    type: "profile",
  },
};

export default function CVPage() {
  return <CV />;
}
