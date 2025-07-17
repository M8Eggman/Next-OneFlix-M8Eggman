"use client";

import "./Panier.sass";
import { removeFromCart } from "@/features/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiTrash } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/store";

const PanierPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cart = useAppSelector((state) => state.user.cart);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const freeItemsWithPromotion = cart.filter((item) => item.isFreeWithPromotion);
  const freeItems = cart.filter((item) => item.isFree);
  const paidItems = cart.filter((item) => !item.isFreeWithPromotion);
  const total = paidItems.reduce((sum, item) => sum + (!item.isFreeWithPromotion ? item.finalPrice || 0 : 0), 0);

  if (cart.length === 0) {
    return <p className="panierMessage">Votre panier est vide.</p>;
  }

  if (!isAuthenticated) {
    return <p className="panierMessage">Vous devez être connecté pour accéder à votre panier.</p>;
  }

  return (
    <section className="panierPage">
      <h1>Mon Panier</h1>
      {freeItemsWithPromotion.length > 0 ? (
        <div className="panierContainer">
          <h2>Promotion (4+1 Gratuit) ne marche qu'une fois par commande.</h2>
          <ul>
            {freeItemsWithPromotion.map((item) => (
              <li key={item.mal_id} onClick={() => router.push(`/anime/${item.mal_id}`)}>
                <img src={item.images.webp.image_url} alt={item.title} width={60} height={90} />
                <div>
                  <p>{item.title}</p>
                  <div className="navCartItemPrices">
                    <span className="gratuit">Gratuit</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromCart(item.mal_id));
                  }}>
                  <FiTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="panierContainer">
          <h2>Si vous voulez profiter de la promotion, ajoutez 5 items à votre panier.</h2>
        </div>
      )}
      {freeItems.length > 0 && (
        <div className="panierContainer">
          <h2>Contenu Gratuit</h2>
          <ul>
            {freeItems.map((item) => (
              <li key={item.mal_id} onClick={() => router.push(`/anime/${item.mal_id}`)}>
                <img src={item.images.webp.image_url} alt={item.title} width={60} height={90} />
                <div>
                  <p>{item.title}</p>
                  <div className="navCartItemPrices">
                    <span className="gratuit">Gratuit</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromCart(item.mal_id));
                  }}>
                  <FiTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {paidItems.length > 0 && (
        <div className="panierContainer">
          <h2>Contenu Payant</h2>
          <ul>
            {paidItems.map((item) => (
              <li key={item.mal_id} onClick={() => router.push(`/anime/${item.mal_id}`)}>
                <img src={item.images.webp.image_url} alt={item.title} width={60} height={90} />
                <div>
                  <p>{item.title}</p>
                  <div className="navCartItemPrices">
                    {item.finalPrice && item.finalPrice > 0 ? <span className="finalPrice">{item.finalPrice.toFixed(2)} €</span> : <span className="finalPrice">Gratuit</span>}
                    {item.promotion && item.price && <span className="oldPrice">{item.price.toFixed(2)} €</span>}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromCart(item.mal_id));
                  }}>
                  <FiTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="panierTotal">
        <span>Total :</span>
        <strong>{total === 0 ? "Gratuit" : `${total.toFixed(2)} €`}</strong>
      </div>
      <div className="panierActions">
        <Link href="/paiement/payer-anime" className="btnPayer">
          Procéder au paiement
        </Link>
        <Link href="/" className="btnRetour">
          Continuer vos achats
        </Link>
      </div>
    </section>
  );
};

export default PanierPage;
