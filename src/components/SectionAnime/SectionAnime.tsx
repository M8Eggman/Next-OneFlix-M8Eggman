import "./SectionAnimes.sass";
import { fetchAnimeParams, TypeAnimeWithPagination } from "@/types";
import CardHome from "@/components/card/cardHome/CardHome";
import { getUIAnimes, wait } from "@/lib/utils";
import { fetchAnimes } from "@/lib/fetchAnime";
import SectionScrollButtons from "./SectionScrollButtons";
import BouttonVoirPlus from "./BoutonVoirPlus";

export default async function SectionAnime({ title, recherche, latence }: { title: string; recherche: Partial<fetchAnimeParams>; latence: number }) {
  // Attend latence ms avant de fetch
  await wait(latence);
  // Récupère les animés selon les paramètres de recherche
  const animes: TypeAnimeWithPagination | null = await fetchAnimes(recherche);
  const animesUI = getUIAnimes(animes?.data || null);

  return (
    <section className="sectionAnimes">
      <h2>{title}</h2>
      <SectionScrollButtons>
        {animesUI && animesUI.length > 0 ? animesUI.map((anime) => <CardHome key={anime.mal_id} anime={anime} />) : <div>Aucun animé à afficher.</div>}
        <BouttonVoirPlus link={`/animes?${new URLSearchParams(recherche as Record<string, string>).toString()}`} />
      </SectionScrollButtons>
    </section>
  );
}
