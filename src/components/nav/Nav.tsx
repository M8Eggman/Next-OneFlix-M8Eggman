"use client";

import { TypeGenre } from "@/types";
import "./Nav.sass";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiSearch, FiBookmark, FiUser, FiChevronDown } from "react-icons/fi";
import { usePathname } from "next/navigation";

// Composant navigation pour le projet OneFlix
// Affiche le logo, les liens et les icônes de navigation
export default function Nav() {
  // Récupère le chemin actuel de la page
  const pathname = usePathname();

  // Etat pour stocker les genres d'anime récupérés depuis l'API
  const [genres, setGenres] = useState<TypeGenre[]>([]);
  // Etat pour gérer l'affichage des modal de catégories, authentification et panier
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  // Récupération des genres d'anime depuis l'API
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime?filter=genres")
      .then((res) => res.json())
      .then((data) => setGenres(data.data || []));
  }, []);

  console.log(genres);

  return (
    <nav className="navGlobal">
      <div className="navLinksAndLogo">
        <Link className="navLogo" href="/">
          <p>
            One<span>Flix</span>
          </p>
        </Link>
        <ul className="navLinks">
          <Link className={`navLinksNew${pathname === "/nouveau" ? " active" : ""}`} href="/nouveau">
            Nouveau
          </Link>
          <Link className={`navLinksPopular${pathname === "/populaire" ? " active" : ""}`} href="/populaire">
            Populaire
          </Link>
          <li className="navLinksCategories" onMouseEnter={() => setShowCategoriesModal(true)} onMouseLeave={() => setShowCategoriesModal(false)}>
            <span className={showCategoriesModal ? "active" : ""}>
              Catégories <FiChevronDown />
            </span>
            {showCategoriesModal && (
              <div className="navCategoriesModal">
                <h3>Genres</h3>
                <ul className="navCategoriesList">
                  {genres.map((genre, i) => (
                    <li key={genre.mal_id} style={{ animationDelay: `${i * 20}ms` }}>
                      <Link href="">{genre.name}</Link>
                    </li>
                  ))}
                  <li className="navCategoriesSeeMore" style={{ animationDelay: `${genres.length * 20}ms` }}>
                    <Link href="/categories">Voir +</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
      <div className="navIcons">
        <div className="navIconsSearch">
          <FiSearch />
        </div>
        <div className="navIconsBookmark">
          <FiBookmark />
        </div>
        <div
          className="navIconsCart"
          onClick={() => {
            setShowCartModal(!showCartModal);
            setShowAuthModal(false);
          }}>
          <FiShoppingCart />
          {/* temporaire !!! */}
          {showCartModal && (
            <div className="navCartModal">
              <h3>Mon Panier</h3>
              <p>Votre panier est vide.</p>
              <Link href="/panier">Voir le panier</Link>
            </div>
          )}
        </div>
        <div
          className="navIconsUser"
          onClick={() => {
            setShowAuthModal(!showAuthModal);
            setShowCartModal(false);
          }}>
          <FiUser />
          {/* temporaire !!! */}
          {showAuthModal && (
            <div className="navAuthModal">
              <h3>Mon Compte</h3>
              <ul>
                <li>
                  <Link href="/connexion">Connexion</Link>
                </li>
                <li>
                  <Link href="/inscription">Inscription</Link>
                </li>
                <li>
                  <Link href="/mon-compte">Mon Compte</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
