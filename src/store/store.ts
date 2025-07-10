import animesPricePromoReducer from "@/features/animesPricePromo";
import genreReducer from "@/features/genreSlice";
import userReducer from "@/features/userSlice";
import { loadState, saveState } from "@/lib/localStorage";
import { configureStore } from "@reduxjs/toolkit";
// import pour typé les hooks obligatoire pour du typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    animesPricePromo: animesPricePromoReducer,
    genre: genreReducer,
    user: userReducer,
  },
  // preloadedState: loadState(), provoque un bug de type
});

store.subscribe(() => {
  saveState(store.getState());
});

// Extraction des types pour le dispatch et le selecteur
type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

// Typage des hooks personnalisés
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
