import { TypeAnimeWithPagination } from "@/types";
import CardHome from "@/components/card/cardHome/CardHome";
import { getUIAnimes, wait } from "@/lib/utils";
import { fetchAnimes } from "@/lib/fetchAnime";

export default async function SectionAnimePopulaires() {
  // Attend 1000ms avant de fetch
  await wait(1000);
  // Récupère les 16 animés les plus populaires (status complete)
  const animes: TypeAnimeWithPagination | null = await fetchAnimes({});
  const animesUI = getUIAnimes(animes?.data || null);

  return (
    <section className="sectionAnimes">
      <h2>Populaires</h2>
      <div className="divAnimes flex">
        {animesUI && animesUI.length > 0 ? animesUI.map((anime) => <CardHome key={anime.mal_id} anime={anime} />) : <div>Aucun animé à afficher.</div>}
      </div>
    </section>
  );
}
