// Type Genre pour représenter un genre d'anime
export interface TypeGenre {
  mal_id: number;
  name: string;
  count: number;
}
export interface TypeAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  approved: boolean;
  titles: {
    type: string;
    title: string;
  }[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: {
        day: number;
        month: number;
        year: number;
      };
      string: string;
    };
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  producers: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  licensors: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  studios: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  explicit_genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  themes: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  demographics: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  relations: {
    relation: string;
    entry: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
  }[];
  theme: {
    openings: string[];
    endings: string[];
  };
  external: {
    name: string;
    url: string;
  }[];
  streaming: {
    name: string;
    url: string;
  }[];
  // Ajouté manuellement pour le prix des animés
  price: number;
  // Ajouté manuellement pour les promotions
  promotion: number | null;
  // Ajouté manuellement pour le prix final calculé en fonction de la promotion
  finalPrice: number;
}
// typage des périodes disponibles pour la recherche
export type Period = "day" | "week" | "month" | "year" | "all";
// typage des paramètres de la fonction fetchAnimes
export interface fetchAnimeParams {
  query?: string;
  genreId?: number;
  period?: Period;
  orderBy?: string;
  sort?: "asc" | "desc";
  limit?: number;
  safe?: boolean;
  status?: string;
  page?: number;
  promotion?: boolean;
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
  error: { register: string | null; login: string | null };
  sendNewsletter: boolean;
  searchHistory: string[];
  cart: any[];
  boughtHistory: any[];
  watchlist: any[];
  ownedItems: any[];
}
export interface GenreState {
  genres: TypeGenre[];
  loading: boolean;
  error: string | null;
}
