"use client";

import { useEffect, useState } from "react";
import { TypeAnime, TypeAnimeWithPagination } from "@/types";
import "./Carousel.sass";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import AjouterPanier from "../buttons/AjouterPanier/AjouterPanier";
import { fetchAnimes } from "@/lib/fetchAnime";
import { getUIAnimes } from "@/lib/utils";

export default function Carousel({ initialAnimes }: { initialAnimes: TypeAnime[] | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentAnime = initialAnimes ? initialAnimes[currentIndex] : null;

  if (!currentAnime || !initialAnimes) {
    return (
      <div className="carouselLoader">
        <div className="carouselImageLoader"></div>
        <div className="carouselLoaderText">
        </div>
      </div>
    );
  }
  // durée de l'animation
  const duration = 5000;
  // le nombre de pas de l'animation
  const step = 50;
  // le nombre de pas pour 100%
  const increment = 100 / (duration / step);

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

  function next() {
    setCurrentIndex((prev) => (prev + 1) % (initialAnimes?.length || 0));
  }

  function prev() {
    setCurrentIndex((prev) => (prev - 1 + (initialAnimes?.length || 0)) % (initialAnimes?.length || 0));
  }

  return (
    <div className="carousel">
      <div className="carouselImage">
        <img src={currentAnime.images.webp.large_image_url} alt={currentAnime.title} />
        <img src={currentAnime.images.webp.large_image_url} alt={currentAnime.title} />
      </div>
      <div className="carouselOverlay">
        <button onClick={prev}>
          <MdChevronLeft />
        </button>
        <div className="carouselOverlayInfo">
          <div className="carouselOverlayInfoContent">
            <h2 style={currentAnime.title.length > 16 ? { fontSize: "2.5rem" } : { fontSize: "4rem" }}>{currentAnime.title}</h2>
            <p>{currentAnime.synopsis?.length > 250 ? currentAnime.synopsis?.slice(0, 250) + "..." : currentAnime.synopsis}</p>
            <div className="carouselOverlayInfoContentGenres">
              {currentAnime.genres.map((genre) => (
                <button key={genre.mal_id}>{genre.name}</button>
              ))}
            </div>
            <div className="carouselOverlayInfoContentButtons">
              <div className="carouselOverlayInfoContentButtonsPrices">
                {currentAnime.finalPrice && currentAnime.finalPrice > 0 ? (
                  <span className="finalPrice">{currentAnime.finalPrice} €</span>
                ) : (
                  <span className="finalPrice">Gratuit</span>
                )}
                {currentAnime.promotion && currentAnime.price && <span className="oldPrice">{currentAnime.price} €</span>}
              </div>
              <AjouterPanier anime={currentAnime} />
            </div>
            <div className="carouselNavigationButton">
              {initialAnimes.map((anime, index) => (
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
