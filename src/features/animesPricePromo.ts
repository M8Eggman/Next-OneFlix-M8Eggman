import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Mémoire pour les prix et promotions des animés (clé = mal_id)

interface AnimesPricePromo {
  priceByAnimeId: { [key: string]: number | null };
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
    saveAnimePrice: (state, action: PayloadAction<{ id: string; price: number | null }>) => {
      const { id, price } = action.payload;
      if (state.priceByAnimeId[id] === undefined) {
        state.priceByAnimeId[id] = price;
      }
    },
    // Retourne toujours la même promotion pour un anime si la promotion était déjà générée
    saveAnimePromotion: (state, action: PayloadAction<{ id: string; promo: number | null }>) => {
      const { id, promo } = action.payload;
      if (state.promoByAnimeId[id] === undefined) {
        state.promoByAnimeId[id] = promo;
      }
    },
  },
});

export const { saveAnimePrice, saveAnimePromotion } = animesPricePromoSlice.actions;
export default animesPricePromoSlice.reducer;
