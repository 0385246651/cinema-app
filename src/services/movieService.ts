import {
  ref,
  set,
  get,
  remove,
  query,
  orderByChild,
  limitToLast,
  onValue,
  off,
} from "firebase/database";
import { database } from "@/lib/firebase";
import {
  WatchHistory,
  FavoriteMovie,
  MovieRating,
  DB_PATHS,
} from "@/types/firebase";

// ============================================
// WATCH HISTORY SERVICES
// ============================================

/**
 * Lưu/cập nhật tiến độ xem phim
 * Tự động cập nhật mỗi 10 giây hoặc khi pause/close
 */
export async function saveWatchProgress(
  userId: string,
  data: Omit<WatchHistory, "watchedAt" | "updatedAt">
): Promise<void> {
  const historyRef = ref(
    database,
    `${DB_PATHS.watchHistory}/${userId}/${data.movieSlug}${
      data.episodeSlug ? "_" + data.episodeSlug : ""
    }`
  );

  const now = Date.now();
  await set(historyRef, {
    ...data,
    watchedAt: now,
    updatedAt: now,
    completed: data.progress >= 90, // Xem >= 90% coi như hoàn thành
  });
}

/**
 * Lấy lịch sử xem của một phim cụ thể
 */
export async function getWatchProgress(
  userId: string,
  movieSlug: string,
  episodeSlug?: string
): Promise<WatchHistory | null> {
  const key = episodeSlug ? `${movieSlug}_${episodeSlug}` : movieSlug;
  const historyRef = ref(database, `${DB_PATHS.watchHistory}/${userId}/${key}`);

  const snapshot = await get(historyRef);
  return snapshot.exists() ? snapshot.val() : null;
}

/**
 * Lấy toàn bộ lịch sử xem phim (sắp xếp theo thời gian)
 */
export async function getWatchHistory(
  userId: string,
  limit: number = 20
): Promise<WatchHistory[]> {
  const historyRef = ref(database, `${DB_PATHS.watchHistory}/${userId}`);
  const historyQuery = query(
    historyRef,
    orderByChild("watchedAt"),
    limitToLast(limit)
  );

  const snapshot = await get(historyQuery);

  if (!snapshot.exists()) return [];

  const history: WatchHistory[] = [];
  snapshot.forEach((child) => {
    history.push(child.val());
  });

  // Sắp xếp mới nhất lên trước
  return history.reverse();
}

/**
 * Xóa một mục trong lịch sử
 */
export async function removeFromHistory(
  userId: string,
  movieSlug: string,
  episodeSlug?: string
): Promise<void> {
  const key = episodeSlug ? `${movieSlug}_${episodeSlug}` : movieSlug;
  const historyRef = ref(database, `${DB_PATHS.watchHistory}/${userId}/${key}`);
  await remove(historyRef);
}

/**
 * Xóa toàn bộ lịch sử
 */
export async function clearWatchHistory(userId: string): Promise<void> {
  const historyRef = ref(database, `${DB_PATHS.watchHistory}/${userId}`);
  await remove(historyRef);
}

// ============================================
// FAVORITES SERVICES
// ============================================

/**
 * Thêm phim vào yêu thích
 */
export async function addToFavorites(
  userId: string,
  movie: Omit<FavoriteMovie, "addedAt">
): Promise<void> {
  const favRef = ref(
    database,
    `${DB_PATHS.favorites}/${userId}/${movie.movieSlug}`
  );
  await set(favRef, {
    ...movie,
    addedAt: Date.now(),
  });
}

/**
 * Xóa phim khỏi yêu thích
 */
export async function removeFromFavorites(
  userId: string,
  movieSlug: string
): Promise<void> {
  const favRef = ref(database, `${DB_PATHS.favorites}/${userId}/${movieSlug}`);
  await remove(favRef);
}

/**
 * Kiểm tra phim có trong yêu thích không
 */
export async function isFavorite(
  userId: string,
  movieSlug: string
): Promise<boolean> {
  const favRef = ref(database, `${DB_PATHS.favorites}/${userId}/${movieSlug}`);
  const snapshot = await get(favRef);
  return snapshot.exists();
}

/**
 * Lấy danh sách phim yêu thích
 */
export async function getFavorites(
  userId: string,
  limit: number = 50
): Promise<FavoriteMovie[]> {
  const favRef = ref(database, `${DB_PATHS.favorites}/${userId}`);
  const favQuery = query(favRef, orderByChild("addedAt"), limitToLast(limit));

  const snapshot = await get(favQuery);

  if (!snapshot.exists()) return [];

  const favorites: FavoriteMovie[] = [];
  snapshot.forEach((child) => {
    favorites.push(child.val());
  });

  return favorites.reverse();
}

// ============================================
// RATINGS SERVICES
// ============================================

/**
 * Đánh giá/review phim
 */
export async function rateMovie(
  userId: string,
  rating: Omit<MovieRating, "createdAt" | "updatedAt">
): Promise<void> {
  const ratingRef = ref(
    database,
    `${DB_PATHS.ratings}/${userId}/${rating.movieSlug}`
  );

  // Check if exists
  const existing = await get(ratingRef);

  await set(ratingRef, {
    ...rating,
    createdAt: existing.exists() ? existing.val().createdAt : Date.now(),
    updatedAt: Date.now(),
  });

  // Update movie stats
  await updateMovieStats(rating.movieSlug, rating.rating);
}

/**
 * Lấy đánh giá của user cho một phim
 */
export async function getUserRating(
  userId: string,
  movieSlug: string
): Promise<MovieRating | null> {
  const ratingRef = ref(database, `${DB_PATHS.ratings}/${userId}/${movieSlug}`);
  const snapshot = await get(ratingRef);
  return snapshot.exists() ? snapshot.val() : null;
}

/**
 * Lấy tất cả đánh giá của user
 */
export async function getUserRatings(userId: string): Promise<MovieRating[]> {
  const ratingsRef = ref(database, `${DB_PATHS.ratings}/${userId}`);
  const snapshot = await get(ratingsRef);

  if (!snapshot.exists()) return [];

  const ratings: MovieRating[] = [];
  snapshot.forEach((child) => {
    ratings.push(child.val());
  });

  return ratings.sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Xóa đánh giá
 */
export async function removeRating(
  userId: string,
  movieSlug: string
): Promise<void> {
  const ratingRef = ref(database, `${DB_PATHS.ratings}/${userId}/${movieSlug}`);
  await remove(ratingRef);
}

// ============================================
// MOVIE STATS (Public)
// ============================================

interface MovieStats {
  totalRatings: number;
  averageRating: number;
  viewCount: number;
}

/**
 * Cập nhật thống kê phim (được gọi khi có đánh giá mới)
 */
async function updateMovieStats(
  movieSlug: string,
  newRating: number
): Promise<void> {
  const statsRef = ref(database, `${DB_PATHS.movieStats}/${movieSlug}`);
  const snapshot = await get(statsRef);

  const current = snapshot.exists()
    ? snapshot.val()
    : { totalRatings: 0, sumRatings: 0, viewCount: 0 };

  await set(statsRef, {
    totalRatings: current.totalRatings + 1,
    sumRatings: (current.sumRatings || 0) + newRating,
    averageRating:
      ((current.sumRatings || 0) + newRating) / (current.totalRatings + 1),
    viewCount: current.viewCount,
  });
}

/**
 * Tăng lượt xem phim
 */
export async function incrementViewCount(movieSlug: string): Promise<void> {
  const statsRef = ref(database, `${DB_PATHS.movieStats}/${movieSlug}`);
  const snapshot = await get(statsRef);

  const current = snapshot.exists()
    ? snapshot.val()
    : { totalRatings: 0, averageRating: 0, viewCount: 0 };

  await set(statsRef, {
    ...current,
    viewCount: (current.viewCount || 0) + 1,
  });
}

/**
 * Lấy thống kê phim
 */
export async function getMovieStats(
  movieSlug: string
): Promise<MovieStats | null> {
  const statsRef = ref(database, `${DB_PATHS.movieStats}/${movieSlug}`);
  const snapshot = await get(statsRef);
  return snapshot.exists() ? snapshot.val() : null;
}

// ============================================
// REALTIME LISTENERS
// ============================================

/**
 * Subscribe to watch history changes
 */
export function subscribeToWatchHistory(
  userId: string,
  callback: (history: WatchHistory[]) => void
): () => void {
  const historyRef = ref(database, `${DB_PATHS.watchHistory}/${userId}`);

  const listener = onValue(historyRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const history: WatchHistory[] = [];
    snapshot.forEach((child) => {
      history.push(child.val());
    });

    callback(history.sort((a, b) => b.watchedAt - a.watchedAt));
  });

  // Return unsubscribe function
  return () => off(historyRef);
}

/**
 * Subscribe to favorites changes
 */
export function subscribeToFavorites(
  userId: string,
  callback: (favorites: FavoriteMovie[]) => void
): () => void {
  const favRef = ref(database, `${DB_PATHS.favorites}/${userId}`);

  const listener = onValue(favRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const favorites: FavoriteMovie[] = [];
    snapshot.forEach((child) => {
      favorites.push(child.val());
    });

    callback(favorites.sort((a, b) => b.addedAt - a.addedAt));
  });

  return () => off(favRef);
}

/**
 * Subscribe to ratings changes
 */
export function subscribeToRatings(
  userId: string,
  callback: (ratings: MovieRating[]) => void
): () => void {
  const ratingsRef = ref(database, `${DB_PATHS.ratings}/${userId}`);

  const listener = onValue(ratingsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const ratings: MovieRating[] = [];
    snapshot.forEach((child) => {
      ratings.push(child.val());
    });

    callback(ratings.sort((a, b) => b.updatedAt - a.updatedAt));
  });

  return () => off(ratingsRef);
}
