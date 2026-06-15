import { Suspense } from "react";
import Home from "@/components/Home";
import { projects } from "@/lib/projects";

export default function Page() {
  // Home reads the active view from the URL (useSearchParams), which Next
  // requires to sit under a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <Home projects={projects} />
    </Suspense>
  );
}
