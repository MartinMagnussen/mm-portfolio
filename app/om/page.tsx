import type { Metadata } from "next";
import About from "@/components/About";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Om meg",
  description:
    "Martin Magnussen er en designer og visuell kommunikatør fra Bergen som jobber med merkevare, design og innhold – fra idé til ferdig design, foto og film.",
  alternates: { canonical: "/om" },
  openGraph: {
    title: "Om meg — Martin Magnussen",
    description:
      "Designer og visuell kommunikatør fra Bergen. Fra idé til ferdig design, foto og film.",
    url: "/om",
    type: "profile",
  },
};

// One checkpoint per section on the page, mirroring the CV's progress rail.
const SECTION_IDS = ["om-intro", "om-verktoy", "kontakt"];

export default function OmPage() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress sections={SECTION_IDS} />
      <About />
    </>
  );
}
