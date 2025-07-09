import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import { TypeAnime } from "@/types";
import { fetchAnimes } from "@/lib/fetchAnime";
import CardHome from "@/components/card/cardHome/CardHome";
import { getUniqueAnimes } from "@/lib/utils";
// type de fetchAnimes par défaut
// {
//   query?: string;
//   genreId?: number;
//   period = "all",
//   orderBy = "popularity",
//   sort = "desc",
//   limit = 20,
//   safe = true,
//   status = "airing",
// }
export default async function Home() {
  // Récupère les 6 animés les plus populaires de l'année pour le carousel
  const initialAnimesCarousel: TypeAnime[] | null = await fetchAnimes({ period: "year", limit: 6, sort: "asc", status: "complete" });
  // Retire les doublons de l'array initialAnimesCarousel
  const initialAnimesCarouselUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesCarousel);

  // Récupère les 20 animés les plus récents en cours de diffusion pour la section nouveautés
  const initialAnimesSectionNouveautes: TypeAnime[] | null = await fetchAnimes({ orderBy: "start_date", status: "airing" });
  const initialAnimesSectionNouveautesUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesSectionNouveautes);

  //  Récupère les 20 animés les plus populaire all time (période all par défaut)
  const initialAnimesSectionPopulaires: TypeAnime[] | null = await fetchAnimes({ status: "complete" });
  const initialAnimesSectionPopulairesUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesSectionPopulaires);

  // Récupère les 20 premiers animés naruto
  const initialAnimesSectionNaruto: TypeAnime[] | null = await fetchAnimes({ query: "naruto", status: "complete" });
  const initialAnimesSectionNarutoUnique: TypeAnime[] | null = getUniqueAnimes(initialAnimesSectionNaruto);

  return (
    <>
      <Carousel initialAnimes={initialAnimesCarousel || null} />
      <div className="SectionAnime">
        <h2>Nouveauté</h2>
        <div className="SectionAni  me__animes">
          {initialAnimesSectionNouveautesUnique?.map((anime) => (
            <CardHome key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </div>
    </>
  );
}
