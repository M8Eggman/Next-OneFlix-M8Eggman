"use client";

import { TypeGenre } from "@/types";
import "./Nav.sass";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiSearch, FiBookmark, FiUser, FiChevronDown } from "react-icons/fi";

// Composant navigation pour le projet OneFlix
// Il affiche le logo, les liens et les icônes de navigation
export default function Nav() {
  // État pour stocker les genres d'anime récupérés depuis l'API
  const [genres, setGenres] = useState<TypeGenre[]>([]);
  // État pour gérer l'affichage du modal des catégories
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Récupération des genres d'anime depuis l'API
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime?filter=genres")
      .then((res) => res.json())
      .then((data) => setGenres(data.data || []));
  }, []);

  return (
    <nav className="navGlobal">
      <div className="navLinksAndLogo">
        <Link className="navLogo" href="/">
          <p>
            One<span>Flix</span>
          </p>
        </Link>
        <ul className="navLinks">
          <Link className="navLinksNew" href="">
            Nouveau
          </Link>
          <Link className="navLinksPopular" href="">
            Populaire
          </Link>
          <li
            className="navLinksCategories"
            onMouseEnter={() => setShowCategoriesModal(true)}
            onMouseLeave={() => {
              setShowCategoriesModal(false);
              setShowAllCategories(false);
            }}>
            <Link href="" className={showCategoriesModal ? "active" : ""}>
              Catégories <FiChevronDown />
            </Link>
            {showCategoriesModal && (
              <div className="navCategoriesModal">
                <h3>Genres</h3>
                <ul className="navCategoriesList">
                  {(showAllCategories ? genres : genres.slice(0, 20)).map((genre) => (
                    <li key={genre.mal_id}>
                      <Link href="">{genre.name}</Link>
                    </li>
                  ))}
                  {!showAllCategories && genres.length > 19 && (
                    <a className="navAllCategoriesBtn" onClick={() => setShowAllCategories(true)}>
                      Voir +
                    </a>
                  )}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
      <div className="navIcons">
        <div className="navIconsCart">
          <FiShoppingCart />
        </div>
        <div className="navIconsSearch">
          <FiSearch />
        </div>
        <div className="navIconsBookmark">
          <FiBookmark />
        </div>
        <div className="navIconsUser">
          <FiUser />
        </div>
      </div>
    </nav>
  );
}
