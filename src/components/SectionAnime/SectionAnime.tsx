"use client";

import "./SectionAnimes.sass";
import { useEffect, useRef, useState } from "react";
import { TypeAnime, TypeAnimeWithPagination } from "@/types";
import CardHome from "@/components/card/cardHome/CardHome";
import { getAnimeWithPricePromo, wait } from "@/lib/utils";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CardHomeLoader from "../card/cardHome/CardHomeLoader";
import { useRouter } from "next/navigation";

export default function SectionAnimeClient({ title, animes, latence, link }: { title: string; animes: TypeAnimeWithPagination; latence: number; link: string }) {
  const [animesState, setAnimesState] = useState<TypeAnime[]>([]);
  const router = useRouter();
  // Récupère le scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wait(latence).then(() => {
      const animesWithPricePromo = getAnimeWithPricePromo(animes, false, true);
      setAnimesState(animesWithPricePromo.data);
    });
  }, [latence, animes]);

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

  // Si les animés ne sont pas chargés, on affiche le loader
  if (animesState.length === 0)
    return (
      <section className="sectionAnimes">
        <h2>{title}</h2>
        <div className="divAnimesContainer">
          <div className="divAnimes">
            {Array.from({ length: 16 }).map((_, index) => (
              <CardHomeLoader key={index} />
            ))}
          </div>
        </div>
      </section>
    );

  return (
    <section className="sectionAnimes">
      <h2>{title}</h2>
      <div className="divAnimesContainer">
        <span className={`arrow left`} onClick={() => scroll("left")}>
          <MdChevronLeft />
        </span>
        <div className="divAnimes" ref={scrollRef}>
          {animesState.map((anime) => <CardHome key={anime.mal_id} anime={anime} />)}
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
