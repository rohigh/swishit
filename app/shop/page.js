'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';

const PRODUCTS = [
  {
    id: 'bundle',
    name: 'The Complete Collection',
    category: 'Bundles',
    desc: 'Ocean Garden, Lime Lush & Lemon Loop. The ultimate trio for a spotless kitchen.',
    price: 399,
    rating: 4.9,
    reviews: 128,
    badge: 'Best Value',
    bg: 'bg-[#FEF5E7]',
    scent: 'All 3 Signature Dews',
    images: [
      '/img/ocean garden edited.png',
      '/img/lime lush edited.png',
      '/img/lemon edited.png',
    ],
    isBundle: true,
  },
  {
    id: 'ocean',
    name: 'Ocean Garden',
    category: 'Single Bottles',
    desc: 'Crisp, aquatic, and refreshing. Leaves dishes sparkling and hands moisturized.',
    price: 135,
    rating: 4.9,
    reviews: 94,
    badge: 'Best Seller',
    bg: 'bg-[#E8F5F8]',
    scent: 'Sea Salt & Aqua Breeze',
    image: '/img/ocean garden edited.png',
    isBundle: false,
  },
  {
    id: 'lime',
    name: 'Lime Lush',
    category: 'Single Bottles',
    desc: 'Vibrant and zesty lime. Gentle on your skin while cutting grease effortlessly.',
    price: 135,
    rating: 4.8,
    reviews: 76,
    badge: null,
    bg: 'bg-[#EAF7EE]',
    scent: 'Wild Lime & Bergamot',
    image: '/img/lime lush edited.png',
    isBundle: false,
  },
  {
    id: 'lemon',
    name: 'Lemon Loop',
    desc: 'Sunlit lemon citrus. Powerful grease-cutting action in a single pump.',
    category: 'Single Bottles',
    price: 135,
    rating: 4.9,
    reviews: 112,
    badge: null,
    bg: 'bg-[#FFF8E7]',
    scent: 'Meyer Lemon & Sunshine',
    image: '/img/lemon edited.png',
    isBundle: false,
  }
];

const CATEGORIES = ['All', 'Single Bottles', 'Bundles'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedId, setAddedId] = useState(null);

  const filteredProducts = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleQuickAdd = (e, prodId) => {
    e.stopPropagation();
    setAddedId(prodId);
    setTimeout(() => setAddedId(null), 2200);
  };

  return (
    <div className="min-h-screen bg-[#FBF7EC] text-[#173E4A] font-body">
      
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* ── HERO BANNER ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1D7E9E]/10 text-[#1D7E9E] font-mono text-xs font-bold uppercase tracking-widest mb-4">
            Official Store
          </span>
          <h1 className="font-heading font-normal text-fluid-3xl text-[#173E4A] leading-tight tracking-tight mb-4">
            Shop Swishit Collection
          </h1>
          <p className="font-body text-[#4A7A8A] text-base md:text-xl leading-relaxed">
            Elevate your dishwashing routine with plant-powered, skin-nourishing dish dews and eco refill pouches.
          </p>
        </div>

        {/* ── CATEGORY FILTER PILLS ── */}
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#173E4A] text-white shadow-md font-semibold scale-105'
                  : 'bg-white/80 text-[#173E4A] hover:bg-white border border-[#173E4A]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── PRODUCT CATALOG GRID ── */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProduct(prod)}
                className={`group rounded-3xl p-6 flex flex-col justify-between border border-[#173E4A]/10 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden ${prod.bg}`}
              >
                
                {/* Top Badge & Heart */}
                <div className="flex items-center justify-between z-10 mb-4">
                  {prod.badge ? (
                    <span className="px-3 py-1 rounded-full bg-[#173E4A] text-white text-[0.625rem] uppercase font-bold tracking-wider">
                      {prod.badge}
                    </span>
                  ) : (
                    <span />
                  )}
                  <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                    ♡
                  </div>
                </div>

                {/* Image Stage — fluid between 180px and 280px based on viewport */}
                <div className="relative w-full h-[clamp(180px,24vw,280px)] my-4 flex items-center justify-center">
                  {prod.isBundle ? (
                    <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      {prod.images.map((img, i) => (
                        <div 
                          key={i}
                          className={`
                            absolute w-[clamp(90px,12vw,150px)] aspect-[7/10]
                            ${i === 0 ? '-translate-x-8 rotate-[-8deg] z-10' : ''}
                            ${i === 1 ? 'translate-x-8 rotate-[8deg] z-10' : ''}
                            ${i === 2 ? 'z-20 translate-y-4 scale-110' : ''}
                          `}
                        >
                          <Image src={img} alt={prod.name} fill sizes="150px" className="object-contain drop-shadow-lg" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative w-[clamp(110px,14vw,190px)] aspect-[3/4] group-hover:scale-110 transition-transform duration-500 ease-out">
                      <Image src={prod.image} alt={prod.name} fill sizes="(max-width: 768px) 190px, 190px" className="object-contain drop-shadow-xl" />
                    </div>
                  )}
                </div>

                {/* Content Footer */}
                <div className="pt-4 border-t border-[#173E4A]/10 flex flex-col justify-between flex-1">
                  <div>
                    {/* Scent & Rating */}
                    <div className="flex items-center justify-between text-xs text-[#4A7A8A] mb-2 font-mono">
                      <span>{prod.scent}</span>
                      <span className="flex items-center gap-1 font-bold text-[#173E4A]">
                        ★ {prod.rating} <span className="text-gray-400 font-normal">({prod.reviews})</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-fluid-lg font-normal text-[#173E4A] mb-2 group-hover:text-[#1D7E9E] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="font-body text-xs text-[#4A7A8A] line-clamp-2 leading-relaxed mb-6">
                      {prod.desc}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="block text-[0.625rem] uppercase tracking-widest text-[#4A7A8A] font-semibold">Price</span>
                      <span className="text-xl font-bold text-[#173E4A]">₹{prod.price}</span>
                    </div>

                    <button 
                      onClick={(e) => handleQuickAdd(e, prod.id)}
                      className="h-11 px-5 rounded-full bg-[#1D7E9E] text-white font-medium text-xs hover:bg-[#F0A93B] hover:text-[#173E4A] transition-all shadow-md cursor-pointer"
                    >
                      {addedId === prod.id ? '✓ Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── VALUE PROPOSITION BANNER ── */}
        <div className="mt-24 bg-[#EFECE5] rounded-3xl p-8 md:p-14 border border-[#173E4A]/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-3">🌿</span>
              <h4 className="font-heading text-lg font-normal text-[#173E4A] mb-1">100% Plant Surfactants</h4>
              <p style={{ color: '#173E4A' }} className="font-body text-xs text-[#173E4A] font-medium">Derived from organic coconut and citric acid.</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl mb-3">🐰</span>
              <h4 className="font-heading text-lg font-normal text-[#173E4A] mb-1">Cruelty-Free &amp; Vegan</h4>
              <p style={{ color: '#173E4A' }} className="font-body text-xs text-[#173E4A] font-medium">Ethically created with zero animal testing.</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl mb-3">💧</span>
              <h4 className="font-heading text-lg font-normal text-[#173E4A] mb-1">Perfume-Lock™ Tech</h4>
              <p style={{ color: '#173E4A' }} className="font-body text-xs text-[#173E4A] font-medium">Long-lasting fresh aromas with neutralizers.</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl mb-3">📦</span>
              <h4 className="font-heading text-lg font-normal text-[#173E4A] mb-1">Free Shipping &gt; ₹350</h4>
              <p style={{ color: '#173E4A' }} className="font-body text-xs text-[#173E4A] font-medium">Swift 2-4 day dispatch nationwide.</p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Full-Screen Product Detail Page Overlay */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
