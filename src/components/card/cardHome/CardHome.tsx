"use client";

import { useState } from "react";
import "./CardHome.sass";
import { TypeAnime } from "@/types";
import { MdShoppingCart } from "react-icons/md";
import { useRouter } from "next/navigation";
import AjouterPanier from "@/components/buttons/AjouterPanier/AjouterPanier";

export default function CardHome({ anime }: { anime: TypeAnime }) {
  // Verifie si la souris est sur la carte
  const [isHover, setIsHover] = useState(false);

  const router = useRouter();

  return (
    <div className="cardHome" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={() => router.push(`/anime/${anime.mal_id}`)}>
      <div className="cardHomeContainer">
        <div className="cardHomeImage">
          <img src={anime.images.webp.large_image_url} alt={anime.title} />
          <img src={anime.images.webp.large_image_url} alt={anime.title} />
        </div>
        <div className="cardHomeInfos">
          <p>{anime.title}</p>
        </div>
      </div>
      <div className={`cardHomeHover${isHover ? " active" : ""}`}>
        <div className="cardHomeHoverInfos">
          <h3>{anime.title.length > 50 ? anime.title.slice(0, 50) + "..." : anime.title}</h3>
          <p>{anime.synopsis ? (anime.synopsis?.length > 250 ? anime.synopsis?.slice(0, 250) + "..." : anime.synopsis) : "Aucune description disponible"}</p>
          <div className="cardHomeHoverInfosPrices">
            <div className="cardHomeHoverInfosPricesPromotion">
              {anime.promotion ? <p style={{ textDecoration: "line-through" }}>{anime.price} €</p> : <p>{anime.price} €</p>}
              {anime.promotion && anime.price && <p>{anime.finalPrice} €</p>}
              {/* Si l'anime a un prix null ca veut dire qu'il n'est pas encore en vente */}
              {!anime.price && <p>N'est pas encore sorti</p>}
            </div>
            <AjouterPanier anime={anime} />
          </div>
          <div className="cardHomeHoverInfosGenres">
            {anime.genres.map((genre) => (
              <button key={genre.mal_id}>{genre.name}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
