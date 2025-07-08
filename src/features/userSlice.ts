import { TypeUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const users: TypeUser[] = [
  {
    username: "Eggman",
    image:
      "https://images.steamusercontent.com/ugc/1893226588872381023/0A44605BB2EBD24007E06BD7C70A9A8EFB1A5309/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
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
  image: null,
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

export const {} = userSlice.actions;
export const userReducer = userSlice.reducer;
