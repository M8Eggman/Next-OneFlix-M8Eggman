import "./Nav.sass";
import Link from "next/link";
// import des icônes pour la navigation de react-icons
import { BsCart2 } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";

// Composant navigation pour le projet OneFlix
// Il affiche le logo, les liens et les icônes de navigation
export default function Nav() {
  return (
    <nav className="navGlobal">
      <div className="navLogo">
        <span>OneFlix</span>
      </div>
      <ul className="navLinks">
        <Link className="navLinksNew" href="">
          Nouveau
        </Link>
        <Link className="navLinksPopular" href="">
          Populaire
        </Link>
        <Link className="navLinksCategories" href="">
          Catégories
        </Link>
      </ul>
      <div className="navIcons">
        <div className="navIconsCart">
          <BsCart2 />
        </div>
        <div className="navIconsSearch">
          <IoMdSearch />
        </div>
        <div className="navIconsBookmark">
          <IoBookmarkOutline />
        </div>
        <div className="navIconsUser">
          <FaRegUser />
        </div>
      </div>
    </nav>
  );
}
