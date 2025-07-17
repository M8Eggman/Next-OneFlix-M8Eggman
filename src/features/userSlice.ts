import { TypeAnime, TypeUser } from "@/types";
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
      credit: 0,
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
  credit: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Auth functions
    login: (state, action: PayloadAction<Partial<TypeUser>>) => {
      // Vérifie si l'utilisateur existe dans redux (users)
      const userExists = state.users.find(
        (user) =>
          (user.username?.toLowerCase() === action.payload.username?.toLowerCase() || user.email?.toLowerCase() === action.payload.email?.toLowerCase()) &&
          user.password === action.payload.password
      );
      // Si l'utilisateur existe, on connecte l'utilisateur
      if (userExists) {
        state.isAuthenticated = true;
        state.username = userExists.username;
        state.image = userExists.image;
        state.password = userExists.password;
        state.email = userExists.email;
        state.credit = userExists.credit;
        state.error = { register: null, login: null };
      }
      // Si l'utilisateur n'existe pas, on affiche un message d'erreur
      else {
        state.error.login = "Nom d'utilisateur ou adresse e-mail incorrect";
      }
    },
    loginWithOAuth: (state, action: PayloadAction<Partial<TypeUser>>) => {
      const userExists = state.users.find(
        (user) => user.username?.toLowerCase() === action.payload.username?.toLowerCase() || user.email?.toLowerCase() === action.payload.email?.toLowerCase()
      );
      if (!userExists) {
        state.users.push({ ...initialState, ...action.payload });
      }
      state.isAuthenticated = true;
      state.username = action.payload.username || "";
      state.image = action.payload.image || "";
      state.password = action.payload.password || "";
      state.email = action.payload.email || "";
    },
    register: (state, action: PayloadAction<Partial<TypeUser>>) => {
      const userExists = state.users.find(
        (user) => user.username?.toLowerCase() === action.payload.username?.toLowerCase() || user.email?.toLowerCase() === action.payload.email?.toLowerCase()
      );
      if (userExists) {
        state.error.register = "Nom d'utilisateur ou adresse e-mail déjà utilisée";
      } else {
        state.users.push({ ...initialState, ...action.payload });
        state.isAuthenticated = true;
        state.username = action.payload.username || "";
        state.image = action.payload.image || "";
        state.password = action.payload.password || "";
        state.email = action.payload.email || "";
        state.credit = 0;
        state.error = { register: null, login: null };
      }
    },
    logout: (state) => {
      return { ...initialState, users: state.users };
    },
    resetError: (state) => {
      state.error = { register: null, login: null };
    },
    // Cart functions
    // Ajoute un anime au panier
    addToCart: (state, action: PayloadAction<TypeAnime>) => {
      // Ajoute l'item au panier
      state.cart.push(action.payload);

      // Applique la logique de l'item gratuit avec la promotion uniquement quand le panier a plus de 5 items
      if (state.cart.length >= 5) {
        // Crée un nouveau tableau trié pour éviter de modifier l'état original ne prend pas en compte les items qui sont déjà gratuits
        const sortedByPrice = [...state.cart].filter((item) => item.finalPrice !== 0).sort((a, b) => a.finalPrice - b.finalPrice);

        // Réinitialise toutes les isFree à false
        state.cart.forEach((item) => (item.isFreeWithPromotion = false));

        // Trouve l'item le moins cher
        const itemInCart = state.cart.find((item) => item.mal_id === sortedByPrice[0].mal_id);

        // Met l'item le moins cher à gratuit si il est trouvé
        if (itemInCart) {
          itemInCart.isFreeWithPromotion = true;
        }
      }
    },
    // Supprime un anime du panier
    removeFromCart: (state, action: PayloadAction<number>) => {
      // Réinitialise toutes les isFreeWithPromotion à false avant de supprimer l'item pour éviter les bugs
      state.cart.forEach((item) => (item.isFreeWithPromotion = false));
      // Supprime l'item du panier
      state.cart = state.cart.filter((item) => item.mal_id !== action.payload);

      // Si le panier a plus de 5 items on remet le plus petit item à gratuit
      if (state.cart.length >= 5) {
        const sortedByPrice = [...state.cart].sort((a, b) => a.finalPrice - b.finalPrice);
        state.cart.forEach((item) => (item.isFreeWithPromotion = false));
        const cheapestItem = sortedByPrice[0];
        const itemInCart = state.cart.find((item) => item.mal_id === cheapestItem.mal_id);
        if (itemInCart) {
          itemInCart.isFreeWithPromotion = true;
        }
      } else {
        // Si 5 ou moins d'items on remet tous les items à non gratuit
        state.cart.forEach((item) => (item.isFreeWithPromotion = false));
      }
    },
    // Ajoute un anime aux items possédés
    addToOwnedItems: (state, action: PayloadAction<TypeAnime[]>) => {
      // TODO: Ajouter les items au items possédés
    },
    // Ajoute un anime a l'historique d'achat
    addToBoughtHistory: (state, action: PayloadAction<TypeAnime[]>) => {
      // TODO: Ajouter les items au historique d'achat
    },
    // Modifie le nom d'utilisateur
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    // Modifie l'email
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    // Modifie l'image
    updateImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
    // Modifie la newsletter
    updateNewsletter: (state, action: PayloadAction<boolean>) => {
      state.sendNewsletter = action.payload;
    },
  },
});

export const {
  register,
  login,
  loginWithOAuth,
  logout,
  resetError,
  addToCart,
  removeFromCart,
  addToOwnedItems,
  addToBoughtHistory,
  updateUsername,
  updateEmail,
  updateImage,
  updateNewsletter,
} = userSlice.actions;
export default userSlice.reducer;
