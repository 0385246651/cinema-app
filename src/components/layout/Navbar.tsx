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
  Users,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import { getCategories, getCountries } from '@/lib/api';
import type { Category, Country } from '@/types';
import { UserMenu, AuthModal } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { Logo } from '@/components/ui';

const menuIcons: Record<string, React.ReactNode> = {
  'Trang chủ': <Home className="w-4 h-4" />,
  'Phim Bộ': <Tv className="w-4 h-4" />,
  'Phim Lẻ': <Film className="w-4 h-4" />,
  'TV Shows': <MonitorPlay className="w-4 h-4" />,
  'Hoạt Hình': <Smile className="w-4 h-4" />,
  'Chiếu Rạp': <Ticket className="w-4 h-4" />,
  'Thuyết Minh': <Volume2 className="w-4 h-4" />,
};

const shortNames: Record<string, string> = {
  'Trang chủ': 'Home',
  'Phim Bộ': 'P.Bộ',
  'Phim Lẻ': 'P.Lẻ',
  'TV Shows': 'TV',
  'Hoạt Hình': 'Anime',
  'Chiếu Rạp': 'Rạp',
  'Thuyết Minh': 'T.Minh',
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
  const [mounted, setMounted] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, counts] = await Promise.all([
          getCategories(),
          getCountries()
        ]);
        setCategories(cats);
        setCountries(counts);
      } catch (error) {
        console.error('Failed to fetch navbar data:', error);
      }
    };
    fetchData();
  }, []);

  // Mark as mounted (client-side only) to avoid hydration mismatch
  // Also set a timeout to prevent infinite loading skeleton
  useEffect(() => {
    setMounted(true);

    // If auth is still loading after 2 seconds, show login button anyway
    const timeout = setTimeout(() => {
      setAuthTimeout(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
          ? "bg-[#050510]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-gradient-to-b from-black/60 to-transparent"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 2xl:gap-2 ml-4 2xl:ml-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.name}
                  className={cn(
                    'relative flex items-center gap-1.5 p-2.5 2xl:px-3 2xl:py-2 rounded-xl text-sm font-medium',
                    'transition-all duration-300',
                    pathname === item.href
                      ? 'text-white bg-white/10 shadow-lg shadow-white/5'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {menuIcons[item.name]}
                  <span className="hidden 2xl:inline">{item.name}</span>
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  )}
                </Link>
              ))}

              {/* Dropdown for Categories */}
              <div className="relative group">
                <button className="flex items-center gap-1 p-2.5 2xl:px-3 2xl:py-2 rounded-xl text-xs 2xl:text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300" title="Thể loại">
                  <span>T.Loại</span>
                  <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="w-[600px] p-4 rounded-2xl bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 pointer-events-none" />
                    <div className="relative grid grid-cols-4 gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/the-loai/${cat.slug}`}
                          className="px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200 truncate text-center hover:scale-105"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown for Countries */}
              <div className="relative group">
                <button className="flex items-center gap-1 p-2.5 2xl:px-3 2xl:py-2 rounded-xl text-xs 2xl:text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300" title="Quốc gia">
                  <span>Q.Gia</span>
                  <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="w-[450px] p-4 rounded-2xl bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
                    <div className="grid grid-cols-3 gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                      {countries.map((country) => (
                        <Link
                          key={country.slug}
                          href={`/quoc-gia/${country.slug}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200 truncate"
                        >
                          <span className="truncate">{country.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown for Years */}
              <div className="relative group">
                <button className="flex items-center gap-1 p-2.5 2xl:px-3 2xl:py-2 rounded-xl text-xs 2xl:text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300" title="Năm">
                  <span>Năm</span>
                  <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="w-[320px] p-2 rounded-xl bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
                    <div className="grid grid-cols-4 gap-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {Array.from({ length: 56 }, (_, i) => 2025 - i).map((year) => (
                        <Link
                          key={year}
                          href={`/nam/${year}`}
                          className="flex items-center justify-center py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                        >
                          <span>{year}</span>
                        </Link>
                      ))}
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
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                    : 'bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15]'
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu / Login Button */}
              <div className="hidden sm:block">
                {user && !authLoading ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105 transition-all duration-300"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>

              {/* Mobile Menu Button - Styled */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gradient-to-br from-white/[0.1] to-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.15] transition-all duration-300"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 border-t border-white/[0.05] bg-[#050510]/95 backdrop-blur-xl',
            showSearch ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 border-transparent'
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
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer - Premium Design */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden overflow-hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-[#0a0a1a] shadow-2xl border-l border-white/10 flex flex-col',
            'transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Header Background Decoration - Removed blur blob for performance */}
          {/* <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" /> */}

          {/* Menu Header */}
          <div className="relative flex-none p-6 border-b border-white/10 flex items-center justify-between z-10 bg-[#0a0a1a]/50 backdrop-blur-sm">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Menu
              </h2>
              <p className="text-xs text-white/40 font-medium tracking-wider uppercase mt-1">Danh mục</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content - Fixed max height */}
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-8 space-y-6 custom-scrollbar relative z-10 max-h-[calc(100vh-120px)]">
            {/* User Profile Section - Mobile Exclusive Design */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] overflow-hidden">
              {user ? (
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-violet-500/30">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-violet-600 flex items-center justify-center text-xl font-bold text-white">
                          {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">
                        {user.displayName || 'Thành viên'}
                      </h3>
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      href="/tai-khoan"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium group"
                    >
                      <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Smile className="w-4 h-4" />
                      </span>
                      Tài khoản
                    </Link>
                    <Link
                      href="/yeu-thich"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium group"
                    >
                      <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      Yêu thích
                    </Link>
                    <Link
                      href="/lich-su"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium group"
                    >
                      <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <MonitorPlay className="w-4 h-4" />
                      </span>
                      Lịch sử
                    </Link>
                    <Link
                      href="/danh-gia"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium group"
                    >
                      <span className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                        <Star className="w-4 h-4" />
                      </span>
                      Đánh giá của tôi
                    </Link>
                    <Link
                      href="/tin-nhan"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium group"
                    >
                      <span className="p-1.5 rounded-lg bg-green-500/20 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                      Tin nhắn
                    </Link>
                    <Link
                      href="/ban-be"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium group"
                    >
                      <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        <Users className="w-4 h-4" />
                      </span>
                      Bạn bè
                    </Link>
                    <button
                      onClick={() => {
                        auth.signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium w-full text-left group"
                    >
                      <span className="p-1.5 rounded-lg bg-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </span>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold shadow-lg shadow-violet-600/20"
                  >
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Smile className="w-5 h-5" />
                    </span>
                    Đăng nhập / Đăng ký
                  </button>
                  <p className="text-center text-xs text-white/40 mt-3">
                    Đăng nhập để lưu phim yêu thích & bình luận
                  </p>
                </div>
              )}
            </div>

            {/* Main Links */}
            <div className="space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300",
                    pathname === item.href
                      ? "bg-gradient-to-r from-violet-600/20 to-transparent text-white border-l-2 border-violet-500"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    pathname === item.href ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-white/50"
                  )}>
                    {menuIcons[item.name]}
                  </span>
                  <span className="font-medium text-[15px]">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Categories Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Thể loại
                </h3>
                <Link href="/the-loai" onClick={() => setIsOpen(false)} className="text-[11px] font-medium text-violet-400 hover:text-violet-300 uppercase tracking-wide">
                  Xem tất cả
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Hành Động', slug: 'hanh-dong' },
                  { name: 'Tình Cảm', slug: 'tinh-cam' },
                  { name: 'Hoạt Hình', slug: 'hoat-hinh' },
                  { name: 'Kinh Dị', slug: 'kinh-di' },
                  { name: 'Cổ Trang', slug: 'co-trang' },
                  { name: 'Tâm Lý', slug: 'tam-ly' },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/the-loai/${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-white/60 hover:text-white hover:border-violet-500/30 transition-all text-center truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Countries Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Quốc gia
                </h3>
                <Link href="/quoc-gia" onClick={() => setIsOpen(false)} className="text-[11px] font-medium text-violet-400 hover:text-violet-300 uppercase tracking-wide">
                  Xem tất cả
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Trung Quốc', slug: 'trung-quoc', flag: '🇨🇳' },
                  { name: 'Hàn Quốc', slug: 'han-quoc', flag: '🇰🇷' },
                  { name: 'Âu Mỹ', slug: 'au-my', flag: '🇺🇸' },
                  { name: 'Nhật Bản', slug: 'nhat-ban', flag: '🇯🇵' },
                  { name: 'Thái Lan', slug: 'thai-lan', flag: '🇹🇭' },
                  { name: 'Việt Nam', slug: 'viet-nam', flag: '🇻🇳' },
                ].map((country) => (
                  <Link
                    key={country.slug}
                    href={`/quoc-gia/${country.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-white/60 hover:text-white hover:border-violet-500/30 transition-all font-medium"
                  >
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Years Section - Reduced */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Năm phát hành
                </h3>
                <Link href="/nam" onClick={() => setIsOpen(false)} className="text-[11px] font-medium text-violet-400 hover:text-violet-300 uppercase tracking-wide">
                  Xem tất cả
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {[2025, 2024, 2023, 2022, 2021, 2020].map((year) => (
                  <Link
                    key={year}
                    href={`/nam/${year}`}
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-white/60 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all font-medium"
                  >
                    {year}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Info */}
            <div className="pt-6 mt-6 border-t border-white/[0.05] text-center">
              <Logo className="justify-center mb-2" showText={false} />
              <p className="text-xs text-white/30">
                © 2024 CinemaHub. <br /> Premium Movies Experience.
              </p>
            </div>
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
