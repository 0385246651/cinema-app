import { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { GlassCard } from '@/components/ui';
import { Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thể loại phim | PhimHay',
  description: 'Danh sách thể loại phim - Hành động, tình cảm, hài hước, kinh dị và nhiều thể loại khác.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
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
            <GlassCard className="p-4 h-full flex flex-col items-center justify-center text-center min-h-[100px] group">
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
