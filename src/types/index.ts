// Type Genre pour représenter un genre d'anime
export interface TypeGenre {
  mal_id: number;
  name: string;
  count: number;
}
export interface TypeAnime {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
    };
  };
}
export interface animePagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
}
// Type des initialState des slices
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
export interface AnimeState {
  all: TypeAnime[];
  naruto: TypeAnime[];
  popular: TypeAnime[];
  new: TypeAnime[];
  loadingAll: boolean;
  loadingNaruto: boolean;
  loadingPopular: boolean;
  loadingNew: boolean;
  errorAll: string | null;
  errorNaruto: string | null;
  errorPopular: string | null;
  errorNew: string | null;
  pageAll: number;
  pageNaruto: number;
  pagePopular: number;
  pageNew: number;
  allPagination: animePagination | null;
  narutoPagination: animePagination | null;
  popularPagination: animePagination | null;
  newPagination: animePagination | null;
}
export interface GenreState {
  genres: TypeGenre[];
  loading: boolean;
  error: string | null;
}
