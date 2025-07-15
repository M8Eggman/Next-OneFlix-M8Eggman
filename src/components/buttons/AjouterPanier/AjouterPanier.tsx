import "./AjouterPanier.sass";
import { MdShoppingCart } from "react-icons/md";
import { addToCart } from "@/features/userSlice";
import { TypeAnime } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/store";

export default function AjouterPanier({ anime }: { anime: TypeAnime }) {
  // Récupère le panier et les items achetés du redux
  const cart = useAppSelector((state) => state.user.cart);
  const ownedItems = useAppSelector((state) => state.user.ownedItems);

  // Vérifie si l'anime est déjà dans le panier ou dans les items achetés
  const isInCart = cart.find((item) => item.mal_id === anime.mal_id);
  const isInOwnedItems = ownedItems.find((item) => item.mal_id === anime.mal_id);

  const dispatch = useAppDispatch();

  return (
    <button
      className="ajouterPanier"
      disabled={isInCart || isInOwnedItems}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(addToCart(anime));
      }}>
      {isInCart ? "Déjà dans le panier" : isInOwnedItems ? "Déjà acheté" : "Ajouter au panier"}
      <MdShoppingCart />
    </button>
  );
}
