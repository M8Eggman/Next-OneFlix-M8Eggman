"use client";

import { fetchSingleAnime } from "@/lib/fetchAnime";
import { TypeAnime } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnimePage() {
  const { id } = useParams();

  const [anime, setAnime] = useState<TypeAnime | null>(null);
  useEffect(() => {
    fetchSingleAnime(id as string, true).then((data) => setAnime(data));
  }, [id]);

  return (
    <div>
      {anime?.title} {anime?.price} {anime?.promotion} {anime?.finalPrice} {anime?.purchasable.toString()}
    </div>
  );
}
