"use client";

import "./Footer.sass";
import { useEffect, useState } from "react";
import { TypeGenre } from "@/types";
import Link from "next/link";

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
          <p>
            One<span>Flix</span>
          </p>
        </div>
        <div className="footerNavigationLinks">
          <Link href="/nouveau">Nouveautés</Link>
          <Link href="/nouveau">Populaires</Link>

          <h4>Genres populaires</h4>
          <ul>
            {topGenres.map((genre) => (
              <li key={genre.mal_id}>
                <Link href="">{genre.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footerSocialNetworks"></div>
        <div className="footerNewsLetter"></div>
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
