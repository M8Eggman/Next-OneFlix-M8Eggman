import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import { TypeAnime } from "@/types";
import { fetchAnimes } from "@/lib/fetchAnime";
import CardHome from "@/components/card/cardHome/CardHome";
import { filterAnimeImage, getUniqueAnimes } from "@/lib/utils";
// type de fetchAnimes par défaut
// {
//   query?: string;
//   genreId?: number;
//   period = "all",
//   orderBy = "popularity",
//   sort = "asc",
//   limit = 16,
//   safe = true,
//   status = "airing",
//   page = 1,
//   promotion = false,
// }
export default async function Home() {
  // Récupère les 6 animés les plus populaires de l'année pour le carousel
  const initialAnimesCarousel: TypeAnime[] | null = await fetchAnimes({ period: "year", limit: 6, status: "complete", promotion: true });
  // Récupère les 16 animés les plus récents en cours de diffusion pour la section nouveautés
  const initialAnimesSectionNouveautes: TypeAnime[] | null = await fetchAnimes({ orderBy: "start_date", sort: "desc", status: "airing" });
  //  Récupère les 16 animés les plus populaire all time (période all par défaut)
  const initialAnimesSectionPopulaires: TypeAnime[] | null = await fetchAnimes({ status: "complete" });
  // Récupère les 16 premiers animés naruto
  const initialAnimesSectionNaruto: TypeAnime[] | null = await fetchAnimes({ query: "naruto", status: "complete" });

  // Retire les doublons de l'array
  const initialAnimesCarouselUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesCarousel);
  const initialAnimesSectionNouveautesUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesSectionNouveautes);
  const initialAnimesSectionPopulairesUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesSectionPopulaires);
  const initialAnimesSectionNarutoUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesSectionNaruto);

  // Filtre les animés pour ne garder que ceux qui ont une image non par défaut (UI = unique + image filtré)
  const initialAnimesCarouselUI: TypeAnime[] | null = filterAnimeImage(initialAnimesCarouselUnique);
  const initialAnimesSectionNouveautesUI: TypeAnime[] | null = filterAnimeImage(initialAnimesSectionNouveautesUnique);
  const initialAnimesSectionPopulairesUI: TypeAnime[] | null = filterAnimeImage(initialAnimesSectionPopulairesUnique);
  const initialAnimesSectionNarutoUI: TypeAnime[] | null = filterAnimeImage(initialAnimesSectionNarutoUnique);

  return (
    <>
      <Carousel initialAnimes={initialAnimesCarouselUI || null} />
      <section className="sectionAnimeNouveautes">
        <h2>Nouveautés</h2>
        <div className="divAnimeNouveautes flex">
          {initialAnimesSectionNouveautesUI?.map((anime) => (
            <CardHome key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
      <section className="sectionAnimePopulaires">
        <h2>Populaires</h2>
        <div className="divAnimePopulaires flex">
          {initialAnimesSectionPopulairesUI?.map((anime) => (
            <CardHome key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
      <section className="sectionAnimeNaruto">
        <h2>Naruto</h2>
        <div className="divAnimeNaruto flex">
          {initialAnimesSectionNarutoUI?.map((anime) => (
            <CardHome key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
    </>
  );
}
