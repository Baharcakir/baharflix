import { Suspense } from "react";
import GenrePageClient from "./GenrePageClient";

export default function GenrePage() {
  return (
    <Suspense fallback={<div className="text-white">Loading genre...</div>}>
      <GenrePageClient />
    </Suspense>
  );
}