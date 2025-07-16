"use client";

import "./AnimesPage.sass";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchAnimes } from "@/lib/fetchAnime";
import { fetchAnimeParams, Period, TypeAnimeWithPagination } from "@/types";
import { fetchGenres } from "@/features/genreSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getPeriodUrl } from "@/lib/utils";
import CardHome from "@/components/card/cardHome/CardHome";

// expected url : /animes?query=naruto&sort=asc&period=all&page=1&orderBy=popularity&status=airing&limit=20&safe=true&genreId=1
export default function AnimesPage() {
  // Récupère les paramètres de l'url
  const searchParams = useSearchParams();
  console.log(searchParams.toString());
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Récupère les genres depuis le store
  const { genres } = useAppSelector((state) => state.genre);

  const [animes, setAnimes] = useState<TypeAnimeWithPagination | null>(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get("query") || "");

  // Paramètres de la recherche et initialisation à partir de l'url si il y a des paramètres sinon on les initialise à leur valeur par défaut
  // plus besoin de les initialiser à leur valeur par défaut parce que on le fait dans le useEffect
  // const [sort, setSort] = useState<"asc" | "desc">((searchParams.get("sort") as "asc" | "desc") || "asc");
  // const [genreId, setGenreId] = useState(searchParams.get("genreId") || "");
  // const [period, setPeriod] = useState<Period>((searchParams.get("period") as Period) || "all");
  // const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  // const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || "popularity");
  // const [status, setStatus] = useState<string | null>(searchParams.get("status") || null);
  // const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || "20")); // invariant : 20
  // const [safe, setSafe] = useState(Boolean(searchParams.get("safe")) || true); // invariant : true

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
      // Initialise les paramètres de la recherche directement depuis l'url (pas besoin de les initialiser à leur valeur par défaut)
      const params: Partial<fetchAnimeParams> = {
        query: searchParams.get("query") || "",
        sort: (searchParams.get("sort") as "asc" | "desc") || "asc",
        genreId: searchParams.get("genreId") ? parseInt(searchParams.get("genreId")!) : undefined,
        period: (searchParams.get("period") as Period) || "all",
        orderBy: searchParams.get("orderBy") || "popularity",
        status: searchParams.get("status") || undefined,
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "20"),
        safe: searchParams.get("safe") !== "false", // true by default
      };
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
    if (period) newParams.set("period", getPeriodUrl(period as Period) || "all");
    if (orderBy) newParams.set("orderBy", orderBy);
    if (status) newParams.set("status", status);
    newParams.set("page", page.toString());

    // Transforme les valeur de l'objet update en tableau et les ajoute à l'url
    Object.entries(update).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });

    router.push(`/animes?${newParams.toString()}`);
  }
  // remplace les useState
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "asc";
  const period = searchParams.get("period") || "all";
  const status = searchParams.get("status") || "";
  const orderBy = searchParams.get("orderBy") || "popularity";
  const genreId = searchParams.get("genreId") || "";

  return (
    <section className="sectionAnimesPage">
      {/* Barre de recherche */}
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Rechercher un animé..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams({ query: e.currentTarget.value, page: 1 });
            }
          }}
        />
        <select
          value={sort}
          onChange={(e) => {
            updateParams({ sort: e.target.value, page: 1 });
          }}>
          <option value="asc">Ascendant</option>
          <option value="desc">Descendant</option>
        </select>
        <select
          value={period}
          onChange={(e) => {
            updateParams({ period: e.target.value, page: 1 });
          }}>
          <option value="all">Tous</option>
          <option value="day">Jour</option>
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>
        <select
          value={status || ""}
          onChange={(e) => {
            updateParams({ status: e.target.value, page: 1 });
          }}>
          <option value="">Tous</option>
          <option value="airing">En cours</option>
          <option value="complete">Terminé</option>
          <option value="upcoming">À venir</option>
        </select>
        <select
          value={orderBy}
          onChange={(e) => {
            updateParams({ orderBy: e.target.value, page: 1 });
          }}>
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
            updateParams({ genreId: e.target.value, page: 1 });
          }}>
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
            updateParams({ page: 1 });
            router.push("/animes?sort=asc&period=all&page=1&orderBy=popularity");
          }}>
          Réinitialiser
        </button>
      </div>
      <div className="animesContainer">
        {/*  Pagination du haut */}
        {animes && animes.pagination && (
          <div className="pagination">
            {/* First */}
            <button
              className="paginationButtonFirstLast"
              disabled={page === 1}
              onClick={() => {
                updateParams({ page: 1 });
              }}>
              First
            </button>
            {/* Prev */}
            <button
              className="paginationButtonNextPrev"
              disabled={page === 1}
              onClick={() => {
                updateParams({ page: page - 1 });
              }}>
              &lt;
            </button>
            {/* Pages dynamiques */}
            {(() => {
              const totalPages = animes.pagination.last_visible_page;
              const maxVisiblePages = 7;
              const half = Math.floor(maxVisiblePages / 2);

              let startPage = Math.max(2, page - half);
              let endPage = Math.min(totalPages - 1, page + half);

              if (page <= half + 1) {
                startPage = 2;
                endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
              } else if (page >= totalPages - half) {
                endPage = totalPages - 1;
                startPage = Math.max(2, totalPages - maxVisiblePages + 2);
              }

              const visiblePages: (number | "...")[] = [];

              visiblePages.push(1); // always show first

              if (startPage > 2) visiblePages.push("...");

              for (let i = startPage; i <= endPage; i++) {
                visiblePages.push(i);
              }

              if (endPage < totalPages - 1) visiblePages.push("...");

              if (totalPages > 1) visiblePages.push(totalPages); // always show last

              return visiblePages.map((p, index) =>
                p === "..." ? (
                  <span key={"ellipsis-" + index} className="ellipsis">
                    ...
                  </span>
                ) : (
                  <button key={p} className={p === page ? "active" : ""} onClick={() => updateParams({ page: p })}>
                    {p}
                  </button>
                )
              );
            })()}

            {/* Next */}
            <button
              className="paginationButtonNextPrev"
              disabled={!animes.pagination.has_next_page}
              onClick={() => {
                updateParams({ page: page + 1 });
              }}>
              &gt;
            </button>
            {/* Last */}
            <button
              className="paginationButtonFirstLast"
              disabled={page === animes.pagination.last_visible_page}
              onClick={() => {
                const last = animes.pagination.last_visible_page;
                updateParams({ page: last });
              }}>
              Last
            </button>
          </div>
        )}
        {/* Résultats */}
        {animes && animes.data?.length > 0 ? (
          <div className="animesResultat">{animes && animes.data?.map((anime, index) => <CardHome key={index} anime={anime} />)}</div>
        ) : (
          <p className="noResultat">Aucun animé ne correspond à votre recherche.</p>
        )}
        {/*  Pagination du bas */}
        {animes && animes.pagination && (
          <div className="pagination">
            {/* First */}
            <button
              className="paginationButtonFirstLast"
              disabled={page === 1}
              onClick={() => {
                updateParams({ page: 1 });
              }}>
              First
            </button>
            {/* Prev */}
            <button
              className="paginationButtonNextPrev"
              disabled={page === 1}
              onClick={() => {
                updateParams({ page: page - 1 });
              }}>
              &lt;
            </button>
            {/* Pages dynamiques */}
            {(() => {
              // TODO 
              const totalPages = animes.pagination.last_visible_page;
              const maxVisiblePages = 7;
              const half = Math.floor(maxVisiblePages / 2);

              let startPage = Math.max(2, page - half);
              let endPage = Math.min(totalPages - 1, page + half);

              if (page <= half + 1) {
                startPage = 2;
                endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
              } else if (page >= totalPages - half) {
                endPage = totalPages - 1;
                startPage = Math.max(2, totalPages - maxVisiblePages + 2);
              }

              const visiblePages: (number | "...")[] = [];

              visiblePages.push(1); // always show first

              if (startPage > 2) visiblePages.push("...");

              for (let i = startPage; i <= endPage; i++) {
                visiblePages.push(i);
              }

              if (endPage < totalPages - 1) visiblePages.push("...");

              if (totalPages > 1) visiblePages.push(totalPages); // always show last

              return visiblePages.map((p, index) =>
                p === "..." ? (
                  <span key={"ellipsis-" + index} className="ellipsis">
                    ...
                  </span>
                ) : (
                  <button key={p} className={p === page ? "active" : ""} onClick={() => updateParams({ page: p })}>
                    {p}
                  </button>
                )
              );
            })()}

            {/* Next */}
            <button
              className="paginationButtonNextPrev"
              disabled={!animes.pagination.has_next_page}
              onClick={() => {
                updateParams({ page: page + 1 });
              }}>
              &gt;
            </button>
            {/* Last */}
            <button
              className="paginationButtonFirstLast"
              disabled={page === animes.pagination.last_visible_page}
              onClick={() => {
                const last = animes.pagination.last_visible_page;
                updateParams({ page: last });
              }}>
              Last
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
