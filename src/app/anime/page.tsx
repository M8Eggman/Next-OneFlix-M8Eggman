"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAnimes } from "@/lib/fetchAnime";
import { fetchAnimeParams, Period, TypeAnime } from "@/types";
import CardSearch from "@/components/card/cardSearch/CardSearch";

const AnimesPage = () => {
  const [animes, setAnimes] = useState<TypeAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pas beau mais ca fonctionne
    const fetchData = async () => {
      // Met à jour le statut de chargement
      setLoading(true);
      // Récupère les paramètres de la recherche
      const query = searchParams.get("query") || undefined;
      const genreId = searchParams.get("genreId") ? (searchParams.get("genreId")!) : undefined;
      const period = searchParams.get("period") || undefined;
      const orderBy = searchParams.get("orderBy") || "popularity";
      const sort = (searchParams.get("sort") as "asc" | "desc") || "asc";
      const status = searchParams.get("status") || undefined;
      const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
      const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 16;
      const safe = Boolean(searchParams.get("safe")) || true; // true par défaut
      // Initialise les paramètres de la recherche
      const params: Partial<fetchAnimeParams> = {};
      // Ajoute les paramètres à la recherche si ils existent
      if (query) params.query = query;
      if (genreId) params.genreId = parseInt(genreId);
      if (period) params.period = period as Period;
      if (orderBy) params.orderBy = orderBy;
      if (sort) params.sort = sort as "asc" | "desc";
      if (status) params.status = status;
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (safe) params.safe = safe;
      // Récupère les animés selon les paramètres de la recherche
      const data = await fetchAnimes(params);
      // Met à jour les animés si les données sont disponibles
      if (data) setAnimes(data);
      // Met à jour le statut de chargement
      setLoading(false);
    };

    fetchData();
  }, [searchParams]);

  if (loading) return <div>Chargement en cours...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {animes.map((anime) => (
        <CardSearch key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
};

export default AnimesPage;
