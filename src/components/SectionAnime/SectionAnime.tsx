"use client";

import "./SectionAnime.sass";
import { useEffect, useRef, useState } from "react";
import { TypeAnime, TypeAnimeWithPagination } from "@/types";
import CardHome from "@/components/card/cardHome/CardHome";
import { getAnimeWithPricePromo } from "@/lib/utils";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function SectionAnime({ title, animes, link }: { title: string; animes: TypeAnimeWithPagination; link: string }) {
  const router = useRouter();

  const [animesState, setAnimesState] = useState<TypeAnime[]>([]);

  // Fait référence a la div des animés pour pouvoir scroll les animés au clic sur le bouton
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ajoute le prix et la promotion et les images filtrées et les doublons retirés aux animés
  useEffect(() => {
    const animesWithPricePromo = getAnimeWithPricePromo(animes, false, true);
    setAnimesState(animesWithPricePromo.data);
  }, [animes]);

  // Fonction pour scroll les animés vers la gauche ou la droite de 750px
  function scroll(direction: "left" | "right") {
    const element = scrollRef.current;
    if (element) {
      const scrollAmount = 750;
      if (direction === "right") {
        element.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
        element.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  }

  return (
    <section className="sectionAnimes">
      <h2>{title}</h2>
      <div className="divAnimesContainer">
        <span className={`arrow left`} onClick={() => scroll("left")}>
          <MdChevronLeft />
        </span>
        <div className="divAnimes" ref={scrollRef}>
          {animesState.map((anime) => (
            <CardHome key={anime.mal_id} anime={anime} />
          ))}
          <div className="voirPlus" onClick={() => router.push(link)}>
            <span>Voir </span>
            <span>plus</span>
          </div>
        </div>
        <span className={`arrow right`} onClick={() => scroll("right")}>
          <MdChevronRight />
        </span>
      </div>
    </section>
  );
}
