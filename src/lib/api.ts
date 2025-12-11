import { API_BASE_URL, API_V1_URL } from './constants';
import type {
  Movie,
  MovieDetailResponse,
  MovieListResponse,
  ApiListResponse,
  Category,
  Country,
} from '@/types';

// Fetch wrapper with error handling
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Get newly updated movies
export async function getNewMovies(page: number = 1): Promise<MovieListResponse> {
  return fetchApi<MovieListResponse>(
    `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`
  );
}

// Get movie detail by slug
export async function getMovieDetail(slug: string): Promise<MovieDetailResponse> {
  return fetchApi<MovieDetailResponse>(`${API_BASE_URL}/phim/${slug}`);
}

// Get movie list by type (phim-bo, phim-le, tv-shows, hoat-hinh)
export async function getMoviesByType(
  type: string,
  page: number = 1,
  limit: number = 24
): Promise<ApiListResponse> {
  return fetchApi<ApiListResponse>(
    `${API_V1_URL}/danh-sach/${type}?page=${page}&limit=${limit}`
  );
}

// Search movies
export async function searchMovies(
  keyword: string,
  page: number = 1,
  limit: number = 24
): Promise<ApiListResponse> {
  return fetchApi<ApiListResponse>(
    `${API_V1_URL}/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`
  );
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetchApi<{ items: Category[] }>(`${API_BASE_URL}/the-loai`);
  return response.items || [];
}

// Get movies by category
export async function getMoviesByCategory(
  slug: string,
  page: number = 1,
  limit: number = 24
): Promise<ApiListResponse> {
  return fetchApi<ApiListResponse>(
    `${API_V1_URL}/the-loai/${slug}?page=${page}&limit=${limit}`
  );
}

// Get all countries
export async function getCountries(): Promise<Country[]> {
  const response = await fetchApi<{ items: Country[] }>(`${API_BASE_URL}/quoc-gia`);
  return response.items || [];
}

// Get movies by country
export async function getMoviesByCountry(
  slug: string,
  page: number = 1,
  limit: number = 24
): Promise<ApiListResponse> {
  return fetchApi<ApiListResponse>(
    `${API_V1_URL}/quoc-gia/${slug}?page=${page}&limit=${limit}`
  );
}

// Get movies by year
export async function getMoviesByYear(
  year: number,
  page: number = 1,
  limit: number = 24
): Promise<ApiListResponse> {
  return fetchApi<ApiListResponse>(
    `${API_V1_URL}/nam/${year}?page=${page}&limit=${limit}`
  );
}

// Get theater/cinema movies (phim chiếu rạp)
export async function getTheaterMovies(
  page: number = 1,
  limit: number = 24
): Promise<ApiListResponse> {
  // Phim chiếu rạp thường là phim lẻ mới nhất với chất lượng cao
  return fetchApi<ApiListResponse>(
    `${API_V1_URL}/danh-sach/phim-le?page=${page}&limit=${limit}`
  );
}

// Get dubbed movies (phim thuyết minh)
// Thuyết minh movies typically have "Thuyết Minh" in the episode name or movie info
export async function getDubbedMovies(
  page: number = 1,
  limit: number = 24
): Promise<ApiListResponse> {
  // Use Vietnam country as many dubbed movies are categorized there
  // Or search for "thuyet minh" keyword
  try {
    // First try searching for thuyết minh
    const searchResult = await fetchApi<ApiListResponse>(
      `${API_V1_URL}/tim-kiem?keyword=thuyết minh&page=${page}&limit=${limit}`
    );
    if (searchResult.data && searchResult.data.items && searchResult.data.items.length > 0) {
      return searchResult;
    }
    // Fallback to Vietnamese movies which often have dubbed versions
    return fetchApi<ApiListResponse>(
      `${API_V1_URL}/quoc-gia/viet-nam?page=${page}&limit=${limit}`
    );
  } catch (error) {
    // Fallback to Vietnamese movies
    return fetchApi<ApiListResponse>(
      `${API_V1_URL}/quoc-gia/viet-nam?page=${page}&limit=${limit}`
    );
  }
}

// Helper to get full image URL
export function getFullImageUrl(path: string | undefined): string {
  if (!path) return '/placeholder-movie.png';
  if (path.startsWith('http')) return path;
  return `https://phimimg.com/${path}`;
}
