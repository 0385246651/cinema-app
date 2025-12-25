import { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { GlassCard } from '@/components/ui';
import { Tag } from 'lucide-react';
import { Category } from '@/types';

export const metadata: Metadata = {
  title: 'Thể loại phim | PhimHay',
  description: 'Danh sách thể loại phim - Hành động, tình cảm, hài hước, kinh dị và nhiều thể loại khác.',
};

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'hanh-dong', name: 'Hành Động', slug: 'hanh-dong' },
  { id: 'tinh-cam', name: 'Tình Cảm', slug: 'tinh-cam' },
  { id: 'hai-huoc', name: 'Hài Hước', slug: 'hai-huoc' },
  { id: 'co-trang', name: 'Cổ Trang', slug: 'co-trang' },
  { id: 'tam-ly', name: 'Tâm Lý', slug: 'tam-ly' },
  { id: 'hinh-su', name: 'Hình Sự', slug: 'hinh-su' },
  { id: 'chien-tranh', name: 'Chiến Tranh', slug: 'chien-tranh' },
  { id: 'the-thao', name: 'Thể Thao', slug: 'the-thao' },
  { id: 'vo-thuat', name: 'Võ Thuật', slug: 'vo-thuat' },
  { id: 'vien-tuong', name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { id: 'phieu-luu', name: 'Phiêu Lưu', slug: 'phieu-luu' },
  { id: 'khoa-hoc', name: 'Khoa Học', slug: 'khoa-hoc' },
  { id: 'kinh-di', name: 'Kinh Dị', slug: 'kinh-di' },
  { id: 'am-nhac', name: 'Âm Nhạc', slug: 'am-nhac' },
  { id: 'than-thoai', name: 'Thần Thoại', slug: 'than-thoai' },
  { id: 'tai-lieu', name: 'Tài Liệu', slug: 'tai-lieu' },
  { id: 'gia-dinh', name: 'Gia Đình', slug: 'gia-dinh' },
  { id: 'chinh-kich', name: 'Chính Kịch', slug: 'chinh-kich' },
  { id: 'bi-an', name: 'Bí Ẩn', slug: 'bi-an' },
  { id: 'hoc-duong', name: 'Học Đường', slug: 'hoc-duong' },
  { id: 'kinh-dien', name: 'Kinh Điển', slug: 'kinh-dien' },
];

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  // Use fallback if API returns empty
  if (!categories || categories.length === 0) {
    categories = FALLBACK_CATEGORIES;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Thể loại phim</span>
        </h1>
        <p className="text-white/50">
          Khám phá phim theo thể loại yêu thích của bạn
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category.slug} href={`/the-loai/${category.slug}`}>
            <GlassCard className="p-4 h-full flex flex-col items-center justify-center text-center min-h-[100px] group hover:bg-white/10 transition-all cursor-pointer">
              <Tag className="w-6 h-6 mb-2 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-white/90 group-hover:text-violet-400 transition-colors">
                {category.name}
              </span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
