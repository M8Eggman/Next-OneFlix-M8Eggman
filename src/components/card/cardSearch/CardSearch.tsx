"use client";

import "./CardSearch.sass";
import { TypeAnime } from "@/types";

export default function CardSearch({ anime }: { anime: TypeAnime }) {
  return (
    <div className="CardSearch">
      <div className="CardSearchImageContainer">
        <img src={anime?.images?.webp?.large_image_url} alt={anime?.title} />
        <p>{anime?.price}</p>
      </div>
    </div>
  );
}
