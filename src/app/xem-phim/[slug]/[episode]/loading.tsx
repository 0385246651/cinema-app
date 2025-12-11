import { Skeleton } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Video Player Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,350px] gap-6">
          {/* Main Content */}
          <div className="space-y-4">
            {/* Player Skeleton */}
            <Skeleton className="aspect-video rounded-2xl" />

            {/* Controls Skeleton */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.1]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-16 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>

            {/* Server Skeleton */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.1]">
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-32 rounded-lg" />
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.1]">
              <div className="flex gap-4">
                <Skeleton className="w-24 aspect-[2/3] rounded-lg hidden sm:block" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="xl:order-2">
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] sticky top-24">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
