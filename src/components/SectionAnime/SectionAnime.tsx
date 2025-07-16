"use client";

import "./SectionAnimes.sass";
import { useEffect, useRef, useState } from "react";
import { fetchAnimes } from "@/lib/fetchAnime";
import { TypeAnime } from "@/types";
import CardHome from "@/components/card/cardHome/CardHome";
import { getUIAnimes, wait } from "@/lib/utils";
import BouttonVoirPlus from "./BoutonVoirPlus";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CardHomeLoader from "../card/cardHome/CardHomeLoader";

export default function SectionAnimeClient({ title, recherche, latence }: { title: string; recherche: Record<string, string>; latence: number }) {
  const [animes, setAnimes] = useState<TypeAnime[] | null>(null);
  // Récupère le scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wait(latence).then(() => {
      fetchAnimes({ ...recherche }).then((result) => {
        const data = result?.data || [];
        const filtered = getUIAnimes(data);
        setAnimes(filtered);
      });
    });
  }, [latence, recherche]);

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
  if (!animes || animes.length === 0)
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
          {animes && animes.map((anime) => <CardHome key={anime.mal_id} anime={anime} />)}
          <BouttonVoirPlus link={`/animes?${new URLSearchParams(recherche).toString()}`} />
        </div>
        <span className={`arrow right`} onClick={() => scroll("right")}>
          <MdChevronRight />
        </span>
      </div>
    </section>
  );
}
