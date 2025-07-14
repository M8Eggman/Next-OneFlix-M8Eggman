import { store } from "@/store/store";
import { getPeriodUrl } from "./utils";
import { fetchAnimeParams, TypeAnimeWithPagination } from "@/types";
import { getAnimePrice, getAnimePromotion } from "@/features/animesPricePromo";

// Fonction pour récupérer des animés par query, genre, période, ordre, tri, limite et sfw
export async function fetchAnimes({
  query,
  genreId,
  period = "all",
  orderBy = "popularity",
  sort = "asc",
  limit = 16,
  safe = true,
  status = "complete",
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
  console.log(url); // Pour debug

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });
    if (!res.ok) throw new Error(`Erreur fetchAnimes: ${res.status}`);
    const data = await res.json();

    return {
      pagination: data.pagination,
      data: data.data.map((anime: any) => {
        const id = anime.mal_id.toString();

        // Récupère le prix et la promotion de l'anime ou crée un prix et une promotion aléatoire si l'anime n'a pas déjà un prix ou une promotion
        store.dispatch(getAnimePrice(id));
        store.dispatch(getAnimePromotion({ id, probability: promotion ? 1 : 0.1 }));

        // Récupère le prix de l'anime
        const price = store.getState().animesPricePromo.priceByAnimeId[id];
        // Récupère la promotion de l'anime
        const promo = store.getState().animesPricePromo.promoByAnimeId[id];
        // Calcule le prix final de l'anime en appliquant la promotion si promo existe
        const finalPrice = promo ? Math.round(price * (1 - promo) * 100) / 100 : price;

        return {
          ...anime,
          price: price,
          promotion: promo,
          finalPrice: finalPrice,
        };
      }),
    };
  } catch (err) {
    console.error("Erreur dans fetchAnimes:", err);
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
