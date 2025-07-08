"use client";

import "./Footer.sass";
import { useEffect, useState } from "react";
import { TypeGenre } from "@/types";
import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  const [topGenres, setTopGenres] = useState<TypeGenre[]>([]);

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime?filter=genres")
      .then((res) => res.json())
      .then((data) => {
        // Trie par count décroissant et garde les 3 premiers
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        const sorted = data.data.sort((a: TypeGenre, b: TypeGenre) => b.count - a.count).slice(0, 3);
        setTopGenres(sorted);
      });
  }, []);

  return (
    <footer>
      <div className="footerContainer">
        <div className="footerLogo">
          <h3>
            One<span>Flix</span>
          </h3>
        </div>
        <div className="footerNavigationLinks">
          <h3>Navigation</h3>
          <ul>
            <li>
              <Link href="/nouveau">Nouveautés</Link>
            </li>
            <li>
              <Link href="/populaire">Populaires</Link>
            </li>
            {topGenres.map((genre) => (
              <li key={genre.mal_id}>
                <Link href="">{genre.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/categories">Voir +</Link>
            </li>
          </ul>
        </div>
        <div className="footerSocialNetworks">
          <a href="https://github.com/M8Eggman">
            <FiGithub size={24} />
          </a>
          <a href="">
            <FiLinkedin size={24} />
          </a>
        </div>
        <div className="footerNewsLetter">
          <h3>Newsletter</h3>
          <p>Inscrivez-vous pour recevoir les dernières nouveautés et mises à jour.</p>
          <form className="footerNewsLetterForm" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Votre email" required />
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      </div>
      <div className="footerCopyright">
        <p>
          Projet à but éducatif. Réalisé par <strong>Georges Tuséki</strong> dans le cadre de la formation Front-End de Molengeek.
        </p>
        <p>
          Les visuels et références inspirés de l’univers des animes appartiennent à leurs ayants droit respectifs. Ce projet OneFlix est réalisé à des fins strictement éducatives
          et non commerciales.
        </p>
      </div>
    </footer>
  );
}
