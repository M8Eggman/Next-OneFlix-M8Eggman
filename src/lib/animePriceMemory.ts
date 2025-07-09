// Mémoire temporaire pour les prix des animés (clé = mal_id)
const animePrice: { [key: string]: number } = {};

// Retourne toujours le même prix pour un anime donné tant que la page n'est pas rechargée
export function getAnimePrice(mal_id: string): number {
  const mal_id_str = mal_id.toString();
  if (!(mal_id_str in animePrice)) {
    animePrice[mal_id_str] = Math.floor(Math.random() * 14) + 0.99; // prix aléatoire entre 0.99 et 14.99
  }
  return animePrice[mal_id_str];
}
