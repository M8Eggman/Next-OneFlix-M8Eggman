"use client";

import "./Footer.sass";
import { useEffect, useState } from "react";
import { TypeGenre } from "@/types";
import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchGenres } from "@/features/animeGenreSlice";

export default function Footer() {
  const dispatch = useAppDispatch();

  // State pour stocké les 3 genres avec le plus de d'anime
  const [topGenres, setTopGenres] = useState<TypeGenre[]>([]);

  // Récupération des genres d'anime depuis redux
  const { genres, loading, error } = useAppSelector((state) => state.genre);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, genres.length]);
  useEffect(() => {
    const sorted = [...genres].sort((a: TypeGenre, b: TypeGenre) => b.count - a.count).slice(0, 3);
    setTopGenres(sorted);
  }, [genres]);

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
