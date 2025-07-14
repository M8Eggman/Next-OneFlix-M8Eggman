"use client";

import "./CardHome.sass";
import { TypeAnime } from "@/types";

export default function CardHome({ anime }: { anime: TypeAnime }) {
  return (
    <div className="CardHome">
      <div className="CardHomeImageContainer">
        <img src={anime.images.webp.large_image_url} alt={anime.title} />
        <p>{anime.price}</p>
        {anime.promotion && <p>{Math.round(anime.promotion * 100)}%</p>}
      </div>
    </div>
  );
}
