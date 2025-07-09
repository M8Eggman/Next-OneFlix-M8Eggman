"use client";

import "./CardHome.sass";
import { TypeAnime } from "@/types";

export default function CardHome({ anime }: { anime: TypeAnime }) {
  return (
    <div className="CardHome">
      <div className="CardHome__image">
        <img src={anime.images.webp.image_url} alt={anime.title} />
      </div>
    </div>
  )
}
