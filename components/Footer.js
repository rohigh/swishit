'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoImg from '../public/img/logo - swishit-01.png';

// Simple SVGs for Social Icons
const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
  </svg>
);



const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Our Products', href: '/shop' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <footer className="w-full bg-[#122A33] text-[#FBF7EC] pt-16 md:pt-20 lg:pt-24 pb-10 md:pb-12 px-6 md:px-10 lg:px-20 border-t border-[#1D7E9E]/20 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20 items-start">
          
          {/* ── LEFT COLUMN: Tagline, Newsletter Signup & Visual Card ── */}
          <div className="md:col-span-1 lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Heading Tagline */}
              <h2 className="font-heading text-fluid-3xl text-[#FBF7EC] font-normal leading-[1.1] mb-8 tracking-tight">
                Crafting Dews <br />
                <span className="italic font-serif text-[#F0A93B]">Built to Last</span>
              </h2>

              {/* Newsletter Input */}
              <form onSubmit={handleSubscribe} className="relative flex items-center bg-[#155E78] rounded-full p-1.5 pl-6 max-w-md w-full mb-10 border border-[#5AB8D6]/20 focus-within:border-[#5AB8D6]/50 transition-colors">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="bg-transparent text-[#FBF7EC] placeholder:text-[#5AB8D6]/60 text-sm focus:outline-none w-full font-body pr-4"
                  required
                />
                <button 
                  type="submit"
                  className="w-10 h-10 shrink-0 rounded-full bg-[#F0A93B] text-text flex items-center justify-center font-bold text-lg hover:bg-[#F5C06A] transition-colors cursor-pointer shadow-md"
                  aria-label="Subscribe"
                >
                  &rarr;
                </button>
              </form>

              {subscribed && (
                <p className="text-xs text-[#F0A93B] font-mono -mt-6 mb-8 animate-fadeIn">
                  ✓ Thanks for subscribing! Limited drop invites sent.
                </p>
              )}
            </div>

            {/* Visual Feature Card */}
            <div className="relative w-full max-w-md h-44 sm:h-52 md:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-2xl border border-[#5AB8D6]/20 group mt-4">
              <Image 
                src="/img/blue-nobg.jpeg" 
                alt="Swishit Signature Bottle" 
                fill 
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122A33] via-[#122A33]/40 to-transparent flex items-end p-6">
                <div>
                  <span className="text-[0.625rem] font-mono uppercase tracking-widest text-[#F0A93B] block mb-1">
                    Zero Waste Design
                  </span>
                  <p className="font-body text-sm font-medium text-[#FBF7EC]/90">
                    Glass-feel refillable pump bottle engineered for infinite use.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Navigation Links, Brand Logo & Socials ── */}
          <div className="md:col-span-1 lg:col-span-7 flex flex-col justify-between h-full pt-2">
            
            {/* Links List with Arrows */}
            <div className="w-full divide-y divide-[#5AB8D6]/15 border-t border-b border-[#5AB8D6]/15 mb-12">
              {navLinks.map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href}
                  className="py-4 flex items-center justify-between text-base md:text-lg font-body text-[#5AB8D6] hover:text-[#FBF7EC] transition-colors group cursor-pointer"
                >
                  <span className="font-normal tracking-wide">{link.label}</span>
                  <span className="text-[#5AB8D6]/60 group-hover:text-[#F0A93B] group-hover:translate-x-1 transition-all duration-300">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>

            {/* Brand Logo */}
            <div className="my-6">
              <Image 
                src={logoImg} 
                alt="Swishit Logo" 
                height={120} 
                sizes="(max-width: 768px) 120px, (max-width: 1024px) 160px, 216px"
                className="h-16 md:h-20 lg:h-28 xl:h-36 w-auto max-w-full object-contain brightness-0 invert opacity-95"
                priority
              />
            </div>

            {/* Social Icons Section */}
            <div className="mt-8">
              <span className="text-[0.625rem] font-mono tracking-widest text-[#5AB8D6]/70 uppercase block mb-4">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-[#5AB8D6]/20 flex items-center justify-center text-[#5AB8D6] hover:text-[#F0A93B] hover:border-[#F0A93B] transition-colors">
                  <InstagramIcon />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-[#5AB8D6]/20 flex items-center justify-center text-[#5AB8D6] hover:text-[#F0A93B] hover:border-[#F0A93B] transition-colors">
                  <LinkedinIcon />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#5AB8D6]/20 flex items-center justify-center text-[#5AB8D6] hover:text-[#F0A93B] hover:border-[#F0A93B] transition-colors">
                  <GlobeIcon />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* ── BOTTOM COPYRIGHT & LEGAL BAR ── */}
        <div className="pt-8 mt-12 md:mt-16 lg:mt-20 border-t border-[#5AB8D6]/15 flex flex-col md:flex-row items-center justify-between text-xs text-[#5AB8D6]/80 font-mono gap-4 text-center md:text-left">
          <div>
            &copy; {new Date().getFullYear()} Swish It Pvt. Ltd. All rights reserved. &bull; The Standard for Effortless Clean.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#FBF7EC] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FBF7EC] transition-colors">Terms of Use</a>
            <a href="#faq" className="hover:text-[#FBF7EC] transition-colors">FAQ</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
