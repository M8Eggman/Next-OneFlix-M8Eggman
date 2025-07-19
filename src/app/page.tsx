import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import SectionAnime from "@/components/SectionAnime/SectionAnime";
import { fetchAnimes } from "@/lib/fetchAnime";
import { getAnimeWithPricePromo } from "@/lib/utils";
// type de fetchAnimes par défaut
// {
// query,
// genreId,
// period = "all",
// orderBy = "popularity",
// sort = "asc",
// limit = 16,
// safe = true,
// status,
// page = 1,
// promotion = false,
// }

export default async function Home() {
  // Récupère les animés
  const animesCarousel = await fetchAnimes({ limit: 6, promotion: true, status: "complete" });
  const animesNew = await fetchAnimes({ orderBy: "start_date", sort: "desc", status: "airing" });
  const animesPopular = await fetchAnimes({ orderBy: "popularity", status: "complete" });
  const animesBest = await fetchAnimes({ orderBy: "score", sort: "desc", status: "complete" });
  const animesNaruto = await fetchAnimes({ query: "naruto" });

  return (
    <>
      <Carousel animes={animesCarousel} />
      <SectionAnime title="Nouveautés" animes={animesNew} latence={500} link="/animes?orderBy=start_date&sort=desc&status=airing" />
      <SectionAnime title="Populaires" animes={animesPopular} latence={1000} link="/animes?orderBy=popularity&status=complete" />
      <SectionAnime title="Les mieux notés" animes={animesBest} latence={1500} link="/animes?orderBy=score&sort=desc&status=complete" />
      <SectionAnime title="Naruto" animes={animesNaruto} latence={2000} link="/animes?query=naruto" />
    </>
  );
}
