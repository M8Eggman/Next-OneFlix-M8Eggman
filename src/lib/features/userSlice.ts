import { TypeUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const users: TypeUser[] = [
  {
    username: "Eggman",
    password: "123",
    email: "eggman@email.com",
    searchHistory: [],
    cart: [],
    boughtHistory: [],
    watchlist: [],
    ownedItems: [],
  },
];

const initialState: TypeUser = {
  username: null,
  password: "",
  email: "",
  isAuthenticated: false,
  searchHistory: [],
  cart: [],
  boughtHistory: [],
  watchlist: [],
  ownedItems: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export default userSlice.reducer;
export const {} = userSlice.actions;
