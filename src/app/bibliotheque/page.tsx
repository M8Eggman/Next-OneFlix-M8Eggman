"use client";

import "./Bibliotheque.sass";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { TypeAnime } from "@/types";
import NotFound from "../not-found";
import { fetchGenres } from "@/features/genreSlice";
import { formatDate } from "@/lib/utils";
import { getTypeBadge } from "@/lib/utils";
import { FaPlay } from "react-icons/fa";

export default function BibliothequePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);
  const { genres } = useAppSelector((state) => state.genre);

  const [activeTab, setActiveTab] = useState<"collection" | "historique">("collection");
  const [sortBy, setSortBy] = useState<"title" | "date" | "price">("title");
  const [filterBy, setFilterBy] = useState<"all" | "movie" | "tv" | "ova">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [genreId, setGenreId] = useState<number | "all">("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (genres?.length === 0) {
      dispatch(fetchGenres());
    }
  }, [genres]);

  // Fonction pour trier les animes
  function sortAnimes(animes: TypeAnime[], sort: "asc" | "desc", sortBy: "title" | "date" | "price") {
    return [...animes].sort((a, b) => {
      let result = 0;
      switch (sortBy) {
        case "title":
          result = a.title.localeCompare(b.title);
          break;
        case "date":
          const dateA = new Date(a.aired?.from || "").getTime();
          const dateB = new Date(b.aired?.from || "").getTime();
          result = dateA - dateB;
          break;
        case "price":
          const priceA = a.finalPrice ?? 0;
          const priceB = b.finalPrice ?? 0;
          result = priceA - priceB;
          break;
        default:
          return 0;
      }
      return sort === "asc" ? result : -result;
    });
  }

  // Fonction pour filtrer les animes
  function filterAnimes(animes: TypeAnime[]) {
    let filtered = animes;
    // Filtrer par type
    if (filterBy !== "all") {
      filtered = filtered.filter((anime) => anime.type?.toLowerCase() === filterBy);
    }
    // Filtrer par genre
    if (genreId !== "all") {
      filtered = filtered.filter((anime) => anime.genres.some((genre) => genre.mal_id === Number(genreId)));
    }
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (anime) =>
          anime.title.trim().replace(" ", "").toLowerCase().includes(searchTerm.trim().replace(" ", "").toLowerCase()) ||
          anime.title_english?.trim().replace(" ", "").toLowerCase().includes(searchTerm.trim().replace(" ", "").toLowerCase())
      );
    }
    return filtered;
  }

  if (!user.isAuthenticated) {
    return <NotFound />;
  }

  const filteredAndSortedAnimes = sortAnimes(filterAnimes(user.ownedItems), sort, sortBy);

  return (
    <div className="bibliothequePage">
      <div className="pageHeader">
        <button className="backButton" onClick={() => router.back()}>
          Retour
        </button>
        <h1>Ma Bibliothèque</h1>
        <div className="userStats">
          <div className="stat">
            <span className="statNumber">{user.ownedItems.length}</span>
            <span className="statLabel">Animes</span>
          </div>
          <div className="stat">
            <span className="statNumber">{user.boughtHistory.length}</span>
            <span className="statLabel">Achats</span>
          </div>
          <div className="stat">
            <span className="statNumber">{user.credit.toFixed(2)}€</span>
            <span className="statLabel">Crédit</span>
          </div>
        </div>
      </div>
      <div className="tabsContainer">
        <div className="tabs">
          <button className={`tab ${activeTab === "collection" ? "active" : ""}`} onClick={() => setActiveTab("collection")}>
            Ma Collection
          </button>
          <button className={`tab ${activeTab === "historique" ? "active" : ""}`} onClick={() => setActiveTab("historique")}>
            Historique d'achats
          </button>
        </div>
      </div>
      {activeTab === "collection" && (
        <div className="collectionSection">
          <div className="controlsBar">
            <div className="searchBox">
              <input type="text" placeholder="Rechercher un anime..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="filters">
              <select value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")} className="sortSelect">
                <option value="asc">Ascendant</option>
                <option value="desc">Descendant</option>
              </select>
              <select value={filterBy} onChange={(e) => setFilterBy(e.target.value as "all" | "movie" | "tv" | "ova")} className="filterSelect">
                <option value="all">Tous les types</option>
                <option value="tv">Séries TV</option>
                <option value="movie">Films</option>
                <option value="ova">OVA</option>
              </select>
              <select value={genreId} onChange={(e) => setGenreId(e.target.value as number | "all")} className="sortSelect">
                <option value="all">Tous les genres</option>
                {genres.map((genre) => (
                  <option key={genre.mal_id} value={genre.mal_id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "title" | "date" | "price")} className="sortSelect">
                <option value="title">Titre</option>
                <option value="date">Date de sortie</option>
                <option value="price">Prix</option>
              </select>
            </div>
          </div>
          {filteredAndSortedAnimes.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon"></div>
              <h3>Aucun anime trouvé</h3>
              <p>
                {user.ownedItems.length === 0
                  ? "Tu n'as encore acheté aucun anime. Explore le catalogue pour commencer ta collection!"
                  : "Aucun anime ne correspond à tes critères de recherche."}
              </p>
              {user.ownedItems.length === 0 && <button onClick={() => router.push("/catalogue")}>Découvrir les animes</button>}
            </div>
          ) : (
            <div className="animeGrid">
              {filteredAndSortedAnimes.map((anime) => (
                <div key={anime.mal_id} className="animeCard" onClick={() => router.push(`/anime/${anime.mal_id}`)}>
                  <div
                    className="animeImage"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/`);
                    }}>
                    <img src={anime.images.webp.large_image_url} alt={anime.title} />
                    <img src={anime.images.webp.large_image_url} alt={anime.title} />
                    <div className="animeOverlay">
                      <button className="watchButton">
                        <FaPlay />
                      </button>
                    </div>
                  </div>
                  <div className="animeInfo">
                    <div className="animeHeader">
                      <h3 className="animeTitle">{anime.title.length > 20 ? anime.title.slice(0, 20) + "..." : anime.title}</h3>
                      <div className={`typeBadge ${getTypeBadge(anime.type).class}`}>{getTypeBadge(anime.type).label}</div>
                    </div>
                    <div className="animeDetails">
                      <div className="animeYear">{anime.year || "N/A"}</div>
                      <div className="animeScore">{anime.score || "N/A"}</div>
                      <div className="animePrice">{anime.finalPrice ? `${anime.finalPrice.toFixed(2)}€` : "Gratuit"}</div>
                    </div>
                    <div className="animeGenres">
                      {anime.genres?.slice(0, 3).map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="genreTag"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGenreId(genre.mal_id);
                          }}>
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === "historique" && (
        <div className="historiqueSection">
          <div className="historiqueHeader">
            <h2>Historique d'achats</h2>
            <div className="totalSpent">
              Total dépensé: <span>{user.boughtHistory.reduce((sum, purchase) => sum + purchase.totalPrice, 0).toFixed(2)}€</span>
            </div>
          </div>
          {user.boughtHistory.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon"></div>
              <h3>Aucun achat</h3>
              <p>Tu n'as encore effectué aucun achat. Commence par explorer le catalogue!</p>
              <button onClick={() => router.push("/catalogue")}>Découvrir les animes</button>
            </div>
          ) : (
            <div className="historiqueList">
              {user.boughtHistory.map((purchase, index) => (
                <div key={index} className="purchaseCard">
                  <div className="purchaseHeader">
                    <div className="purchaseDate">{formatDate(purchase.date)}</div>
                    <div className="purchaseTotal">{purchase.totalPrice.toFixed(2)}€</div>
                  </div>
                  <div className="purchaseItems">
                    <h4>Animes achetés ({purchase.boughtItems.length})</h4>
                    <div className="itemsList">
                      {purchase.boughtItems.map((item: any) => (
                        <div key={item.mal_id} className="purchaseItem">
                          <img src={item.images.webp.image_url} alt={item.title} className="itemImage" />
                          <div className="itemInfo">
                            <div className="itemTitle">{item.title}</div>
                            <div className="itemPrice">{item.isFreeWithPromotion ? <span className="freeTag">Gratuit</span> : `${item.finalPrice?.toFixed(2)}€`}</div>
                          </div>
                          <button className="itemWatchButton" onClick={() => router.push(`/watch/${item.mal_id}`)}>
                            <FaPlay />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
