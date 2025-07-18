"use client";

import "./Nav.sass";
import "./NavUserAuth.sass";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchGenres } from "@/features/genreSlice";
import { TypeGenre } from "@/types";
import { logout, removeFromCart } from "@/features/userSlice";
import { signOut } from "next-auth/react";
// import des icônes de react-icons
import { FiShoppingCart, FiSearch, FiBookmark, FiUser, FiChevronDown, FiTrash, FiMenu } from "react-icons/fi";

export default function Nav({ genres, loading, error }: { genres: TypeGenre[]; loading: boolean; error: string | null }) {
  // Récupère le chemin actuel de la page
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.user.cart);
  const user = useAppSelector((state) => state.user);
  const { isAuthenticated, credit, image } = useAppSelector((state) => state.user);

  // Etat pour gérer l'affichage des modal de catégories, authentification et panier et l'affichage de search input
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showMobileLinks, setShowMobileLinks] = useState(false);
  const [showCategoriesModalMobile, setShowCategoriesModalMobile] = useState(false);

  // Récupère les items gratuits
  const freeItems = cart.filter((item) => item.isFreeWithPromotion);
  // Récupère les items payants
  const paidItems = cart.filter((item) => !item.isFreeWithPromotion);

  // Calcule le total du panier
  const total = cart.reduce((sum, item) => sum + (!item.isFreeWithPromotion ? item.finalPrice || 0 : 0), 0);

  return (
    <nav className="navGlobal">
      <div className="navLinksAndLogo">
        <div className="navMobileLinks" onClick={() => setShowMobileLinks(!showMobileLinks)}>
          <FiMenu />
          <ul className={`navMobileLinksContent${showMobileLinks ? " active" : ""}`}>
            <Link href="/animes?orderBy=start_date&status=airing&sort=desc">Nouveau</Link>
            <Link href="/animes?orderBy=popularity">Populaire</Link>
            <Link href="/animes?orderBy=score&sort=desc">Les mieux notés</Link>
            <a
              onClick={(e) => {
                e.stopPropagation();
                setShowCategoriesModalMobile(!showCategoriesModalMobile);
              }}>
              <span>Catégories</span>
              <FiChevronDown />
            </a>
            {showCategoriesModalMobile && (
              <div className="navMobileLinksCategoriesModal">
                <ul className="navMobileLinksCategoriesList">
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
                      <li className="navMobileLinksCategoriesSeeMore" style={{ animationDelay: `${genres?.length * 20}ms` }}>
                        <Link href="/animes">Voir +</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
            <Link href="/animes" className="navMobileLinksSeeMore">
              Voir Tout
            </Link>
          </ul>
        </div>
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
            <div className="navModalBackground">
              <div className="navCartModal">
                <h3>Mon Panier</h3>
                {isAuthenticated ? (
                  cart.length === 0 ? (
                    <p>Votre panier est vide.</p>
                  ) : (
                    <>
                      <ul className="navCartItems">
                        {freeItems.map((item) => (
                          <li key={item.mal_id} onClick={() => router.push(`/anime/${item.mal_id}`)}>
                            <img src={item.images.webp.image_url} alt={item.title} />
                            <div>
                              <p>{item.title.length > 12 ? item.title.slice(0, 12) + "..." : item.title}</p>
                              <div className="navCartItemPrices">
                                <span className="gratuit">Gratuit</span>
                              </div>
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
                        {paidItems.map((item) => (
                          <li key={item.mal_id} onClick={() => router.push(`/anime/${item.mal_id}`)}>
                            <img src={item.images.webp.image_url} alt={item.title} />
                            <div>
                              <p>{item.title.length > 12 ? item.title.slice(0, 12) + "..." : item.title}</p>
                              <div className="navCartItemPrices">
                                {item.finalPrice && item.finalPrice > 0 ? (
                                  <span className="finalPrice">{item.finalPrice.toFixed(2)} €</span>
                                ) : (
                                  <span className="finalPrice">Gratuit</span>
                                )}
                                {item.promotion && item.price && <span className="oldPrice">{item.price.toFixed(2)} €</span>}
                              </div>
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
                {isAuthenticated && cart.length > 0 && <Link href="/paiement/payer-anime">Acheter</Link>}
              </div>
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

          {showAuthModal && (
            <div className="navModalBackground">
              <div className="navAuthModal">
                <h3>Mon Compte</h3>
                {!isAuthenticated && (
                  <>
                    <Link href="/auth/connexion">Connexion</Link>
                    <Link href="/auth/inscription">Inscription</Link>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <Link href="/mon-compte">Mon Compte {image && <img src={image} alt="" />}</Link>
                    <Link href="/bibliotheque">Bibliothèque</Link>
                    <Link href="/paiement/ajouter-credit">Ajouter du crédit</Link>
                    <p>Crédit : {credit.toFixed(2)} €</p>
                    <button
                      onClick={async () => {
                        await signOut({ redirect: false });
                        dispatch(logout());
                        router.push("/");
                      }}>
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
