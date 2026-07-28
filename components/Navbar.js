'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl z-50">
      <div className="bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] rounded-full px-5 md:px-8 h-16 flex items-center justify-between border border-gray-100">
        
        {/* Left side: Navigation Links & Mobile Menu */}
        <div className="flex items-center gap-6 text-[13px] font-body text-text font-medium">
          
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
              <span className="flex items-center gap-1">Shop <span className="text-[10px] text-gray-400">+</span></span>
            </RollingLink>
            <RollingLink href="/about">About</RollingLink>
            <RollingLink href="/contact">Contact</RollingLink>
          </div>

        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full flex items-center">
          <Link href="/" className="hover:opacity-70 transition-opacity flex items-center justify-center">
            <Image 
              src={logoImg} 
              alt="Swishit Logo" 
              height={32} 
              className="object-contain h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Right side: Icons */}
        <div className="flex items-center gap-5 text-text">
          <button className="hover:opacity-60 transition-opacity">
            <UserIcon />
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <BagIcon />
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
      </div>
    </>
  );
}
