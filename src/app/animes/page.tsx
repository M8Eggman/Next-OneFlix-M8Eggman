"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchAnimes } from "@/lib/fetchAnime";
import { fetchAnimeParams, Period, TypeAnimeWithPagination } from "@/types";
import { fetchGenres } from "@/features/genreSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getPeriodUrl } from "@/lib/utils";
import CardHome from "@/components/card/cardHome/CardHome";

export default function AnimesPage() {
  // Récupère les paramètres de l'url
  const searchParams = useSearchParams();

  const router = useRouter();
  const dispatch = useAppDispatch();

  // Récupère les genres depuis le store
  const { genres } = useAppSelector((state) => state.genre);

  const [animes, setAnimes] = useState<TypeAnimeWithPagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Paramètres de la recherche et initialisation à partir de l'url si il y a des paramètres sinon on les initialise à leur valeur par défaut
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [sort, setSort] = useState<"asc" | "desc">((searchParams.get("sort") as "asc" | "desc") || "asc");
  const [genreId, setGenreId] = useState(searchParams.get("genreId") || "");
  const [period, setPeriod] = useState<Period>((searchParams.get("period") as Period) || "all");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || "popularity");
  const [status, setStatus] = useState<string | null>(searchParams.get("status") || null);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || "20")); // invariant : 20
  const [safe, setSafe] = useState(Boolean(searchParams.get("safe")) || true); // invariant : true

  // Chargement des genres depuis le store si il n'y en a pas sinon les récupère depuis l'api
  useEffect(() => {
    if (genres?.length === 0) {
      dispatch(fetchGenres());
    }
  }, [genres]);

  useEffect(() => {
    // Pas beau mais ca fonctionne
    const fetchData = async () => {
      // Commence le chargement
      setLoading(true);
      // Initialise les paramètres de la recherche
      const params: Partial<fetchAnimeParams> = {};
      // Ajoute les paramètres à la recherche si ils existent
      if (query && query !== "") params.query = query;
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

  // Met à jour l’URL sans recharger la page
  function updateParams(update: Record<string, string | number>) {
    const newParams = new URLSearchParams();

    if (query) newParams.set("query", query);
    if (sort) newParams.set("sort", sort);
    if (genreId) newParams.set("genreId", genreId);
    if (period) newParams.set("period", getPeriodUrl(period) || "all");
    if (orderBy) newParams.set("orderBy", orderBy);
    if (status) newParams.set("status", status);
    newParams.set("page", page.toString());

    // Transforme les valeur de l'objet update en tableau et les ajoute à l'url
    Object.entries(update).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });

    router.push(`/animes?${newParams.toString()}`);
  }

  return (
    <section className="p-4">
      {/* Barre de recherche */}
      <div className="searchContainer flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un animé..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(1);
              updateParams({ query: e.currentTarget.value, page: 1 });
            }
          }}
          className="p-2 rounded bg-neutral-800 text-white"
        />
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as "asc" | "desc");
            setPage(1);
            updateParams({ sort: e.target.value, page: 1 });
          }}
          className="p-2 rounded bg-neutral-800 text-white">
          <option value="asc">Ascendant</option>
          <option value="desc">Descendant</option>
        </select>
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value as Period);
            setPage(1);
            updateParams({ period: e.target.value, page: 1 });
          }}
          className="p-2 rounded bg-neutral-800 text-white">
          <option value="day">Jour</option>
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
          <option value="all">Tous</option>
        </select>
        <select
          value={status || ""}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
            updateParams({ status: e.target.value, page: 1 });
          }}
          className="p-2 rounded bg-neutral-800 text-white">
          <option value="">Tous</option>
          <option value="airing">En cours</option>
          <option value="complete">Terminé</option>
          <option value="upcoming">À venir</option>
        </select>
        <select
          value={orderBy}
          onChange={(e) => {
            setOrderBy(e.target.value);
            setPage(1);
            updateParams({ orderBy: e.target.value, page: 1 });
          }}
          className="p-2 rounded bg-neutral-800 text-white">
          <option value="popularity">Popularité</option>
          <option value="start_date">Date de début</option>
          <option value="end_date">Date de fin</option>
          <option value="score">Score</option>
          <option value="rank">Classement</option>
          <option value="favorites">Favoris</option>
          <option value="scored_by">Nombre de votes</option>
          <option value="episodes">Nombre d'épisodes</option>
          <option value="mal_id">ID (MyAnimeList)</option>
          <option value="title">Titre</option>
        </select>
        <select
          value={genreId}
          onChange={(e) => {
            setGenreId(e.target.value);
            setPage(1);
            updateParams({ genreId: e.target.value, page: 1 });
          }}
          className="p-2 rounded bg-neutral-800 text-white">
          <option value="">Tous les genres</option>
          {genres?.map((g) => (
            <option key={g.mal_id + g.name} value={g.mal_id}>
              {g.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setQuery("");
            setSort("asc");
            setOrderBy("popularity");
            setGenreId("");
            setPage(1);
            setPeriod("all");
            setStatus(null);
            router.push("/animes?sort=asc&period=all&page=1&orderBy=popularity");
          }}
          className="p-2 rounded bg-red-700 hover:bg-red-600 text-white">
          Réinitialiser
        </button>
      </div>
      {/* Résultats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {!loading && animes && animes.data?.length === 0 && <p>Aucun animé ne correspond à votre recherche.</p>}
        {animes && animes.data?.map((anime, index) => <CardHome key={index} anime={anime} />)}
      </div>
      {/*  Pagination */}
      {animes && animes.pagination && (
        <div className="flex flex-wrap justify-center mt-6 gap-2 text-white text-sm">
          {/* First */}
          <button
            disabled={page === 1}
            onClick={() => {
              setPage(1);
              updateParams({ page: 1 });
            }}
            className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-neutral-700 hover:bg-neutral-600"}`}>
            First
          </button>
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              updateParams({ page: newPage });
            }}
            className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-neutral-700 hover:bg-neutral-600"}`}>
            &lt;
          </button>
          {/* Pages dynamiques */}
          {(() => {
            const totalPages = animes.pagination.last_visible_page;
            const visiblePages: number[] = [];
            // Toujours montrer les 3 premières pages (si il y en a moins de 3, on montre toutes les pages)
            for (let i = 1; i <= Math.min(3, totalPages); i++) {
              visiblePages.push(i);
            }
            // Pages autour de la page actuelle (si pas déjà affichées)
            for (let i = page - 1; i <= page + 1; i++) {
              if (i > 3 && i < totalPages - 2 && !visiblePages.includes(i)) {
                visiblePages.push(i);
              }
            }
            // 3 dernières pages
            for (let i = totalPages - 2; i <= totalPages; i++) {
              if (i > 3 && !visiblePages.includes(i)) {
                visiblePages.push(i);
              }
            }
            // Tri + affichage unique
            // Set supprimer les doublons et Array.from pour reconvertir en tableau
            const sortedPages = Array.from(new Set(visiblePages)).sort((a, b) => a - b);
            return sortedPages.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPage(p);
                  updateParams({ page: p });
                }}
                className={`px-3 py-1 rounded ${p === page ? "bg-accent text-black font-bold" : "bg-neutral-800 hover:bg-neutral-600"}`}>
                {p}
              </button>
            ));
          })()}
          {/* Next */}
          <button
            disabled={!animes.pagination.has_next_page}
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              updateParams({ page: newPage });
            }}
            className={`px-3 py-1 rounded ${!animes.pagination.has_next_page ? "bg-gray-500 cursor-not-allowed" : "bg-neutral-700 hover:bg-neutral-600"}`}>
            &gt;
          </button>

          {/* Last */}
          <button
            disabled={page === animes.pagination.last_visible_page}
            onClick={() => {
              const last = animes.pagination.last_visible_page;
              setPage(last);
              updateParams({ page: last });
            }}
            className={`px-3 py-1 rounded ${page === animes.pagination.last_visible_page ? "bg-gray-500 cursor-not-allowed" : "bg-neutral-700 hover:bg-neutral-600"}`}>
            Last
          </button>
        </div>
      )}
    </section>
  );
}
