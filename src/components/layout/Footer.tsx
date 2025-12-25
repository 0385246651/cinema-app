import Link from "next/link";
import { Logo } from "@/components/ui";

const genres = [
  { name: "Hành Động", slug: "hanh-dong" },
  { name: "Hài Hước", slug: "hai-huoc" },
  { name: "Chính Kịch", slug: "chinh-kich" },
  { name: "Viễn Tưởng", slug: "vien-tuong" },
  { name: "Lãng Mạn", slug: "tinh-cam" },
  { name: "Kinh Dị", slug: "kinh-di" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-gradient-to-b from-black/50 to-black/80 mt-20">
      {/* Main Footer Content */}
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Xem phim online miễn phí với hàng ngàn bộ phim hot được cập nhật liên tục.
              <br />
              <span className="text-xs mt-2 block opacity-50">
                Ads free - Fast loading - HD Quality
              </span>
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://web.facebook.com/share/19XQdrftXL/?mibextid=wwXIfr&_rdc=1&_rdr"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 36.6 36.6 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
              </a>
              <a
                href="https://github.com/0385246651"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full bg-white/5 hover:bg-[#333] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@nhatcover3870"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full bg-white/5 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">
              Khám phá
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/danh-sach/phim-bo"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Phim Bộ
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-sach/phim-le"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Phim Lẻ
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-sach/tv-shows"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  TV Shows
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-sach/hoat-hinh"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Hoạt Hình
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-sach/phim-chieu-rap"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Chiếu Rạp
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">
              Thể loại
            </h4>
            <ul className="space-y-3">
              {genres.slice(0, 5).map((genre) => (
                <li key={genre.slug}>
                  <Link
                    href={`/the-loai/${genre.slug}`}
                    className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/the-loai"
                  className="text-sm text-violet-400 hover:underline cursor-pointer"
                >
                  Xem tất cả
                </Link>
              </li>
            </ul>
          </div>



          {/* Help/Account */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">
              Trợ giúp
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/yeu-thich"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Phim yêu thích
                </Link>
              </li>
              <li>
                <Link
                  href="/lich-su"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Lịch sử xem
                </Link>
              </li>
              <li>
                <Link
                  href="/tim-kiem"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Tìm kiếm
                </Link>
              </li>
              <li>
                <Link
                  href="/quoc-gia"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Quốc gia
                </Link>
              </li>
              <li>
                <Link
                  href="/nam"
                  className="text-sm text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  Năm phát hành
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
            <p>© {new Date().getFullYear()} CinemaHub. All rights reserved.</p>
            <p className="flex items-center gap-2 text-center">
              Made by <span className="font-semibold text-violet-400">Raiden_Nguyen</span> aka <span className="font-semibold text-violet-400">Hải Bá Bá</span>
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              in Vietnam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
