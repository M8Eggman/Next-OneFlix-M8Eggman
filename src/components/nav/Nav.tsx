"use client";

import "./Nav.sass";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchGenres } from "@/features/genreSlice";
import { TypeGenre } from "@/types";
import { logout, removeFromCart } from "@/features/userSlice";
import { signOut } from "next-auth/react";
// import des icônes de react-icons
import { FiShoppingCart, FiSearch, FiBookmark, FiUser, FiChevronDown, FiTrash } from "react-icons/fi";

// Composant navigation pour le projet OneFlix
// Affiche le logo, les liens et les icônes de navigation
export default function Nav({ genres, loading, error }: { genres: TypeGenre[]; loading: boolean; error: string | null }) {
  // Récupère le chemin actuel de la page
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.user.cart);
  const { isAuthenticated } = useAppSelector((state) => state.user);

  // Etat pour gérer l'affichage des modal de catégories, authentification et panier et l'affichage de search input
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Calcule le total du panier
  const total = cart.reduce((sum, item) => sum + (item.finalPrice || 0), 0);

  return (
    <nav className="navGlobal">
      <div className="navLinksAndLogo">
        <Link className="navLogo" href="/">
          <p>
            One<span>Flix</span>
          </p>
        </Link>
        <ul className="navLinks">
          <Link className="navLinksNew" href="/animes?orderBy=start_date&status=airing&sort=desc">
            Nouveau
          </Link>
          <Link className="navLinksPopular" href="/animes?orderBy=popularity">
            Populaire
          </Link>
          <Link className="navLinksBestRated" href="/animes?orderBy=score&sort=desc">
            Les mieux notés
          </Link>
          <li
            className="navLinksCategories"
            onMouseEnter={() => {
              setShowCategoriesModal(true);
              setShowCartModal(false);
              setShowAuthModal(false);
            }}
            onMouseLeave={() => setShowCategoriesModal(false)}>
            <span className={showCategoriesModal ? "active" : ""}>
              Catégories <FiChevronDown />
            </span>
            {showCategoriesModal && (
              <div className="navCategoriesModal">
                <h3>Genres</h3>
                <ul className="navCategoriesList">
                  {loading && <li className="navCategoryLoading">Chargement des genres...</li>}
                  {(error || !genres?.length) && (
                    <>
                      <li>
                        <button className="navCategoryError cursor-pointer" onClick={() => dispatch(fetchGenres())}>
                          Réessayer
                        </button>
                      </li>
                    </>
                  )}
                  {!loading && !error && genres?.length && (
                    <>
                      {genres?.map((genre, i) => (
                        <li key={genre.mal_id} style={{ animationDelay: `${i * 20}ms` }}>
                          <Link href={`/animes?genreId=${genre.mal_id}`}>{genre.name}</Link>
                        </li>
                      ))}
                      <li className="navCategoriesSeeMore" style={{ animationDelay: `${genres?.length * 20}ms` }}>
                        <Link href="/animes">Voir +</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
      <div className="navIcons">
        <div className={`navIconsSearch${showSearchInput ? " active" : ""}`} onClick={() => setShowSearchInput(true)}>
          {showSearchInput && (
            <input
              className="navSearchInput"
              type="text"
              placeholder="Rechercher un anime..."
              onBlur={() => setShowSearchInput(false)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/animes?query=${e.currentTarget.value}`);
                }
              }}
            />
          )}
          <FiSearch />
        </div>
        {/* TODO */}
        {/* <div className="navIconsBookmarks">
          <FiBookmark />
        </div> */}
        <div
          className={`navIconsCart${showCartModal ? " active" : ""}`}
          onClick={() => {
            setShowCartModal(!showCartModal);
            setShowAuthModal(false);
            setShowCategoriesModal(false);
          }}>
          <FiShoppingCart />
          {showCartModal && (
            <div className="navCartModal">
              <h3>Mon Panier</h3>
              {isAuthenticated ? (
                cart.length === 0 ? (
                  <p>Votre panier est vide.</p>
                ) : (
                  <>
                    <ul className="navCartItems">
                      {cart.slice(0, 3).map((item) => (
                        <li key={item.mal_id} onClick={() => router.push(`/anime/${item.mal_id}`)}>
                          <img src={item.images.webp.image_url} alt={item.title} />
                          <div>
                            <p>{item.title.length > 15 ? item.title.slice(0, 15) + "..." : item.title}</p>
                            <span>{item.finalPrice?.toFixed(2)} €</span>
                          </div>
                          <button
                            className="navCartRemove"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(removeFromCart(item.mal_id));
                            }}>
                            <FiTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                    {cart.length > 3 && <p className="navCartMore">+ {cart.length - 3} autre(s)</p>}
                  </>
                )
              ) : (
                <p>Vous devez être connecté pour voir votre panier.</p>
              )}
              {isAuthenticated && cart.length > 0 && (
                <div className="navCartTotal">
                  <span>Total :</span>
                  <strong>{total === 0 ? "Gratuit" : `${total.toFixed(2)} €`}</strong>
                </div>
              )}

              {isAuthenticated && <Link href="/panier">Voir le panier</Link>}
            </div>
          )}
          {isAuthenticated && (
            <div className="navIconsCartCount">
              <span>{cart.length}</span>
            </div>
          )}
        </div>
        <div
          className={`navIconsUser${showAuthModal ? " active" : ""}`}
          onClick={() => {
            setShowAuthModal(!showAuthModal);
            setShowCartModal(false);
            setShowCategoriesModal(false);
          }}>
          <FiUser />
          {/* TODO */}
          {showAuthModal && (
            <div className="navAuthModal">
              <h3>Mon Compte</h3>
              <Link href="/auth/connexion">Connexion</Link>
              <Link href="/auth/inscription">Inscription</Link>
              <Link href="/mon-compte">Mon Compte</Link>
              <button
                onClick={() => {
                  signOut();
                  dispatch(logout());
                }}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
