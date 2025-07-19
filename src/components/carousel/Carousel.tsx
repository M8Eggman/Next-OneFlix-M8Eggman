"use client";

import "./Carousel.sass";
import { useEffect, useRef, useState } from "react";
import { TypeAnime, TypeAnimeWithPagination } from "@/types";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import AjouterPanier from "../buttons/AjouterPanier/AjouterPanier";
import { useRouter } from "next/navigation";
import { getAnimeWithPricePromo } from "@/lib/utils";

export default function Carousel({ animes }: { animes: TypeAnimeWithPagination }) {
  const [animesState, setAnimesState] = useState<TypeAnime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const interval = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(0);
  const router = useRouter();
  const currentAnime = animesState[currentIndex] || null;

  // durée de l'animation
  const duration = 5000;
  // le nombre de pas de l'animation
  const step = 50;
  // le nombre de pas pour 100%
  const increment = 100 / (duration / step);

  // Récupère les animés avec le prix et la promotion et les images filtrées et les doublons retirés
  useEffect(() => {
    const animesWithPricePromo = getAnimeWithPricePromo(animes, true, true);
    setAnimesState(animesWithPricePromo.data);
    setCurrentIndex(0);
  }, [animes]);

  // Animation de la progression
  useEffect(() => {
    if (animesState.length === 0) return;

    progressRef.current = 0;

    // Si l'intervalle existe, on le nettoie
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }

    // On démarre l'intervalle
    interval.current = setInterval(() => {
      progressRef.current += increment;
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        // Si la progression est de 100% ou plus, on nettoie l'intervalle et la progression et on passe à l'animé suivant
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
          progressRef.current = 0;
        }
        next(); // On passe à l'animé suivant
      }
    }, step);

    // Nettoyage de l'intervalle et réinitialisation de la référence
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
        progressRef.current = 0;
      }
    };
  }, [currentIndex, animesState]);

  // Fonction pour passer à l'animé suivant
  function next() {
    if (animesState.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % animesState.length);
    }
  }

  // Fonction pour passer à l'animé précédent
  function prev() {
    if (animesState.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + animesState.length) % animesState.length);
    }
  }

  // Si les animés ne sont pas chargés, on affiche le loader
  if (animesState.length === 0 || !currentAnime) {
    return (
      <div className="carouselLoader">
        <div className="carouselImageLoader"></div>
        <div className="carouselLoaderText"></div>
      </div>
    );
  }
  return (
    <div className="carousel">
      <div className="carouselImage">
        <img src={currentAnime.images.webp.large_image_url} alt={currentAnime.title} />
        <img src={currentAnime.images.webp.large_image_url} alt={currentAnime.title} />
      </div>
      <div className="carouselOverlay">
        <button className="carouselOverlayBtn left" onClick={prev}>
          <MdChevronLeft />
        </button>
        <div className="carouselOverlayInfo">
          <div className="carouselOverlayInfoContent">
            <h2 onClick={() => router.push(`/anime/${currentAnime.mal_id}`)} style={currentAnime.title.length > 16 ? { fontSize: "2.5rem" } : { fontSize: "4rem" }}>
              {currentAnime.title}
            </h2>
            <p>{currentAnime.rating && <span className="carouselOverlayInfoContentRating">{currentAnime.rating}</span>}</p>
            <p>{currentAnime.synopsis.length > 250 ? currentAnime.synopsis.slice(0, 250) + "..." : currentAnime.synopsis}</p>
            <div className="carouselOverlayInfoContentGenres">
              {currentAnime.genres.map((genre) => (
                <button onClick={() => router.push(`/animes?genreId=${genre.mal_id}&page=1`)} key={genre.mal_id}>
                  {genre.name}
                </button>
              ))}
            </div>
            <div className="carouselOverlayInfoContentButtons">
              <div className="carouselOverlayInfoContentButtonsPrices">
                {currentAnime.finalPrice && currentAnime.finalPrice > 0 ? (
                  <span className="finalPrice">{currentAnime.finalPrice.toFixed(2)} €</span>
                ) : (
                  <span className="finalPrice">Gratuit</span>
                )}
                {currentAnime.promotion && currentAnime.price && <span className="oldPrice">{currentAnime.price.toFixed(2)} €</span>}
              </div>
              <AjouterPanier anime={currentAnime} />
            </div>
            <div className="carouselNavigationButton">
              {animesState.map((anime, index) => (
                <div className={`carouselNavigationButtonCircle${index === currentIndex ? " active" : ""}`} onClick={() => setCurrentIndex(index)} key={anime.mal_id}>
                  <div
                    className="carouselNavigationButtoncircleInner"
                    style={{
                      width: index === currentIndex ? `${progress}%` : "0%",
                      transition: index === currentIndex ? `width ${duration / step}ms linear` : "none",
                    }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className="carouselOverlayBtn right" onClick={next}>
        <MdChevronRight />
      </button>
    </div>
  );
}
