"use client";

import { useState } from "react";
import "./CardHome.sass";
import { TypeAnime } from "@/types";
import router from "next/router";
import { MdShoppingCart } from "react-icons/md";

export default function CardHome({ anime }: { anime: TypeAnime }) {
  const [isHover, setIsHover] = useState(false);

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
          <h3>{anime.title}</h3>
          <p>{anime.synopsis ? (anime.synopsis?.length > 250 ? anime.synopsis?.slice(0, 250) + "..." : anime.synopsis) : "Aucune description disponible"}</p>
          <div className="cardHomeHoverInfosPrices">
            <div className="cardHomeHoverInfosPricesPromotion">
              {anime.promotion ? <p style={{ textDecoration: "line-through" }}>{anime.price} €</p> : <p>{anime.price} €</p>}
              {anime.promotion && anime.price && <p>{Math.round(anime.price * (1 - anime.promotion)) - 0.01} €</p>}
              {/* Si l'anime a un prix null ca veut dire qu'il n'est pas encore en vente */}
              {!anime.price && <p>N'est pas encore sorti</p>}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Ajouter au panier"); // TODO: Ajouter au panier
              }}>
              Ajouter au panier <MdShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
