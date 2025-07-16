"use client";

import { useEffect, useState } from "react";
import { TypeAnime } from "@/types";
import "./Carousel.sass";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import AjouterPanier from "../buttons/AjouterPanier/AjouterPanier";
import { useRouter } from "next/navigation";
import { fetchAnimes } from "@/lib/fetchAnime";
import { getUIAnimes } from "@/lib/utils";

export default function Carousel() {
  const [animes, setAnimes] = useState<TypeAnime[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // durée de l'animation
  const duration = 5000;
  // le nombre de pas de l'animation
  const step = 50;
  // le nombre de pas pour 100%
  const increment = 100 / (duration / step);

  // Récupère les animés
  useEffect(() => {
    fetchAnimes({ period: "year", limit: 6, promotion: true, status: "complete" }).then((data) => {
      const filtered = getUIAnimes(data?.data || null);
      setAnimes(filtered || null);
      setCurrentIndex(0);
    });
  }, []);

  // Animation de la progression
  useEffect(() => {
    setProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += increment;

      if (progress >= 100) {
        clearInterval(interval);
        setProgress(100);
        next();
      } else {
        setProgress(progress);
      }
    }, step);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Fonction pour passer à l'animé suivant
  function next() {
    if (animes) {
      setCurrentIndex((prev) => (prev + 1) % animes?.length);
    }
  }

  // Fonction pour passer à l'animé précédent
  function prev() {
    if (animes) {
      setCurrentIndex((prev) => (prev - 1 + animes?.length) % animes?.length);
    }
  }

  // Si les animés ne sont pas chargés, on affiche le loader
  if (!animes || animes.length === 0 || !animes[currentIndex]) {
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
        <img src={animes[currentIndex]?.images.webp.large_image_url} alt={animes[currentIndex]?.title} />
        <img src={animes[currentIndex]?.images.webp.large_image_url} alt={animes[currentIndex]?.title} />
      </div>
      <div className="carouselOverlay">
        <button onClick={prev}>
          <MdChevronLeft />
        </button>
        <div className="carouselOverlayInfo">
          <div className="carouselOverlayInfoContent">
            <h2 onClick={() => router.push(`/anime/${animes[currentIndex].mal_id}`)} style={animes[currentIndex].title.length > 16 ? { fontSize: "2.5rem" } : { fontSize: "4rem" }}>
              {animes[currentIndex].title}
            </h2>
            <p>{animes[currentIndex].synopsis?.length > 250 ? animes[currentIndex].synopsis?.slice(0, 250) + "..." : animes[currentIndex].synopsis}</p>
            <div className="carouselOverlayInfoContentGenres">
              {animes[currentIndex].genres.map((genre) => (
                <button onClick={() => router.push(`/animes?genreId=${genre.mal_id}&page=1`)} key={genre.mal_id}>
                  {genre.name}
                </button>
              ))}
            </div>
            <div className="carouselOverlayInfoContentButtons">
              <div className="carouselOverlayInfoContentButtonsPrices">
                {animes[currentIndex].finalPrice && animes[currentIndex].finalPrice > 0 ? (
                  <span className="finalPrice">{animes[currentIndex].finalPrice.toFixed(2)} €</span>
                ) : (
                  <span className="finalPrice">Gratuit</span>
                )}
                {animes[currentIndex].promotion && animes[currentIndex].price && <span className="oldPrice">{animes[currentIndex].price.toFixed(2)} €</span>}
              </div>
              <AjouterPanier anime={animes[currentIndex]} />
            </div>
            <div className="carouselNavigationButton">
              {animes.map((anime, index) => (
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
      <button className="carouselBtnRight" onClick={next}>
        <MdChevronRight />
      </button>
    </div>
  );
}
