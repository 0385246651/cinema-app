import Link from 'next/link';
import { Home, Film } from 'lucide-react';
import { GlassButton } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <span className="text-[150px] md:text-[200px] font-bold opacity-5 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center animate-pulse">
              <Film className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          <span className="gradient-text">Không tìm thấy trang</span>
        </h1>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <GlassButton variant="primary" size="lg">
              <Home className="w-5 h-5" />
              Về trang chủ
            </GlassButton>
          </Link>
          <Link href="/tim-kiem">
            <GlassButton variant="default" size="lg">
              Tìm kiếm phim
            </GlassButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
