import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import SectionAnime from "@/components/SectionAnime/SectionAnime";
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
  return (
    <>
      <Carousel/>
      <SectionAnime title="Nouveautés" recherche={{ orderBy: "start_date", sort: "desc", status: "airing" }} latence={500} />
      <SectionAnime title="Populaires" recherche={{ orderBy: "popularity", status: "complete" }} latence={1000} />
      <SectionAnime title="Les mieux notés" recherche={{ orderBy: "score", sort: "desc", status: "complete" }} latence={1500} />
      <SectionAnime title="Naruto" recherche={{ query: "naruto" }} latence={2000} />
    </>
  );
}
