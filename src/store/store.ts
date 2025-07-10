import animesPricePromoReducer from "@/features/animesPricePromo";
import genreReducer from "@/features/genreSlice";
import userReducer from "@/features/userSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import pour typé les hooks obligatoire pour du typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

// Combine les reducers
const rootReducer = combineReducers({
  animesPricePromo: animesPricePromoReducer,
  genre: genreReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const store = makeStore();
export const persistor = persistStore(store);

// Extraction des types pour le dispatch et le selecteur
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Typage des hooks personnalisés
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
