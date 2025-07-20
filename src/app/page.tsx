import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import SectionAnimeLoader from "@/components/SectionAnime/SectionAnimeLoader";
import SectionAnimeServer from "@/components/SectionAnime/SectionAnimeServer";
import { fetchAnimes } from "@/lib/fetchAnime";
import { Suspense } from "react";
// paramètre de fetchAnimes par défaut
// query,
// genreId,
// period = "all",
// orderBy = "popularity",
// sort = "asc",
// limit = 16,
// safe = true,
// status = "complete",
// page = 1,
// promotion = false,

export default async function Home() {
  // Récupère les animés sans prix et la promotion pour profiter du cache en use server
  const animesCarousel = await fetchAnimes({ limit: 6, period: "year" });

  return (
    <>
      <Carousel animes={animesCarousel} />
      {/* Suspense pour simuler un chargement de données avec un délai  */}
      <Suspense fallback={<SectionAnimeLoader title="Nouveautés" />}>
        <SectionAnimeServer
          title="Nouveautés"
          fetchParams={{ orderBy: "start_date", sort: "desc", status: "airing" }}
          link="/animes?orderBy=start_date&sort=desc&status=airing"
          latence={500}
        />
      </Suspense>
      <Suspense fallback={<SectionAnimeLoader title="Populaires" />}>
        <SectionAnimeServer title="Populaires" fetchParams={{}} link="/animes?orderBy=popularity&status=complete" latence={1000} />
      </Suspense>
      <Suspense fallback={<SectionAnimeLoader title="Les mieux notés" />}>
        <SectionAnimeServer
          title="Les mieux notés"
          fetchParams={{ orderBy: "score", sort: "desc", status: "complete" }}
          link="/animes?orderBy=score&sort=desc&status=complete"
          latence={1500}
        />
      </Suspense>
      <Suspense fallback={<SectionAnimeLoader title="Naruto" />}>
        <SectionAnimeServer title="Naruto" fetchParams={{ query: "naruto" }} link="/animes?query=naruto" latence={2000} />
      </Suspense>
    </>
  );
}
