"use client";

import "./Footer.sass";
import { useEffect, useState } from "react";
import { TypeGenre } from "@/types";
import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchGenres } from "@/features/genreSlice";

export default function Footer({ genres, loading, error }: { genres: TypeGenre[]; loading: boolean; error: string | null }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, username } = useAppSelector((state) => state.user);
  // State pour stocké les 3 genres avec le plus de d'anime
  const [topGenres, setTopGenres] = useState<TypeGenre[]>([]);

  const [email, setEmail] = useState("");
  // State pour le formulaire de newsletter pour simuler un délai d'envoi
  const [submitting, setSubmitting] = useState(false);
  // State pour afficher le message de succès de l'envoi de l'email se remet à false après 4 secondes
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Si l'email est vide, on ne fait rien
    if (!email) return;

    setSubmitting(true);
    // On simule un délai d'envoi de 1 seconde
    setTimeout(() => {
      setSubmitting(false);
      // On affiche le message de succès de l'envoi de l'email
      setSubmitted(true);
      // On vide le champ email
      setEmail("");
      // On cache le message après 4 secondes
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  useEffect(() => {
    if (genres) {
      const sorted = [...genres].sort((a: TypeGenre, b: TypeGenre) => b.count - a.count).slice(0, 3);
      setTopGenres(sorted);
    }
  }, [genres]);

  return (
    <footer>
      <div className="footerContainer">
        <div className="footerLogo">
          <h3>
            <Link href="/">
              One<span>Flix</span>
            </Link>
          </h3>
        </div>
        <div className="footerNavigationLinks">
          <h3>Navigation</h3>
          <ul>
            {isAuthenticated && (
              <>
                <li>
                  <Link href="/bibliotheque">Ma bibliothèque</Link>
                </li>
                <li>
                  <Link href={`/mon-compte/${username}`}>Mon compte</Link>
                </li>
              </>
            )}
            <li>
              <Link href="/animes?orderBy=popularity">Populaires</Link>
            </li>
            <li>
              <Link href="/animes?orderBy=start_date&sort=desc&status=airing">Nouveautés</Link>
            </li>
            <li>
              <Link href="/animes?orderBy=score&sort=desc">Les mieux notés</Link>
            </li>
            {loading && <li className="footerCategoryLoading">Chargement des genres...</li>}
            {(error || !topGenres.length) && (
              <li>
                <button className="footerCategoryError cursor-pointer" onClick={() => dispatch(fetchGenres())}>
                  Réessayer
                </button>
              </li>
            )}
            {!loading && !error && topGenres.length > 0 && (
              <>
                {topGenres.map((genre) => (
                  <li key={genre.mal_id}>
                    <Link href={`/animes?genreId=${genre.mal_id}`}>{genre.name}</Link>
                  </li>
                ))}
              </>
            )}
            <li>
              <Link href="/animes">Voir +</Link>
            </li>
          </ul>
        </div>
        <div className="footerSocialNetworks">
          <h3>Suivez-nous</h3>
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
          <form className="footerNewsLetterForm" onSubmit={handleSubmit}>
            <div className="footerNewsLetterFormInput">
              <input type="email" placeholder="Votre email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" disabled={submitting}>
                {submitting ? "Envoi..." : "S'inscrire"}
              </button>
            </div>
            {submitted && <p className="footerNewsLetterFormSubmitted">Votre email a été enregistré avec succès.</p>}
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
