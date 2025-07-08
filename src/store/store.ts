import { genreReducer } from "@/features/animeGenreSlice";
import { userReducer } from "@/features/userSlice";
import { configureStore } from "@reduxjs/toolkit";
// import pour typé les hooks obligatoire pour du typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    genre: genreReducer,
    user: userReducer,
  },
});

// Extraction des types pour le dispatch et le selecteur
type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

// Typage des hooks personnalisés
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
