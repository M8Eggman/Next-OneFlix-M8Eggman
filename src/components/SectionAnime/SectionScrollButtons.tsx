"use client";

import { useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// fonction qui ajoute des boutons de scroll aux section pour garder la section en use server
export default function SectionScrollButtons({ children }: { children: React.ReactNode }) {
  // Référence au div des animés pour récupérer le scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fonction pour scroll les animés vers la gauche ou la droite de 300px
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
    <div className="divAnimesContainer">
      <span className={`arrow left`} onClick={() => scroll("left")}>
        <MdChevronLeft />
      </span>
      <div className="divAnimes" ref={scrollRef}>
        {children}
      </div>
      <span className={`arrow right`} onClick={() => scroll("right")}>
        <MdChevronRight />
      </span>
    </div>
  );
}
