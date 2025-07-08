import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GenreState, TypeGenre } from "@/types";

// Type de la réponse des thunk
interface TypeGenreResponse {
  data: TypeGenre[];
}

const initialState: GenreState = {
  genres: [],
  loading: false,
  error: null,
};

export const fetchGenres = createAsyncThunk<TypeGenre[]>("genre/fetchGenres", async (_, thunkAPI) => {
  try {
    const res = await fetch("https://api.jikan.moe/v4/genres/anime?filter=genres");
    const json: TypeGenreResponse = await res.json();
    return json.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Erreur lors du chargement des genres");
  }
});

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const genreReducer = genreSlice.reducer;
