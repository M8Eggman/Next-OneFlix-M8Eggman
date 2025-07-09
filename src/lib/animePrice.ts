// Mémoire temporaire pour les prix des animés (clé = mal_id)
const animePrice: { [key: string]: number } = {};
const animePromotion: { [key: string]: number | null } = {};

// Retourne toujours le même prix pour un anime donné tant que la page n'est pas rechargée
export function getAnimePrice(mal_id: string): number {
  const mal_id_str = mal_id.toString();
  // si l'anime n'est pas dans la mémoire, on l'ajoute avec un prix aléatoire entre 0.99 et 14.99
  if (!(mal_id_str in animePrice)) {
    animePrice[mal_id_str] = Math.floor(Math.random() * 14) + 0.99; // prix aléatoire entre 0.99 et 14.99
  }
  return animePrice[mal_id_str];
}
// Retourne toujours le même prix pour un anime donné tant que la page n'est pas rechargée
export function getAnimePromotion(mal_id: string, probability: number): number | null {
  const mal_id_str = mal_id.toString();
  // si l'anime n'est pas dans la mémoire, on décide UNE FOIS si promo ou pas
  if (!(mal_id_str in animePromotion)) {
    // applique une promotion que si la probabilité est supérieure à la valeur aléatoire
    // si probability = 1, la promotion est appliquée à tous les animés du fetch
    if (Math.random() <= probability) {
      animePromotion[mal_id_str] = Math.round((Math.random() * 0.29 + 0.01) * 100) / 100;
    } else {
      animePromotion[mal_id_str] = null;
    }
  }
  return animePromotion[mal_id_str];
}
