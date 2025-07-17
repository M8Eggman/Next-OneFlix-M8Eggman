"use client";

import { useState } from "react";
import "./CardHome.sass";
import { TypeAnime } from "@/types";
import { MdShoppingCart } from "react-icons/md";
import { useRouter } from "next/navigation";
import AjouterPanier from "@/components/buttons/AjouterPanier/AjouterPanier";
import { getTypeBadge } from "@/lib/utils";

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
          <h3>
            <span>{anime.title.length > 50 ? anime.title.slice(0, 50) + "..." : anime.title}</span>
            <span className={`typeBadge ${getTypeBadge(anime.type).class}`}>{getTypeBadge(anime.type).label}</span>
          </h3>
          {anime.rating && <p className="cardHomeHoverInfosRating">Note : {anime.rating}</p>}
          <p>{anime.synopsis ? (anime.synopsis?.length > 250 ? anime.synopsis?.slice(0, 250) + "..." : anime.synopsis) : "Aucune description disponible"}</p>
          <div className="cardHomeHoverInfosPrices">
            <div className="cardHomeHoverInfosPricesPromotion">
              {/* Si l'anime a un prix null ca veut dire qu'il n'est pas encore en vente */}
              {anime.finalPrice === 0 ? <p>Gratuit</p> : anime.promotion && anime.price && <p>{anime.finalPrice?.toFixed(2)} €</p>}
              {anime.promotion && anime.price ? (
                <p style={{ textDecoration: "line-through" }}>{anime.price?.toFixed(2)} €</p>
              ) : anime.price ? (
                <p>{anime.price?.toFixed(2)} €</p>
              ) : (
                <p>N'est pas encore sorti</p>
              )}
            </div>
            <AjouterPanier anime={anime} />
          </div>
          <div className="cardHomeHoverInfosGenres">
            {anime.genres
              .filter((genre) => genre.mal_id !== 9)
              .map((genre) => (
                <button
                  key={genre.mal_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/animes?genreId=${genre.mal_id}&page=1`);
                  }}>
                  {genre.name}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
