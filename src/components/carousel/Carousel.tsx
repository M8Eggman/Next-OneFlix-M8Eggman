"use client";

import { useState } from "react";
import { TypeAnime } from "@/types";
import { fetchAnimes } from "@/lib/fetchAnime";

export default function Carousel({ initialAnimes }: { initialAnimes: TypeAnime[] | null }) {
  const [animes, setAnimes] = useState<TypeAnime[] | null>(initialAnimes);
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    const res = await fetchAnimes({ period: "year", limit: 6, orderBy: "popularity", sort: "asc", status: "complete" });
    setAnimes(res || null);
    setLoading(false);
  };

  if (!animes) {
    return (
      <div className="CarouselError">
        <span>Aucun animé trouvé.</span>
        <button onClick={handleRetry} disabled={loading}>
          {loading ? "Chargement..." : "Réessayer"}
        </button>
      </div>
    );
  }

  return <div>Carousel avec {animes?.slice(0, 6).length} animés</div>;
}
