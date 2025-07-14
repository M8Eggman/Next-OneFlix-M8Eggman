import { TypeUser } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TypeUser & { users: TypeUser[] } = {
  users: [
    {
      username: "Eggman",
      image:
        "https://images.steamusercontent.com/ugc/1893226588872381023/0A44605BB2EBD24007E06BD7C70A9A8EFB1A5309/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      password: "123456",
      email: "eggman@email.com",
      searchHistory: [],
      error: { register: null, login: null },
      sendNewsletter: false,
      cart: [],
      boughtHistory: [],
      watchlist: [],
      ownedItems: [],
    },
  ],
  username: null,
  image: null,
  password: "",
  email: "",
  isAuthenticated: false,
  error: { register: null, login: null },
  sendNewsletter: false,
  searchHistory: [],
  cart: [],
  boughtHistory: [],
  watchlist: [],
  ownedItems: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Partial<TypeUser>>) => {
      // Vérifie si l'utilisateur existe dans redux (users)
      const userExists = state.users.find(
        (user) =>
          (user.username?.toLowerCase() === action.payload.username?.toLowerCase() || user.email?.toLowerCase() === action.payload.email?.toLowerCase()) &&
          user.password === action.payload.password
      );
      console.log(action.payload);
      console.log(userExists);
      // Si l'utilisateur existe, on connecte l'utilisateur
      if (userExists) {
        state.isAuthenticated = true;
        state.username = userExists.username;
        state.image = userExists.image;
        state.password = userExists.password;
        state.email = userExists.email;
      }
      // Si l'utilisateur n'existe pas, on affiche un message d'erreur
      else {
        state.error.login = "Nom d'utilisateur ou adresse e-mail incorrect";
      }
    },
    register: (state, action: PayloadAction<Partial<TypeUser>>) => {
      const userExists = state.users.find(
        (user) => user.username?.toLowerCase() === action.payload.username?.toLowerCase() || user.email?.toLowerCase() === action.payload.email?.toLowerCase()
      );
      if (userExists) {
        state.error.register = "Nom d'utilisateur ou adresse e-mail déjà utilisée";
      } else {
        state.users.push({ ...initialState, ...action.payload });
      }
    },
    logout: (state) => {
      return { ...initialState, users: state.users };
    },
    resetError: (state) => {
      state.error = { register: null, login: null };
    },
  },
});

export const { register, login, logout, resetError } = userSlice.actions;
export default userSlice.reducer;
