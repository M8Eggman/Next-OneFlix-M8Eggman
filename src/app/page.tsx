import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import { fetchPopularAnimes } from "@/lib/fetchAnime";
import { TypeAnime } from "@/types";

export default async function Home() {
  const initialAnimes: TypeAnime[] | null = await fetchPopularAnimes("year");

  return (
    <>
      <Carousel initialAnimes={initialAnimes || null} />
    </>
  );
}
