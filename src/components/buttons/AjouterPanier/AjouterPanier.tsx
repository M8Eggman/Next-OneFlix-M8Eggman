import "./AjouterPanier.sass";
import { MdShoppingCart } from "react-icons/md";
import { addToCart, removeFromCart } from "@/features/userSlice";
import { TypeAnime } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";

export default function AjouterPanier({ anime }: { anime: TypeAnime }) {
  // Récupère le panier et les items achetés du redux
  const cart = useAppSelector((state) => state.user.cart);
  const ownedItems = useAppSelector((state) => state.user.ownedItems);

  // Vérifie si l'anime est déjà dans le panier ou dans les items achetés
  const isInCart = cart.find((item) => item.mal_id === anime.mal_id);
  const isInOwnedItems = ownedItems.find((item) => item.mal_id === anime.mal_id);

  const { isAuthenticated } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <button
      className="ajouterPanier"
      disabled={isInOwnedItems || !anime.price}
      onClick={(e) => {
        e.stopPropagation();
        if (isInCart && isAuthenticated) {
          dispatch(removeFromCart(anime.mal_id));
        } else if (!isInCart && isAuthenticated) {
          dispatch(addToCart(anime));
        }
        if (!isAuthenticated) router.push("/auth/connexion");
      }}>
      {isInCart ? "Retirer du panier" : isInOwnedItems ? "Déjà acheté" : isAuthenticated ? "Ajouter au panier" : "Connectez-vous"}
      <MdShoppingCart />
    </button>
  );
}
