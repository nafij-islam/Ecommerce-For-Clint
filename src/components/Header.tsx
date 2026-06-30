'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User as UserIcon, Search, Menu, X, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const router = useRouter();
  const { cart, wishlist } = useCart();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState('Free delivery on orders over ৳3000');
  const [storeName, setStoreName] = useState('Rongher Chua Butiks');
  const [logoUrl, setLogoUrl] = useState('/logo.png');

  useEffect(() => {
    // Read search parameter from window safely on client mount
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search).get('search');
      if (query) setSearchQuery(query);
    }

    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setAnnouncement(data.settings.announcementText);
          setStoreName(data.settings.storeName);
          if (data.settings.logoUrl) {
            setLogoUrl(data.settings.logoUrl);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-955/80 backdrop-blur-md border-b border-white/10">
      {/* Announcement Bar */}
      <div className="bg-[#090a1a] py-2 text-center text-xs font-bold tracking-wider text-purple-400 border-b border-white/5">
        {announcement}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="h-10 w-auto object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <span className="font-playfair text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors duration-300">
              {storeName}
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search beautiful dresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-white/15 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-900/60 text-white placeholder-slate-400"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-purple-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation links - Desktop - Exactly 3 Menu Items */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <Link href="/" className="text-slate-300 hover:text-[#a855f7] transition-colors">Home</Link>
            <Link href="/shop" className="text-slate-300 hover:text-[#a855f7] transition-colors">Shop</Link>
            <Link href="/contact" className="text-slate-300 hover:text-[#a855f7] transition-colors">Contact</Link>
          </nav>

          {/* User icons */}
          <div className="flex items-center gap-4">
            {/* Search toggler for mobile */}
            <Link href="/shop" className="md:hidden text-slate-300 hover:text-purple-405">
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link href={user ? "/dashboard/wishlist" : "/wishlist"} className="relative text-slate-300 hover:text-purple-405 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#a855f7] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-slate-300 hover:text-purple-405 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Account / Dashboard Link */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-full text-white transition-all duration-300 shadow-md border border-purple-450/20"
                >
                  {user.role === 'admin' ? (
                    <>
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-4 h-4" />
                      <span className="max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
                    </>
                  )}
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-slate-300 hover:text-purple-405 transition-colors"
                title="Login"
              >
                <UserIcon className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-300 hover:text-purple-405 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950 px-4 py-4 space-y-3 shadow-inner">
          <form onSubmit={handleSearch} className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Search beautiful dresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-white/15 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-900/60 text-white"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col gap-3 font-semibold text-slate-300">
            <Link href="/" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Home</Link>
            <Link href="/shop" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Shop</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
