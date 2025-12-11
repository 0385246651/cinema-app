import { Skeleton, MovieGridSkeleton } from '@/components/ui';

export default function Loading() {
  return (
    <>
      {/* Hero Skeleton */}
      <div className="relative h-[70vh] min-h-[500px] -mt-16 md:-mt-20 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-16 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-14 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-32 rounded-xl" />
                <Skeleton className="h-12 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {[1, 2, 3].map((i) => (
          <section key={i} className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
            <MovieGridSkeleton count={6} />
          </section>
        ))}
      </div>
    </>
  );
}
