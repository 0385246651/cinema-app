import React from 'react';
import Link from 'next/link';
import { Film, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.08]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="gradient-text">PhimHay</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Website xem phim chất lượng cao với giao diện hiện đại và thân thiện.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {[
                { name: 'Phim Bộ', href: '/danh-sach/phim-bo' },
                { name: 'Phim Lẻ', href: '/danh-sach/phim-le' },
                { name: 'TV Shows', href: '/danh-sach/tv-shows' },
                { name: 'Hoạt Hình', href: '/danh-sach/hoat-hinh' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Thể loại</h3>
            <ul className="space-y-2">
              {[
                { name: 'Hành Động', slug: 'hanh-dong' },
                { name: 'Tình Cảm', slug: 'tinh-cam' },
                { name: 'Hài Hước', slug: 'hai-huoc' },
                { name: 'Kinh Dị', slug: 'kinh-di' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/the-loai/${cat.slug}`}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quốc gia</h3>
            <ul className="space-y-2">
              {[
                { name: 'Trung Quốc', slug: 'trung-quoc' },
                { name: 'Hàn Quốc', slug: 'han-quoc' },
                { name: 'Nhật Bản', slug: 'nhat-ban' },
                { name: 'Âu Mỹ', slug: 'au-my' },
              ].map((country) => (
                <li key={country.slug}>
                  <Link
                    href={`/quoc-gia/${country.slug}`}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} PhimHay. All rights reserved.
          </p>
          <p className="text-sm text-white/40 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> using Next.js
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <p className="text-xs text-white/30 text-center leading-relaxed">
            Tất cả nội dung của website chỉ mang tính chất giới thiệu. Chúng tôi không lưu trữ
            bất kỳ nội dung nào trên server. Nội dung được tổng hợp từ các nguồn phổ biến trên
            Internet.
          </p>
        </div>
      </div>
    </footer>
  );
}
