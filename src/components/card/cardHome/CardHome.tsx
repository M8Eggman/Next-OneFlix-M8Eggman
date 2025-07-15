"use client";

import { useState } from "react";
import "./CardHome.sass";
import { TypeAnime } from "@/types";
import { MdShoppingCart } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/userSlice";
import { useAppSelector } from "@/store/store";

export default function CardHome({ anime }: { anime: TypeAnime }) {
  // Récupère le panier et les items achetés du redux
  const cart = useAppSelector((state) => state.user.cart);
  const ownedItems = useAppSelector((state) => state.user.ownedItems);

  // Vérifie si l'anime est déjà dans le panier ou dans les items achetés
  const isInCart = cart.find((item) => item.mal_id === anime.mal_id);
  const isInOwnedItems = ownedItems.find((item) => item.mal_id === anime.mal_id);

  // Verifie si la souris est sur la carte
  const [isHover, setIsHover] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

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
              disabled={isInCart || isInOwnedItems}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToCart(anime));
              }}>
              {isInCart ? "Déjà dans le panier" : isInOwnedItems ? "Déjà acheté" : "Ajouter au panier"}
              <MdShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
