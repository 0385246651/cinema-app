import { MovieGridSkeleton, Skeleton } from '@/components/ui';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Movie Grid */}
      <MovieGridSkeleton count={24} />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
