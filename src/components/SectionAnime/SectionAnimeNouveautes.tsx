import "./SectionAnimes.sass";
import { TypeAnimeWithPagination } from "@/types";
import CardHome from "@/components/card/cardHome/CardHome";
import { getUIAnimes, wait } from "@/lib/utils";
import { fetchAnimes } from "@/lib/fetchAnime";
import SectionScrollButtons from "./SectionScrollButtons";
import { MdChevronRight } from "react-icons/md";

export default async function SectionAnimeNouveautes() {
  // Attend 500ms avant de fetch
  await wait(500);
  // Récupère les 16 animés les plus récents en cours de diffusion pour la section nouveautés
  const animes: TypeAnimeWithPagination | null = await fetchAnimes({ orderBy: "start_date", sort: "desc", status: "airing" });
  const animesUI = getUIAnimes(animes?.data || null);

  return (
    <section className="sectionAnimes">
      <h2>Nouveautés</h2>
      <SectionScrollButtons>
        {animesUI && animesUI.length > 0 ? animesUI.map((anime) => <CardHome key={anime.mal_id} anime={anime} />) : <div>Aucun animé à afficher.</div>}
        <div className="voirPlus">
          <span>Voir </span>
          <span>plus</span>
        </div>
      </SectionScrollButtons>
    </section>
  );
}
