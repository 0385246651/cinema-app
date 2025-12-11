'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Home,
  Film,
  Tv,
  MonitorPlay,
  Smile,
  ChevronDown,
  Ticket,
  Sparkles,
  Volume2,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import { gsap } from 'gsap';
import { UserMenu, AuthModal } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';

const menuIcons: Record<string, React.ReactNode> = {
  'Trang chủ': <Home className="w-4 h-4" />,
  'Phim Bộ': <Tv className="w-4 h-4" />,
  'Phim Lẻ': <Film className="w-4 h-4" />,
  'TV Shows': <MonitorPlay className="w-4 h-4" />,
  'Hoạt Hình': <Smile className="w-4 h-4" />,
  'Thuyết Minh': <Volume2 className="w-4 h-4" />,
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-[#050510]/90 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/20" 
          : "bg-gradient-to-b from-black/50 to-transparent"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                  PhimHay
                </span>
                <span className="block text-[10px] text-white/40 tracking-widest uppercase">Premium Movies</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
                    'transition-all duration-300',
                    pathname === item.href
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {menuIcons[item.name]}
                  <span>{item.name}</span>
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-500 rounded-full" />
                  )}
                </Link>
              ))}

              {/* Dropdown for Categories */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300">
                  <span>Thể loại</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="w-72 p-3 rounded-2xl bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { name: 'Hành Động', slug: 'hanh-dong', icon: '💥' },
                        { name: 'Tình Cảm', slug: 'tinh-cam', icon: '💕' },
                        { name: 'Hài Hước', slug: 'hai-huoc', icon: '😄' },
                        { name: 'Kinh Dị', slug: 'kinh-di', icon: '👻' },
                        { name: 'Viễn Tưởng', slug: 'vien-tuong', icon: '🚀' },
                        { name: 'Cổ Trang', slug: 'co-trang', icon: '⚔️' },
                      ].map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/the-loai/${cat.slug}`}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <Link
                        href="/the-loai"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
                      >
                        Xem tất cả thể loại
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown for Countries */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300">
                  <span>Quốc gia</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="w-72 p-3 rounded-2xl bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { name: 'Trung Quốc', slug: 'trung-quoc', flag: '🇨🇳' },
                        { name: 'Hàn Quốc', slug: 'han-quoc', flag: '🇰🇷' },
                        { name: 'Nhật Bản', slug: 'nhat-ban', flag: '🇯🇵' },
                        { name: 'Âu Mỹ', slug: 'au-my', flag: '🇺🇸' },
                        { name: 'Thái Lan', slug: 'thai-lan', flag: '🇹🇭' },
                        { name: 'Việt Nam', slug: 'viet-nam', flag: '🇻🇳' },
                      ].map((country) => (
                        <Link
                          key={country.slug}
                          href={`/quoc-gia/${country.slug}`}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span>{country.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <Link
                        href="/quoc-gia"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
                      >
                        Xem tất cả quốc gia
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & User & Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-200',
                  showSearch
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15]'
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu / Login Button */}
              {!authLoading && (
                user ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Đăng nhập
                  </button>
                )
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15] transition-all duration-200"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 border-t border-white/[0.1]',
            showSearch ? 'max-h-20' : 'max-h-0 border-transparent'
          )}
        >
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên phim cần tìm..."
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/[0.12] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-all duration-300',
          isOpen ? 'visible' : 'invisible'
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-[280px] bg-[#0a0a1a]/95 backdrop-blur-xl border-l border-white/[0.1]',
            'transform transition-transform duration-300',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="p-4 border-b border-white/[0.1] flex items-center justify-between">
            <span className="text-lg font-semibold gradient-text">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-white/[0.08] text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                {menuIcons[item.name]}
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-white/[0.1]">
              <p className="px-4 py-2 text-xs uppercase tracking-wider text-white/40">
                Thể loại
              </p>
              {[
                { name: 'Hành Động', slug: 'hanh-dong' },
                { name: 'Tình Cảm', slug: 'tinh-cam' },
                { name: 'Hài Hước', slug: 'hai-huoc' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/the-loai/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/the-loai"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-violet-400 hover:bg-white/[0.05] rounded-lg"
              >
                Xem tất cả thể loại →
              </Link>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.1]">
              <p className="px-4 py-2 text-xs uppercase tracking-wider text-white/40">
                Quốc gia
              </p>
              {[
                { name: 'Trung Quốc', slug: 'trung-quoc' },
                { name: 'Hàn Quốc', slug: 'han-quoc' },
                { name: 'Âu Mỹ', slug: 'au-my' },
              ].map((country) => (
                <Link
                  key={country.slug}
                  href={`/quoc-gia/${country.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  {country.name}
                </Link>
              ))}
              <Link
                href="/quoc-gia"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-violet-400 hover:bg-white/[0.05] rounded-lg"
              >
                Xem tất cả quốc gia →
              </Link>
            </div>

            {/* Mobile Login Button */}
            {!authLoading && !user && (
              <div className="pt-4 mt-4 border-t border-white/[0.1]">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium"
                >
                  Đăng nhập / Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}
