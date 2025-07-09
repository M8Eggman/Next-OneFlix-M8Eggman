"use client";

import { useState } from "react";
import { TypeAnime } from "@/types";
import { fetchAnimes } from "@/lib/fetchAnime";

export default function Carousel({ initialAnimes }: { initialAnimes: TypeAnime[] | null }) {
  const [animes, setAnimes] = useState<TypeAnime[] | null>(initialAnimes);
  const [loading, setLoading] = useState(false);

  async function handleRetry() {
    setLoading(true);
    const res = await fetchAnimes({ period: "year", limit: 6, orderBy: "popularity", sort: "asc", status: "complete", promotion: true });
    setAnimes(res || null);
    setLoading(false);
  }

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

  return (
    <div className="carousel">
      {animes.map((anime) => (
        <div key={anime.mal_id}>
          <img src={anime.images.webp.large_image_url} alt="" />
          <p>{anime.price}</p>
          {anime.promotion && <p>{Math.round(anime.promotion * 100)}%</p>}
        </div>
      ))}
    </div>
  );
}
