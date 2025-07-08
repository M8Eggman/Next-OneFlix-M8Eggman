// Type Genre pour représenter un genre d'anime
export interface TypeGenre {
  mal_id: number;
  name: string;
  count: number;
}

// Type User pour représenter l'état de l'utilisateur
export interface TypeUser {
  username: string | null;
  image: string | null;
  password?: string;
  email: string;
  isAuthenticated?: boolean;
  searchHistory: string[];
  cart: any[];
  boughtHistory: any[];
  watchlist: any[];
  ownedItems: any[];
}
