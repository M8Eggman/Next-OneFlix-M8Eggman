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
