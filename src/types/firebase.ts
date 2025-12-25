// Firebase Database Types

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  lastLoginAt: number;
}

export interface WatchHistory {
  movieSlug: string;
  movieName: string;
  moviePoster: string;
  episodeSlug?: string;
  episodeName?: string;
  currentTime: number; // Thời gian đã xem (giây)
  duration: number; // Tổng thời lượng (giây)
  progress: number; // Tiến độ xem (%)
  watchedAt: number; // Timestamp lần xem cuối
  updatedAt: number; // Timestamp cập nhật
  completed: boolean; // Đã xem xong chưa
  serverIndex?: number; // Server đang xem
}

export interface MovieRating {
  movieSlug: string;
  movieName: string;
  moviePoster?: string;
  rating: number; // 1-10 stars (updated to match 10 scale or 5 scale depending on usage)
  content?: string; // Bình luận
  createdAt: number;
  updatedAt: number;
}

export interface FavoriteMovie {
  movieSlug: string;
  movieName: string;
  moviePoster: string;
  movieYear?: number;
  movieType?: "series" | "single" | "hoathinh" | "tvshows";
  addedAt: number;
}

export interface ChatMessage {
  id?: string;
  movieSlug: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  message: string;
  createdAt: number;
  likes?: number;
  replyTo?: string;
}

export interface MovieComment {
  id?: string;
  movieSlug: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  rating?: number;
  createdAt: number;
  updatedAt?: number;
  likes: number;
  likedBy?: string[];
}

// Database paths
export const DB_PATHS = {
  users: "users",
  watchHistory: "watchHistory",
  ratings: "ratings",
  favorites: "favorites",
  comments: "comments",
  chat: "chat",
  movieStats: "movieStats",
} as const;
