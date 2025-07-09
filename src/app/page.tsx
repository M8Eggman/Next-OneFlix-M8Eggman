import "./Home.sass";
import Carousel from "@/components/carousel/Carousel";
import { TypeAnime } from "@/types";
import { fetchAnimes } from "@/lib/fetchAnime";

export default async function Home() {
  const initialAnimes: TypeAnime[] | null = await fetchAnimes({ period: "year", limit: 6, orderBy: "popularity", sort: "asc", status: "complete" });

  return (
    <>
      <Carousel initialAnimes={initialAnimes || null} />
    </>
  );
}
