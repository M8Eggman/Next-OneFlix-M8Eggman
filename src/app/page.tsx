import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import { TypeAnime } from "@/types";
import { fetchAnimes } from "@/lib/fetchAnime";
import CardHome from "@/components/card/cardHome/CardHome";
import { filterAnimeImage, getUIAnimes, getUniqueAnimes } from "@/lib/utils";
import SectionAnimeNouveautes from "@/components/SectionAnime/SectionAnimeNouveautes";
import SectionAnimePopulaires from "@/components/SectionAnime/SectionAnimePopulaires";
import SectionAnimeNaruto from "@/components/SectionAnime/SectionAnimeNaruto";
import { Suspense } from "react";
// type de fetchAnimes par défaut
// {
//   query?: string;
//   genreId?: number;
//   period = "all",
//   orderBy = "popularity",
//   sort = "asc",
//   limit = 16,
//   safe = true,
//   status = "complete",
//   page = 1,
//   promotion = false,
// }
export default async function Home() {
  // Récupère les 6 animés les plus populaires de l'année pour le carousel
  const initialAnimesCarousel: TypeAnime[] | null = await fetchAnimes({ period: "year", limit: 6, promotion: true })

  // Retire les doublons et filtre les animés pour ne garder que ceux qui ont une image non par défaut (UI = unique + image filtré)
  const initialAnimesCarouselUI = getUIAnimes(initialAnimesCarousel);


  return (
    <>
      <Carousel initialAnimes={initialAnimesCarouselUI || null} />
      {/* Suspense pour gérer le chargement des composants chargement ajouté manuellement pour pas overload le fetch de l'api */}
      <Suspense fallback={<p>Chargement des nouveautés...</p>}>
        <SectionAnimeNouveautes />
      </Suspense>
      <Suspense fallback={<p>Chargement des populaires...</p>}>
        <SectionAnimePopulaires />
      </Suspense>
      <Suspense fallback={<p>Chargement de Naruto...</p>}>
        <SectionAnimeNaruto />
      </Suspense>
    </>
  );
}
