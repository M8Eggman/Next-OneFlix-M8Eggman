import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Mémoire pour les prix et promotions des animés (clé = mal_id)

interface AnimesPricePromo {
  priceByAnimeId: { [key: string]: number };
  promoByAnimeId: { [key: string]: number | null };
}

const initialState: AnimesPricePromo = {
  priceByAnimeId: {},
  promoByAnimeId: {},
};

const animesPricePromoSlice = createSlice({
  name: "animesPricePromo",
  initialState,
  reducers: {
    // Retourne toujours le même prix pour un anime donné si le prix était déjà généré
    getAnimePrice: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      // si l'anime n'est pas dans la mémoire, on l'ajoute avec un prix aléatoire entre 0.99 et 14.99
      if (!(id in state.priceByAnimeId)) {
        state.priceByAnimeId[id] = Math.floor(Math.random() * 14) + 0.99;
      }
    },
    // Retourne toujours la même promotion pour un anime si la promotion était déjà générée
    getAnimePromotion: (state, action: PayloadAction<{ id: string; probability: number }>) => {
      const { id, probability } = action.payload;
      // si l'anime n'est pas dans la mémoire, on décide une fois si promo ou pas
      if (!(id in state.promoByAnimeId)) {
        // applique une promotion que si la probabilité est supérieure à la valeur aléatoire entre 0.01 et 0.30
        // si probability = 1, la promotion est appliquée à tous les animés du fetch
        state.promoByAnimeId[id] = Math.random() <= probability ? Math.round((Math.random() * 0.29 + 0.01) * 100) / 100 : null;
      }
    },
  },
});

export const { getAnimePrice, getAnimePromotion } = animesPricePromoSlice.actions;
export default animesPricePromoSlice.reducer;
