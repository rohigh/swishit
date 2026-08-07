'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';
import logoImg from '../public/img/logo - swishit-01.png';

// Basic Icons
const RollingLink = ({ href, children }) => (
  <Link href={href} className="group relative overflow-hidden h-6 block">
    <div className="flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2">
      <span className="h-6 flex items-center leading-none">{children}</span>
      <span className="h-6 flex items-center leading-none">{children}</span>
    </div>
  </Link>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();
  const { cartCount, setIsCartOpen } = useCart();

  // Cmd+K or Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl z-50">
      <div className="bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] rounded-full px-5 md:px-8 h-16 grid grid-cols-3 items-center border border-gray-100">
        
        {/* Col 1 (left): Mobile Menu Button + Desktop Nav Links */}
        <div className="flex items-center gap-6 text-[0.8125rem] font-body text-text font-medium">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden hover:opacity-60 transition-opacity flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <RollingLink href="/shop">
              <span className="flex items-center gap-1">Shop <span className="text-[0.625rem] text-gray-400">+</span></span>
            </RollingLink>
            <RollingLink href="/about">About</RollingLink>
            <RollingLink href="/contact">Contact</RollingLink>
            {user?.email === 'swishitt@gmail.com' && (
              <RollingLink href="/admin">
                <span className="text-[#F0A93B] font-bold">Admin</span>
              </RollingLink>
            )}
          </div>

        </div>

        {/* Col 2 (center): Logo — perfectly centered by grid, no absolute needed */}
        <div className="flex items-center justify-center h-full">
          <Link href="/" className="hover:opacity-70 transition-opacity flex items-center justify-center">
            <Image 
              src={logoImg} 
              alt="Swishit Logo" 
              height={32} 
              className="object-contain h-8 w-auto max-w-full"
              sizes="32px"
              priority
            />
          </Link>
        </div>

        {/* Col 3 (right): Icons — justified to end */}
        <div className="flex items-center justify-end gap-5 text-text">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hover:opacity-60 transition-opacity flex items-center"
            title="Search"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <Link href={user ? "/account" : "/login"} className="hover:opacity-60 transition-opacity">
            <UserIcon />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="hover:opacity-60 transition-opacity relative flex items-center"
            aria-label="Open Cart"
          >
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#155E78] text-white text-[0.625rem] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

    </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-[#F5F3EF] md:hidden flex flex-col items-center justify-center gap-8 text-2xl font-body text-text font-medium transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">Shop</Link>
        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">About</Link>
        <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">Contact</Link>
        {user?.email === 'swishitt@gmail.com' && (
          <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity text-[#F0A93B] font-bold">Admin Dashboard</Link>
        )}
        <Link href={user ? "/account" : "/login"} onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">
          {user ? "My Account" : "Log In"}
        </Link>
        <Link 
          href="/checkout" 
          onClick={() => {
            setIsMenuOpen(false);
            setIsCartOpen(true);
          }} 
          className="hover:opacity-70 transition-opacity flex items-center gap-2"
        >
          View Bag ({cartCount})
        </Link>
      </div>

      {/* Global Product Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
