import { AnimeWithPricePromo, getPeriodUrl } from "./utils";
import { fetchAnimeParams, TypeAnime, TypeAnimeWithPagination } from "@/types";

// Fonction pour récupérer des animés par query, genre, période, ordre, tri, limite et sfw
export async function fetchAnimes({
  query,
  genreId,
  period = "all",
  orderBy = "popularity",
  sort = "asc",
  limit = 16,
  safe = true,
  status,
  page = 1,
  promotion = false,
}: fetchAnimeParams): Promise<TypeAnimeWithPagination | null> {
  // Récupère la période de l'url ou une chaîne vide si all est fourni
  const periodUrl = getPeriodUrl(period) ?? "";

  // Base de l'url
  let url = "https://api.jikan.moe/v4/anime?";
  // Ajoute les paramètres passés en argument
  if (query) url += `q=${encodeURIComponent(query)}&`;
  if (genreId !== undefined) url += `genres=${genreId}&`;
  if (safe) url += `sfw=${safe}&`;
  if (status) url += `status=${status}&`;
  if (page) url += `page=${page}&`;
  url += `order_by=${orderBy}&sort=${sort}&limit=${limit}${periodUrl}`;
  // console.log(url); // Pour debug

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    if (!res.ok) throw new Error(`Erreur fetchAnimes: ${res.status}`);

    const data = await res.json();
    return {
      pagination: data.pagination,
      data: data.data.map((anime: TypeAnime) => AnimeWithPricePromo(promotion)(anime)),
    };
  } catch (err) {
    console.error("Erreur dans fetchAnimes:", err);
    return null;
  }
}

export async function fetchSingleAnime(id: string, promotion: boolean = false): Promise<TypeAnime | null> {
  if (!id) return null;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    if (!res.ok) throw new Error(`Erreur fetchSingleAnime: ${res.status}`);

    const { data } = await res.json();
    return AnimeWithPricePromo(promotion)(data);
  } catch (err) {
    console.error("Erreur dans fetchSingleAnime:", err);
    return null;
  }
}

// Ancienne méthode
// // Fonction qui récupère les animés populaires selon la période choisie
// // Définit all comme période par défaut si aucun argument n'est fourni
// export async function fetchPopularAnimes(period: "day" | "week" | "month" | "year" | "all" = "all") {
//   // Génère la période de l'URL selon la période choisie
//   const periodUrl = getPeriodUrl(period);
//   try {
//     // Récupère les 20 premiers animés populaires selon la période choisie et re fetch les données toutes les heures (3600 secondes)
//     const res = await fetch(`https://api.jikan.moe/v4/anime?order_by=popularity&sort=desc&limit=20${periodUrl}`, { next: { revalidate: 3600 }, cache: "force-cache" });
//     if (!res.ok) throw new Error("Erreur lors du fetch des animés");
//     const data = await res.json();
//     // Ajoute un prix à chaque anime et si l'anime avait déjà un prix, on garde le prix mémorisé dans animePrice
//     return data.data.map((anime: any) => ({
//       ...anime,
//       price: parseFloat(getAnimePrice(anime.mal_id).toFixed(2)),
//     }));
//   } catch (error) {
//     console.error("Erreur lors de la récupération des animés :", error);
//     return null;
//   }
// }

// // Fonction pour rechercher des animés par recherche et période
// export async function fetchAnimesByQuery(query: string, period: "day" | "week" | "month" | "year" | "all" = "all") {
//   const periodUrl = getPeriodUrl(period);
//   try {
//     // Transforme la recherche pour la rendre compatible avec l'api
//     const queryUrl = encodeURIComponent(query);
//     const res = await fetch(`https://api.jikan.moe/v4/anime?q=${queryUrl}&order_by=popularity&sort=desc&limit=20${periodUrl}`, {
//       next: { revalidate: 3600 },
//       cache: "force-cache",
//     });
//     if (!res.ok) throw new Error("Erreur lors du fetch par query");
//     const data = await res.json();
//     return data.data.map((anime: any) => ({
//       ...anime,
//       price: parseFloat(getAnimePrice(anime.mal_id).toFixed(2)),
//     }));
//   } catch (error) {
//     console.error("Erreur lors de la recherche d'animes :", error);
//     return null;
//   }
// }

// // Fonction pour récupérer les nouveautés selon la période
// export async function fetchNewAnimes(period: "day" | "week" | "month" | "year" | "all" = "all") {
//   const periodUrl = getPeriodUrl(period);
//   try {
//     const res = await fetch(`https://api.jikan.moe/v4/anime?order_by=start_date&sort=desc&limit=20${periodUrl}`, { next: { revalidate: 3600 }, cache: "force-cache" });
//     if (!res.ok) throw new Error("Erreur lors du fetch des nouveautés");
//     const data = await res.json();
//     return data.data.map((anime: any) => ({
//       ...anime,
//       price: parseFloat(getAnimePrice(anime.mal_id).toFixed(2)),
//     }));
//   } catch (error) {
//     console.error("Erreur lors de la récupération des nouveautés :", error);
//     return null;
//   }
// }

// // Fonction pour récupérer les animés par genre et période
// export async function fetchAnimesByGenre(genreId: number, period: "day" | "week" | "month" | "year" | "all" = "all") {
//   const periodUrl = getPeriodUrl(period);
//   try {
//     const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity&sort=desc&limit=20${periodUrl}`, {
//       next: { revalidate: 3600 },
//       cache: "force-cache",
//     });
//     if (!res.ok) throw new Error("Erreur lors du fetch par genre");
//     const data = await res.json();
//     return data.data.map((anime: any) => ({
//       ...anime,
//       price: parseFloat(getAnimePrice(anime.mal_id).toFixed(2)),
//     }));
//   } catch (error) {
//     console.error("Erreur lors de la récupération des animés par genre :", error);
//     return null;
//   }
// }
