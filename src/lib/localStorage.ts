// Fonction qui charge l'état Redux depuis localStorage
export function loadState() {
  // Si on est dans un environnement server, on ne fait rien
  if (typeof window === "undefined") return;
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}
// Fonction qui sauvegarde l'état Redux dans localStorage
export function saveState(state: any) {
  if (typeof window === "undefined") return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.error("Erreur lors de la sauvegarde dans localStorage", err);
  }
}
