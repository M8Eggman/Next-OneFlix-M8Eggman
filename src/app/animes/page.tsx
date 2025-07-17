"use client";

import "./AnimesPage.sass";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchAnimes } from "@/lib/fetchAnime";
import { fetchAnimeParams, Period, TypeAnimeWithPagination, TypeGenre } from "@/types";
import { fetchGenres } from "@/features/genreSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getPeriodUrl } from "@/lib/utils";
import CardHome from "@/components/card/cardHome/CardHome";
import { FiFilter } from "react-icons/fi";
import CardHomeLoader from "@/components/card/cardHome/CardHomeLoader";

// expected url : /animes?query=naruto&sort=asc&period=all&page=1&orderBy=popularity&status=airing&limit=20&safe=true&genreId=1
export default function AnimesPage() {
  // Récupère les paramètres de l'url
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Récupère les genres depuis le store
  const { genres } = useAppSelector((state) => state.genre);

  const [animes, setAnimes] = useState<TypeAnimeWithPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

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

  // remplace les useState que j'avais avant
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "asc";
  const period = searchParams.get("period") || "all";
  const status = searchParams.get("status") || "complete";
  const orderBy = searchParams.get("orderBy") || "popularity";
  const genreId = searchParams.get("genreId") || "";
  const type = searchParams.get("type") || "";

  // Met à jour l’URL sans recharger la page
  function updateParams(update: Record<string, string | number>) {
    const newParams = new URLSearchParams();

    if (query) newParams.set("query", query);
    if (sort) newParams.set("sort", sort);
    if (genreId) newParams.set("genreId", genreId);
    if (period) newParams.set("period", getPeriodUrl(period as Period) || "all");
    if (orderBy) newParams.set("orderBy", orderBy);
    if (status) newParams.set("status", status);
    if (type) newParams.set("type", type);
    newParams.set("page", page.toString());

    // Transforme les valeur de l'objet update en tableau et les ajoute à l'url
    Object.entries(update).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });

    router.push(`/animes?${newParams.toString()}`);
  }

  // Chargement des genres depuis le store si il n'y en a pas sinon les récupère depuis l'api
  useEffect(() => {
    if (genres?.length === 0) {
      dispatch(fetchGenres());
    }
  }, [genres]);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 576) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Récupère les animés selon les paramètres de la recherche
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
        status: searchParams.get("status") || "complete",
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "20"),
        type: searchParams.get("type") || undefined,
        safe: searchParams.get("safe") !== "false", // true by default
      };
      // Récupère les animés selon les paramètres de la recherche
      const data = await fetchAnimes(params);
      // Met à jour les animés si les données sont disponibles
      if (data) setAnimes(data as TypeAnimeWithPagination);
      // Met à jour le statut de chargement
      setLoading(false);
    };

    fetchData();
  }, [searchParams]);

  return (
    <section className="sectionAnimesPage">
      {/* Barre de recherche */}
      <div className="searchContainer">
        <h2 className="searchContainerTitle">
          <FiFilter /> <span>Filtres</span>
        </h2>
        <div className="searchContainerInputs">
          {/* Input pour la recherche */}
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
          {/* Select pour le tri */}
          <select
            value={sort}
            onChange={(e) => {
              updateParams({ sort: e.target.value, page: 1 });
            }}>
            <option value="asc">Ascendant</option>
            <option value="desc">Descendant</option>
          </select>
          {/* Select pour la période */}
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
          {/* Select pour le statut */}
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
          {/* Select pour l'ordre */}
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
          {/* Select pour le type d'animé */}
          <select
            value={type}
            onChange={(e) => {
              updateParams({ type: e.target.value, page: 1 });
            }}>
            <option value="">Tous les types</option>
            <option value="tv">TV</option>
            <option value="movie">Film</option>
            <option value="ova">OVA</option>
            <option value="special">Spécial</option>
            <option value="ona">ONA</option>
            <option value="music">Musique</option>
            <option value="cm">CM</option>
            <option value="pv">PV</option>
            <option value="tv_special">TV Spécial</option>
          </select>
          {/* Select pour le genre */}
          <select
            value={genreId}
            onChange={(e) => {
              updateParams({ genreId: e.target.value, page: 1 });
            }}>
            <option value="">Tous les genres</option>
            {genres?.map((g: TypeGenre) => (
              <option key={g.mal_id + g.name} value={g.mal_id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        {/* Bouton pour réinitialiser les filtres */}
        <button
          onClick={() => {
            setQuery("");
            updateParams({ page: 1 });
            router.push("/animes?sort=asc&period=all&page=1&orderBy=popularity");
          }}>
          Réinitialiser
        </button>
        <button
          onClick={() => {
            updateParams({ page: 1 });
          }}>
          Rechercher
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
            {!isMobile ? (
              (() => {
                // initialisation du tableau des pages visibles ou des petits points de suspension
                const visiblePages: (number | "...")[] = [];

                // Récupère le nombre de pages total
                const totalPages = animes.pagination.last_visible_page;
                // Nombre de pages visibles par défaut
                const maxVisiblePages = 7;
                // Nombre de pages visibles par défaut / 2
                const half = Math.floor(maxVisiblePages / 2);

                // Page de début et de fin par rapport à la page actuelle on affiche 3 pages de chaque côté de la page actuelle
                // Si la page actuelle est trop proche du début ou de la fin, on affiche ce qu'il faut pour avoir 3 pages de chaque côté
                let startPage = page - half > 1 ? page - half : 2;
                let endPage = page + half < totalPages ? page + half : totalPages - 1;

                // Si la page actuelle est trop proche du début, on affiche les pages 6 premières ou 6 dernières (si il y en a moins de 6 on affiche toutes les pages)
                if (page <= half + 1) {
                  startPage = 2;
                  endPage = totalPages - 1 > maxVisiblePages - 1 ? maxVisiblePages - 1 : totalPages - 1;
                } else if (page >= totalPages - half) {
                  endPage = totalPages - 1;
                  startPage = totalPages - maxVisiblePages + 2 > 2 ? totalPages - maxVisiblePages + 2 : 2;
                }

                visiblePages.push(1); // Toujours montrer la première page

                if (startPage > 2) visiblePages.push("..."); // Si la page actuelle est trop loin du début, on affiche les pages 6 premières

                for (let i = startPage; i <= endPage; i++) {
                  visiblePages.push(i);
                }

                if (endPage < totalPages - 1) visiblePages.push("..."); // Si la page actuelle est trop loin de la fin, on affiche les pages 6 dernières

                if (totalPages > 1) visiblePages.push(totalPages); // Toujours montrer la dernière page si il y en a plus d'une

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
              })()
            ) : (
              <button className="active">{page}</button>
            )}

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
        {loading && (
          <div className="animesResultat">
            {Array.from({ length: 16 }).map((_, index) => (
              <CardHomeLoader key={index} />
            ))}
          </div>
        )}
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
            {!isMobile ? (
              (() => {
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

                visiblePages.push(1); // Toujours montrer la première page

                if (startPage > 2) visiblePages.push("...");

                for (let i = startPage; i <= endPage; i++) {
                  visiblePages.push(i);
                }

                if (endPage < totalPages - 1) visiblePages.push("...");

                if (totalPages > 1) visiblePages.push(totalPages); // Toujours montrer la dernière page si il y en a plus d'une

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
              })()
            ) : (
              <button className="active">{page}</button>
            )}
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
