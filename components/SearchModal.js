'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const SEARCHABLE_PRODUCTS = [
  {
    id: 'ocean',
    name: 'Ocean Garden Hand Dishwash',
    desc: 'Crisp marine mist. Plant-powered formula that leaves dishes sparkling.',
    scent: 'Ocean Garden',
    price: 135,
    badge: 'Best Seller',
    image: '/img/blue-nobg.jpeg',
    tags: ['ocean', 'marine', 'dishwash', 'blue', 'crisp', 'liquid'],
  },
  {
    id: 'lime',
    name: 'Lime Lush Hand Dishwash',
    desc: 'Zesty citrus leaf. Cuts grease instantly while keeping hands soft.',
    scent: 'Lime Lush',
    price: 135,
    badge: 'Popular',
    image: '/img/green-nobg.jpeg',
    tags: ['lime', 'citrus', 'green', 'fresh', 'lush', 'liquid'],
  },
  {
    id: 'lemon',
    name: 'Lemon Loop Hand Dishwash',
    desc: 'Sunlit vibrant lemon. Neutralizes tough food odors at molecular level.',
    scent: 'Lemon Loop',
    price: 135,
    badge: 'New',
    image: '/img/yellow-nobg.jpeg',
    tags: ['lemon', 'yellow', 'zesty', 'citrus', 'loop', 'odor'],
  },
  {
    id: 'bundle',
    name: 'The Complete Collection (Trio Bundle)',
    desc: 'Ocean Garden, Lime Lush & Lemon Loop. The perfect trio for a spotless kitchen.',
    scent: 'Trio Collection',
    price: 399,
    badge: 'Free Shipping',
    image: '/img/blue-nobg.jpeg',
    tags: ['bundle', 'trio', 'collection', 'set', 'all', 'three', 'complete', 'free shipping'],
  },
];

const POPULAR_TAGS = ['Ocean Garden', 'Lemon Loop', 'Lime Lush', 'Trio Bundle'];

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedTag(null);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products based on search query or tag
  const filteredProducts = SEARCHABLE_PRODUCTS.filter((product) => {
    const activeFilter = selectedTag ? selectedTag.toLowerCase() : query.toLowerCase().trim();
    if (!activeFilter) return true;

    return (
      product.name.toLowerCase().includes(activeFilter) ||
      product.desc.toLowerCase().includes(activeFilter) ||
      product.scent.toLowerCase().includes(activeFilter) ||
      product.tags.some((tag) => tag.toLowerCase().includes(activeFilter))
    );
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.name,
      variant: product.id === 'bundle' ? 'Trio Collection Bundle' : '500ml Glass-Look Bottle',
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    onClose();
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#173E4A]/40 backdrop-blur-md"
          />

          {/* Search Box Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#173E4A]/10 font-body text-[#173E4A] z-10"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-6 py-4 border-b border-[#173E4A]/10 bg-white">
              <svg className="w-5 h-5 text-[#155E78] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
              </svg>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedTag(null);
                }}
                placeholder="Search products, scents, or collections..."
                className="w-full px-4 py-1 text-base sm:text-lg text-[#173E4A] placeholder-gray-400 bg-transparent focus:outline-none font-medium"
              />

              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-gray-400 hover:text-[#173E4A] text-xs font-bold uppercase mr-2"
                >
                  Clear
                </button>
              )}

              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#F4F1EB] text-[0.625rem] font-mono font-bold text-[#173E4A]/60 border border-gray-200">
                ESC
              </span>
            </div>

            {/* Popular Tags */}
            <div className="px-6 py-3 bg-[#FBF7EC] border-b border-[#173E4A]/10 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155E78] flex-shrink-0">
                Popular:
              </span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTag === tag) {
                      setSelectedTag(null);
                    } else {
                      setSelectedTag(tag);
                      setQuery('');
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    selectedTag === tag
                      ? 'bg-[#173E4A] text-white shadow-xs font-semibold'
                      : 'bg-white text-[#173E4A]/80 hover:bg-[#155E78]/10 hover:text-[#155E78] border border-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <p className="text-base font-semibold text-[#173E4A] mb-1">No products found</p>
                  <p className="text-xs text-[#173E4A]/60">
                    No results for &quot;{query || selectedTag}&quot;. Try searching for &quot;Ocean&quot;, &quot;Lime&quot;, or &quot;Lemon&quot;.
                  </p>
                </div>
              ) : (
                filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      router.push('/shop');
                    }}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-[#F4F1EB]/40 hover:bg-[#F4F1EB] border border-[#173E4A]/5 hover:border-[#173E4A]/15 transition-all cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-xl bg-white p-2 flex-shrink-0 flex items-center justify-center border border-gray-100 shadow-xs">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-[#173E4A] truncate group-hover:text-[#155E78] transition-colors">
                          {prod.name}
                        </h4>
                        {prod.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-[#155E78]/10 text-[#155E78] text-[0.625rem] font-bold font-mono uppercase flex-shrink-0">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#173E4A]/70 line-clamp-1">{prod.desc}</p>
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-base font-bold text-[#173E4A] font-heading">₹{prod.price}</span>
                      <button
                        onClick={(e) => handleAddToCart(e, prod)}
                        className="px-3.5 py-2 rounded-full bg-[#173E4A] text-white text-xs font-semibold hover:bg-[#155E78] transition-all shadow-xs"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Hint */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-[#173E4A]/60 font-mono">
              <span>Showing {filteredProducts.length} results</span>
              <span className="hidden sm:inline-block">Press ESC to dismiss</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
