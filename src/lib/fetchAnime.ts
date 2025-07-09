import { getPeriodUrl } from "./utils";
import { getAnimePrice } from "./animePriceMemory";

// Fonction qui récupère les animés populaires selon la période choisie
// Définit all comme période par défaut si aucun argument n'est fourni
export async function fetchPopularAnimes(period: "day" | "week" | "month" | "year" | "all" = "all") {
  // Génère la période de l'URL selon la période choisie
  const periodUrl = getPeriodUrl(period);
  try {
    // Récupère les 20 premiers animés populaires selon la période choisie et re fetch les données toutes les heures (3600 secondes)
    const res = await fetch(`https://api.jikan.moe/v4/anime?order_by=popularity&sort=desc&limit=20${periodUrl}`, { next: { revalidate: 3600 }, cache: "force-cache" });
    if (!res.ok) throw new Error("Erreur lors du fetch des animés");
    const data = await res.json();
    // Ajoute un prix à chaque anime (prix mémorisé par mal_id)
    const animesWithPrice = data.data.map((anime: any) => ({
      ...anime,
      price: parseFloat(getAnimePrice(anime.mal_id).toFixed(2)),
    }));
    return animesWithPrice;
  } catch (error) {
    console.error("Erreur lors de la récupération des animés :", error);
    return null;
  }
}
