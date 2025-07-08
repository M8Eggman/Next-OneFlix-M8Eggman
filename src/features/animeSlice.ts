import { TypeAnime, TypeAnimeResponse, TypeAnimeState } from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: TypeAnimeState = {
  all: [],
  naruto: [],
  popular: [],
  new: [],
  loadingPopular: false,
  loadingNew: false,
  loadingAll: false,
  loadingNaruto: false,
  errorPopular: null,
  errorNew: null,
  errorAll: null,
  errorNaruto: null,
  pagePopular: 1,
  pageNew: 1,
  pageAll: 1,
  pageNaruto: 1,
  popularPagination: null,
  newPagination: null,
  allPagination: null,
  narutoPagination: null,
};

export const fetchAllAnime = createAsyncThunk<TypeAnimeResponse, number, { rejectValue: string }>("anime/fetchAll", async (page = 1, thunkAPI) => {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?sfw=true&limit=20&page=${page}`);
    const json = await res.json();
    return {
      animeList: json.data,
      pagination: json.pagination,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue("Erreur lors du chargement des animes");
  }
});
export const fetchNarutoAnime = createAsyncThunk<TypeAnimeResponse, number, { rejectValue: string }>("anime/fetchNaruto", async (page = 1, thunkAPI) => {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?sfw=true&q=naruto&order_by=popularity&sort=desc&limit=20&page=${page}`);
    const json = await res.json();
    return {
      animeList: json.data,
      pagination: json.pagination,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue("Erreur lors du chargement des animes Naruto");
  }
});
export const fetchPopularAnime = createAsyncThunk<TypeAnimeResponse, number, { rejectValue: string }>("anime/fetchPopular", async (page = 1, thunkAPI) => {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?sfw=true&order_by=popularity&sort=desc&limit=20&page=${page}`);
    const json = await res.json();
    return {
      animeList: json.data,
      pagination: json.pagination,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue("Erreur lors du chargement des populaires");
  }
});
export const fetchNewAnime = createAsyncThunk<TypeAnimeResponse, number, { rejectValue: string }>("anime/fetchNew", async (page = 1, thunkAPI) => {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?sfw=true&order_by=start_date&sort=desc&limit=20&page=${page}`);
    const json = await res.json();
    return {
      animeList: json.data,
      pagination: json.pagination,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue("Erreur lors du chargement des nouveautés");
  }
});

const animeSlice = createSlice({
  name: "anime",
  initialState,
  reducers: {
    setPagePopular(state, action: PayloadAction<number>) {
      state.pagePopular = action.payload;
    },
    setPageNew(state, action: PayloadAction<number>) {
      state.pageNew = action.payload;
    },
    setPageAll(state, action: PayloadAction<number>) {
      state.pageAll = action.payload;
    },
    setPageNaruto(state, action: PayloadAction<number>) {
      state.pageNaruto = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // All
      .addCase(fetchAllAnime.pending, (state) => {
        state.loadingAll = true;
        state.errorAll = null;
      })
      .addCase(fetchAllAnime.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.all = action.payload.animeList;
        state.allPagination = action.payload.pagination;
      })
      .addCase(fetchAllAnime.rejected, (state, action) => {
        state.loadingAll = false;
        state.errorAll = action.payload ?? "Erreur inconnue";
      })
      // Naruto
      .addCase(fetchNarutoAnime.pending, (state) => {
        state.loadingNaruto = true;
        state.errorNaruto = null;
      })
      .addCase(fetchNarutoAnime.fulfilled, (state, action) => {
        state.loadingNaruto = false;
        state.naruto = action.payload.animeList;
        state.narutoPagination = action.payload.pagination;
      })
      .addCase(fetchNarutoAnime.rejected, (state, action) => {
        state.loadingNaruto = false;
        state.errorNaruto = action.payload ?? "Erreur inconnue";
      })
      // Popular
      .addCase(fetchPopularAnime.pending, (state) => {
        state.loadingPopular = true;
        state.errorPopular = null;
      })
      .addCase(fetchPopularAnime.fulfilled, (state, action) => {
        state.loadingPopular = false;
        state.popular = action.payload.animeList;
        state.popularPagination = action.payload.pagination;
      })
      .addCase(fetchPopularAnime.rejected, (state, action) => {
        state.loadingPopular = false;
        state.errorPopular = action.payload ?? "Erreur inconnue";
      })
      // New
      .addCase(fetchNewAnime.pending, (state) => {
        state.loadingNew = true;
        state.errorNew = null;
      })
      .addCase(fetchNewAnime.fulfilled, (state, action) => {
        state.loadingNew = false;
        state.new = action.payload.animeList;
        state.newPagination = action.payload.pagination;
      })
      .addCase(fetchNewAnime.rejected, (state, action) => {
        state.loadingNew = false;
        state.errorNew = action.payload ?? "Erreur inconnue";
      });
  },
});

export const { setPagePopular, setPageNew, setPageAll, setPageNaruto } = animeSlice.actions;
export default animeSlice.reducer;
