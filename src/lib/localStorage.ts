// Fonction qui charge l'état Redux depuis localStorage
export function loadState() {
  // Si on est dans un environnement server, on ne fait rien
  if (typeof window === "undefined") return;
  try {
    const state = localStorage.getItem("reduxState");
    if (!state) return undefined;
    return JSON.parse(state);
  } catch (err) {
    return undefined;
  }
}
// Fonction qui sauvegarde l'état Redux dans localStorage
export function saveState(state: any) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("reduxState", JSON.stringify(state));
  } catch (err) {
    console.error("Erreur lors de la sauvegarde dans localStorage", err);
  }
}
