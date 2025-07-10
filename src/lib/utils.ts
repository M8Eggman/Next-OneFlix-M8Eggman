import { TypeAnime } from "@/types";

// Fonction qui génère une partie de l'URL selon la période choisie
export function getPeriodUrl(period: "day" | "week" | "month" | "year" | "all" = "all") {
  // Déclare la variable now et l'initialise à la date actuelle
  const now = new Date();
  // Déclare les variables url, startDate et endDate
  let url: string | null = null;
  let startDate: string;
  // Initialise la variable endDate à la date du jour et la transforme en string dans le format YYYY-MM-DD
  let endDate: string = now.toISOString().split("T")[0];

  switch (period) {
    case "day":
      startDate = endDate;
      url = `&start_date=${startDate}&end_date=${endDate}`;
      break;
    case "week":
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      startDate = lastWeek.toISOString().split("T")[0];
      url = `&start_date=${startDate}&end_date=${endDate}`;
      break;
    case "month":
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      startDate = lastMonth.toISOString().split("T")[0];
      url = `&start_date=${startDate}&end_date=${endDate}`;
      break;
    case "year":
      // Déclare la variable lastYear et l'initialise à la date actuelle
      const lastYear = new Date(now);
      // Modifie l'année de la date actuelle de 1 an
      lastYear.setFullYear(now.getFullYear() - 1);
      startDate = lastYear.toISOString().split("T")[0];
      url = `&start_date=${startDate}&end_date=${endDate}`;
      break;
    // Si la période est all, on ne fait rien
    case "all":
    default:
      break;
  }
  return url;
}

// Fonction qui retourne un tableau d'animés sans les doublons
export function getUniqueAnimes(animes: TypeAnime[] | null): TypeAnime[] {
  if (!animes) return [];
  const animesUnique: TypeAnime[] = [];
  for (let i = 0; i < animes.length; i++) {
    // Vérifie si un animé avec le même mal_id est déjà dans animesUnique
    if (!animesUnique.some((a) => a.mal_id === animes[i].mal_id)) {
      animesUnique.push(animes[i]);
    }
  }
  return animesUnique;
}

// Fonction qui filtre les animés pour ne garder que ceux qui ont une image
export function filterAnimeImage(anime: TypeAnime[]): TypeAnime[] {
  if (!anime) return [];
  const animeImage: TypeAnime[] = [];
  for (let i = 0; i < anime.length; i++) {
    if (anime[i].images.webp.image_url !== "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png") {
      animeImage.push(anime[i]);
    }
  }
  return animeImage;
}

// Fonction qui retourne un tableau d'animés avec les images filtrées et les doublons retirés
export function getUIAnimes(animes: TypeAnime[] | null): TypeAnime[] | null {
  if (!animes) return null;
  return filterAnimeImage(getUniqueAnimes(animes));
}

// Fonction qui attend un certain temps
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}