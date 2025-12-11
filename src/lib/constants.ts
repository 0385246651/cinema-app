export const API_BASE_URL = 'https://phimapi.com';
export const API_V1_URL = 'https://phimapi.com/v1/api';
export const CDN_IMAGE_URL = 'https://phimimg.com';

export const SITE_CONFIG = {
  name: 'PhimHay',
  description: 'Website xem phim chất lượng cao với giao diện hiện đại',
  url: 'https://phimhay.com',
};

export const MOVIE_TYPES = {
  'phim-bo': { name: 'Phim Bộ', icon: 'tv' },
  'phim-le': { name: 'Phim Lẻ', icon: 'film' },
  'tv-shows': { name: 'TV Shows', icon: 'monitor' },
  'hoat-hinh': { name: 'Hoạt Hình', icon: 'smile' },
} as const;

export const SORT_OPTIONS = [
  { value: 'modified.time', label: 'Mới cập nhật' },
  { value: '_id', label: 'Mới nhất' },
  { value: 'year', label: 'Năm phát hành' },
] as const;

export const QUALITY_COLORS: Record<string, string> = {
  'FHD': 'badge-primary',
  'HD': 'badge-success',
  'SD': 'badge-warning',
  'CAM': 'badge-warning',
};

export const NAV_ITEMS = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Phim Bộ', href: '/danh-sach/phim-bo' },
  { name: 'Phim Lẻ', href: '/danh-sach/phim-le' },
  { name: 'TV Shows', href: '/danh-sach/tv-shows' },
  { name: 'Hoạt Hình', href: '/danh-sach/hoat-hinh' },
  { name: 'Thuyết Minh', href: '/thuyet-minh' },
];
