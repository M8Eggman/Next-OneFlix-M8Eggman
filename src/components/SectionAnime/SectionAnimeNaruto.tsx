import { TypeAnime } from "@/types";
import CardHome from "@/components/card/cardHome/CardHome";
import { getUIAnimes, wait } from "@/lib/utils";
import { fetchAnimes } from "@/lib/fetchAnime";

export default async function SectionAnimeNaruto() {
  // Attend 2000ms avant de fetch
  await wait(2000);
  // Récupère les 16 premiers animés naruto (status complete)
  const animes: TypeAnime[] | null = await fetchAnimes({ query: "naruto", status: "complete" });
  const animesUI = getUIAnimes(animes);

  return (
    <section className="sectionAnimes">
      <h2>Naruto</h2>
      <div className="divAnimes flex">
        {animesUI && animesUI.length > 0 ? animesUI.map((anime) => <CardHome key={anime.mal_id} anime={anime} />) : <div>Aucun animé à afficher.</div>}
      </div>
    </section>
  );
}
