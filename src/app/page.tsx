import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import { TypeAnimeWithPagination } from "@/types";
import { fetchAnimes } from "@/lib/fetchAnime";
import { getUIAnimes } from "@/lib/utils";
import { Suspense } from "react";
import SectionAnimeLoader from "@/components/SectionAnime/SectionAnimeLoader";
import SectionAnime from "@/components/SectionAnime/SectionAnime";
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
  const initialAnimesCarousel = await fetchAnimes({ period: "year", limit: 6, promotion: true, status: "complete" });
  // Retire les doublons et filtre les animés pour ne garder que ceux qui ont une image non par défaut (UI = unique + image filtré)
  const initialAnimesCarouselUI = getUIAnimes(initialAnimesCarousel?.data || null);

  return (
    <>
      <Carousel initialAnimes={initialAnimesCarouselUI} />
      {/* Suspense pour gérer le chargement des composants chargement ajouté manuellement pour pas overload le fetch de l'api */}
      <Suspense fallback={<SectionAnimeLoader title="Nouveautés" />}>
        <SectionAnime title="Nouveautés" recherche={{ orderBy: "start_date", sort: "desc", status: "airing" }} latence={500} />
      </Suspense>
      <Suspense fallback={<SectionAnimeLoader title="Populaires" />}>
        <SectionAnime title="Populaires" recherche={{ orderBy: "popularity", status: "complete" }} latence={1000} />
      </Suspense>
      <Suspense fallback={<SectionAnimeLoader title="Les mieux notés" />}>
        <SectionAnime title="Les mieux notés" recherche={{ orderBy: "score", sort: "desc", status: "complete" }} latence={1500} />
      </Suspense>
      <Suspense fallback={<SectionAnimeLoader title="Naruto" />}>
        <SectionAnime title="Naruto" recherche={{ query: "naruto" }} latence={2000} />
      </Suspense>
    </>
  );
}
