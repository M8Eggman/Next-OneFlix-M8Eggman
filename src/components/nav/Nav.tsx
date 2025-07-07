"use client";

import "./Nav.sass";
import Link from "next/link";
import { useEffect, useState } from "react";
// import des icônes pour la navigation de react-icons
import { FiShoppingCart, FiSearch, FiBookmark, FiUser, FiChevronDown } from "react-icons/fi";

// Composant navigation pour le projet OneFlix
// Il affiche le logo, les liens et les icônes de navigation
export default function Nav() {
  // État pour gérer l'affichage du modal des catégories
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  // fonction pour basculer l'affichage du modal des catégories
  const toggleCategoriesModal = () => {
    setShowCategoriesModal(!showCategoriesModal);
  };

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
          <Link className="navLinksCategories" href="" onMouseEnter={toggleCategoriesModal} onMouseLeave={toggleCategoriesModal}>
            Catégories <FiChevronDown />
            {showCategoriesModal && (
              <div className="navCategoriesModal">
                <h3>Genres</h3>
                <ul className="navCategoriesList">
                  <li>
                    <Link href="/categories/action">Action</Link>
                  </li>
                  <li>
                    <Link href="/categories/comedy">Comédie</Link>
                  </li>
                  <li>
                    <Link href="/categories/drama">Drame</Link>
                  </li>
                  <li>
                    <Link href="/categories/horror">Horreur</Link>
                  </li>
                  <li>
                    <Link href="/categories/scifi">Science-fiction</Link>
                  </li>
                </ul>
              </div>
            )}
          </Link>
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
