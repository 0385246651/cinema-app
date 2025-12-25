export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  type?: string;
  sub_docquyen?: boolean;
  chipiurap?: boolean;
  time?: string;
  episode_current?: string;
  quality?: string;
  lang?: string;
  category?: Category[];
  country?: Country[];
  tmdb?: {
    type: string;
    id: string;
    season: number;
    vote_average: number;
  };
  imdb?: {
    id: string | null;
  };
  modified?: {
    time: string;
  };
}

export interface MovieDetail {
  movie: {
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    content: string;
    type: "series" | "single" | "hoathinh" | "tvshows";
    status: "ongoing" | "completed";
    poster_url: string;
    thumb_url: string;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    year: number;
    actor: string[];
    director: string[];
    category: Category[];
    country: Country[];
    chieurap: boolean;
    sub_docquyen: boolean;
    notify: string;
    showtimes: string;
    view: number;
    tmdb?: {
      type: string;
      id: string;
      season: number;
      vote_average: number;
    };
    imdb?: {
      id: string | null;
    };
  };
  episodes: Episode[];
}

export interface Episode {
  server_name: string;
  server_data: EpisodeData[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface MovieListResponse {
  status: boolean;
  msg: string;
  items: Movie[];
  pagination: Pagination;
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail["movie"];
  episodes: Episode[];
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiListResponse {
  status: string;
  msg: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
      og_url: string;
    };
    breadCrumb: Array<{
      name: string;
      slug?: string;
      isCurrent: boolean;
      position: number;
    }>;
    titlePage: string;
    items: Movie[];
    params: {
      type_slug: string;
      filterCategory: string[];
      filterCountry: string[];
      filterYear: string;
      filterType: string;
      sortField: string;
      sortType: string;
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface CategoryListResponse {
  status: boolean;
  items: Category[];
}

export interface CountryListResponse {
  status: boolean;
  items: Country[];
}
