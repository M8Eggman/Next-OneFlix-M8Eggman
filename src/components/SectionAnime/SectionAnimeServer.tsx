import { fetchAnimes } from "@/lib/fetchAnime";
import { fetchAnimeParams } from "@/types";
import SectionAnime from "./SectionAnime";
import { wait } from "@/lib/utils";

// Ajoute un délai de latence pour simuler un chargement de données
export default async function SectionAnimeServer({ title, fetchParams, link, latence }: { title: string; fetchParams: fetchAnimeParams; link: string; latence: number }) {
  await wait(latence);
  const animes = await fetchAnimes(fetchParams);

  return <SectionAnime title={title} animes={animes} link={link} />;
}
