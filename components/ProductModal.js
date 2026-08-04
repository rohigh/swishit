'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import ProductReviews from './ProductReviews';

const DEFAULT_PRODUCT_FAQS = [
  {
    q: 'How long does a 500ml bottle usually last?',
    a: 'With daily household hand dishwashing, one concentrated 500ml pump bottle lasts approximately 4 to 6 weeks (120+ sink loads).'
  },
  {
    q: 'Is Swishit safe for sensitive skin & baby bottles?',
    a: 'Yes, 100%. Swishit is plant-powered, dermatologically tested, and free from harsh synthetic sulfates or parabens. It rinses completely clean with zero residue.'
  },
  {
    q: 'How does the Perfume-Lock™ technology work?',
    a: 'Our Perfume-Lock™ formula neutralizes tough food odors (such as fish, garlic, and spices) at the molecular level without transferring any perfume taste to your cookware or dishes.'
  },
  {
    q: 'Can I refill and reuse this bottle?',
    a: 'Yes! Our signature bottles are built for infinite reuse. Simply purchase our eco-friendly refill pouches to top up your bottle.'
  }
];

export default function ProductModal({ product, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState('/img/ocean garden edited.png');
  const [selectedSize, setSelectedSize] = useState('500ml Pump');
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      setActiveImage(product.isBundle ? product.images[0] : product.image);
      setQuantity(1);
      setLiked(false);
      setActiveAccordion(null);

      // Pause Lenis smooth scroll while product page is open
      if (typeof window !== 'undefined' && window.lenisInstance) {
        window.lenisInstance.stop();
      }
    } else {
      if (typeof window !== 'undefined' && window.lenisInstance) {
        window.lenisInstance.start();
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.lenisInstance) {
        window.lenisInstance.start();
      }
    };
  }, [product]);

  if (!mounted) return null;

  const productImages = product?.isBundle 
    ? product.images 
    : [product?.image, '/img/blue-nobg.jpeg', '/img/hands (1).png'].filter(Boolean);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.name,
      variant: selectedSize || (product.isBundle ? 'Trio Collection (3x500ml)' : '500ml Pump'),
      price: product.price,
      quantity: quantity,
      image: product.isBundle ? product.images[0] : product.image,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const sizes = product?.isBundle 
    ? ['Trio Collection (3x500ml)', 'Refill Pouch Bundle'] 
    : ['500ml Pump', '1000ml Refill Pouch'];

  const productFaqs = product?.faqs || DEFAULT_PRODUCT_FAQS;

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div 
          key="product-fullscreen-page"
          data-lenis-prevent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#FBF7EC] h-screen w-screen overflow-y-scroll overscroll-contain flex flex-col"
        >
          
          {/* Top Sticky Header Bar (Breadcrumbs & Back Button) */}
          <div className="sticky top-0 z-30 bg-[#FBF7EC]/95 backdrop-blur-md px-6 md:px-16 py-5 border-b border-[#173E4A]/10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs md:text-sm font-body text-[#4A7A8A]">
              <button 
                onClick={onClose}
                className="flex items-center gap-2 text-[#173E4A] font-semibold hover:opacity-75 transition-opacity cursor-pointer mr-2"
              >
                <span>&larr;</span> Back to Shop
              </button>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="hidden sm:inline cursor-pointer hover:text-[#173E4A]" onClick={onClose}>Home</span>
              <span className="hidden sm:inline">&gt;</span>
              <span className="hidden sm:inline cursor-pointer hover:text-[#173E4A]" onClick={onClose}>Shop</span>
              <span className="hidden sm:inline">&gt;</span>
              <span className="font-semibold text-[#173E4A]">{product.name}</span>
            </div>

            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#173E4A]/5 hover:bg-[#173E4A]/10 flex items-center justify-center text-[#173E4A] font-bold text-xl transition-colors cursor-pointer"
              aria-label="Close Product Page"
            >
              ✕
            </button>
          </div>

          {/* Full Page Content Container */}
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-16 space-y-20 flex-1">
            
            {/* ── SECTION 1: PRODUCT HERO DETAIL GRID (IMAGE LEFT, CONTROLS RIGHT) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* LEFT COLUMN: Main Large Image Viewer & Gallery Thumbnails */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                
                {/* Main Large Image Container (Matching Screenshot 1) */}
                <div className="relative w-full h-[420px] md:h-[560px] lg:h-[620px] bg-[#EFECE5] rounded-3xl overflow-hidden border border-[#173E4A]/10 flex items-center justify-center group shadow-inner">
                  
                  {/* Wishlist Heart Button */}
                  <button 
                    onClick={() => setLiked(!liked)}
                    className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform cursor-pointer"
                  >
                    {liked ? '❤️' : '♡'}
                  </button>

                  <div className="relative w-[80%] h-[85%] transition-transform duration-700 ease-out group-hover:scale-105">
                    <Image 
                      src={activeImage || product?.image || '/img/ocean garden edited.png'} 
                      alt={product?.name || 'Swishit Product'} 
                      fill 
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                {/* Thumbnail Row Below Main Image */}
                <div className="flex items-center gap-4 overflow-x-auto pb-2 justify-center lg:justify-start">
                  {productImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-24 rounded-2xl bg-[#EFECE5] border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                        activeImage === img ? 'border-[#1D7E9E] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Price, Title, Selectors & Accordions */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Price */}
                  <div className="text-2xl md:text-3xl font-body font-bold text-[#173E4A] mb-3">
                    ₹{product.price} <span className="text-xs md:text-sm text-[#4A7A8A] font-normal ml-2">(Incl. all taxes)</span>
                  </div>

                  {/* Product Title */}
                  <h1 className="font-heading font-normal text-3xl md:text-5xl text-[#173E4A] tracking-tight mb-2">
                    {product.name}
                  </h1>

                  {/* Rating Stars Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-xs font-bold text-[#173E4A]">4.9</span>
                    <span className="text-xs text-[#173E4A]/60 font-body">• 2,500+ Verified Reviews</span>
                  </div>

                  {/* Short Description */}
                  <p className="font-body text-[#4A7A8A] text-base md:text-lg leading-relaxed mb-8">
                    {product.desc}
                  </p>

                  {/* Size / Option Selector */}
                  <div className="mb-8">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#4A7A8A] font-semibold mb-3">
                      Select Size / Option
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-body font-medium transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-[#173E4A] text-white shadow-md font-semibold scale-[1.02]'
                              : 'bg-[#EFECE5] text-[#173E4A] hover:bg-[#E2DDD3]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Counter & Add to Cart Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                    {/* Counter */}
                    <div className="flex items-center justify-between bg-[#EFECE5] rounded-full px-5 h-14 w-36 border border-[#173E4A]/10">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-[#173E4A] text-xl font-bold hover:opacity-60 transition-opacity cursor-pointer"
                      >
                        –
                      </button>
                      <span className="font-body font-bold text-[#173E4A] text-lg">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-[#173E4A] text-xl font-bold hover:opacity-60 transition-opacity cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 h-14 rounded-full bg-[#F0A93B] text-[#173E4A] hover:bg-[#D48820] hover:text-white font-body font-bold text-base md:text-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{addedToCart ? '✓ Added to Bag!' : `Add to Cart — ₹${product.price * quantity}`}</span>
                    </button>
                  </div>

                  {/* Delivery Perks */}
                  <div className="flex items-center gap-8 text-xs md:text-sm text-[#4A7A8A] font-body mb-10 pb-6 border-b border-[#173E4A]/10">
                    <span className="flex items-center gap-2">📦 Free Shipping over ₹399</span>
                    <span className="flex items-center gap-2">🛡️ 7 Days Easy Returns</span>
                  </div>

                  {/* 4 Trust Feature Icons Grid (Matching Screenshot 1) */}
                  <div className="grid grid-cols-4 gap-3 mb-10">
                    <div className="bg-[#EFECE5] rounded-2xl p-4 text-center flex flex-col items-center justify-center">
                      <span className="text-xl mb-1">🌿</span>
                      <span className="text-xs font-body font-bold text-[#173E4A] leading-tight">100% Natural</span>
                    </div>
                    <div className="bg-[#EFECE5] rounded-2xl p-4 text-center flex flex-col items-center justify-center">
                      <span className="text-xl mb-1">🐰</span>
                      <span className="text-xs font-body font-bold text-[#173E4A] leading-tight">Cruelty Free</span>
                    </div>
                    <div className="bg-[#EFECE5] rounded-2xl p-4 text-center flex flex-col items-center justify-center">
                      <span className="text-xl mb-1">🍃</span>
                      <span className="text-xs font-body font-bold text-[#173E4A] leading-tight">Eco Friendly</span>
                    </div>
                    <div className="bg-[#EFECE5] rounded-2xl p-4 text-center flex flex-col items-center justify-center">
                      <span className="text-xl mb-1">🛡️</span>
                      <span className="text-xs font-body font-bold text-[#173E4A] leading-tight">Expert Approved</span>
                    </div>
                  </div>

                  {/* Expandable Tabs (Details, How to Use, Ingredients, Delivery) */}
                  <div className="divide-y divide-[#173E4A]/10 border-t border-b border-[#173E4A]/10">
                    
                    {/* Details */}
                    <div className="py-4">
                      <button 
                        onClick={() => toggleAccordion('details')}
                        className="w-full flex items-center justify-between font-heading text-xl font-normal text-[#173E4A] text-left cursor-pointer"
                      >
                        <span>Details</span>
                        <span className="text-[#173E4A] font-bold text-2xl">{activeAccordion === 'details' ? '–' : '+'}</span>
                      </button>
                      {activeAccordion === 'details' && (
                        <p className="mt-3 text-sm md:text-base text-[#4A7A8A] font-body leading-relaxed animate-fadeIn">
                          Swishit is engineered with plant-based coconut surfactants and our proprietary Perfume-Lock™ technology to eliminate stubborn grease and odors in one pump.
                        </p>
                      )}
                    </div>

                    {/* How to Use */}
                    <div className="py-4">
                      <button 
                        onClick={() => toggleAccordion('use')}
                        className="w-full flex items-center justify-between font-heading text-xl font-normal text-[#173E4A] text-left cursor-pointer"
                      >
                        <span>How to Use</span>
                        <span className="text-[#173E4A] font-bold text-2xl">{activeAccordion === 'use' ? '–' : '+'}</span>
                      </button>
                      {activeAccordion === 'use' && (
                        <p className="mt-3 text-sm md:text-base text-[#4A7A8A] font-body leading-relaxed animate-fadeIn">
                          Press the pump once directly onto a damp sponge or in a sink filled with water. Lather and scrub your cookware or glassware, then rinse clean.
                        </p>
                      )}
                    </div>

                    {/* Ingredients */}
                    <div className="py-4">
                      <button 
                        onClick={() => toggleAccordion('ingredients')}
                        className="w-full flex items-center justify-between font-heading text-xl font-normal text-[#173E4A] text-left cursor-pointer"
                      >
                        <span>Ingredients</span>
                        <span className="text-[#173E4A] font-bold text-2xl">{activeAccordion === 'ingredients' ? '–' : '+'}</span>
                      </button>
                      {activeAccordion === 'ingredients' && (
                        <p className="mt-3 text-sm md:text-base text-[#4A7A8A] font-body leading-relaxed animate-fadeIn">
                          Aqua, Coconut Glycinate (Plant Surfactant), Organic Citrus Peel Extract, Vegetable Glycerin, Perfume-Lock™ Natural Aroma, Citric Acid, Sodium Benzoate.
                        </p>
                      )}
                    </div>

                    {/* Delivery & Returns */}
                    <div className="py-4">
                      <button 
                        onClick={() => toggleAccordion('shipping')}
                        className="w-full flex items-center justify-between font-heading text-xl font-normal text-[#173E4A] text-left cursor-pointer"
                      >
                        <span>Delivery &amp; Returns</span>
                        <span className="text-[#173E4A] font-bold text-2xl">{activeAccordion === 'shipping' ? '–' : '+'}</span>
                      </button>
                      {activeAccordion === 'shipping' && (
                        <p className="mt-3 text-sm md:text-base text-[#4A7A8A] font-body leading-relaxed animate-fadeIn">
                          Dispatched within 24 hours. Standard delivery takes 2-4 business days across India. Free returns within 7 days if unopened.
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Footer Links */}
                  <div className="mt-8 flex items-center justify-between text-xs md:text-sm text-[#4A7A8A] font-body underline underline-offset-4 mb-8">
                    <a href="#faq" onClick={onClose} className="hover:text-[#173E4A]">Frequently Asked Questions</a>
                    <a href="#footer" onClick={onClose} className="hover:text-[#173E4A]">Contact Support</a>
                  </div>

                  {/* Customer Reviews & 5-Star Ratings */}
                  <ProductReviews productName={product.name} />

                </div>
              </div>

            </div>

            {/* ── SECTION 2: TOP 4 TRUST BANNER (MATCHING SCREENSHOT 1) ── */}
            <div className="pt-16 border-t border-[#173E4A]/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-[#EFECE5] rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl mb-3">🌿</span>
                  <h4 className="font-heading font-normal text-xl text-[#173E4A] mb-2">Natural Formula</h4>
                  <p style={{ color: '#173E4A' }} className="font-body text-xs md:text-sm text-[#173E4A] font-medium leading-relaxed">
                    Crafted with pure, skin-loving ingredients for ultimate care.
                  </p>
                </div>

                <div className="bg-[#EFECE5] rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl mb-3">🐰</span>
                  <h4 className="font-heading font-normal text-xl text-[#173E4A] mb-2">Cruelty-Free</h4>
                  <p style={{ color: '#173E4A' }} className="font-body text-xs md:text-sm text-[#173E4A] font-medium leading-relaxed">
                    Our products are never tested on animals, guaranteed ethical.
                  </p>
                </div>

                <div className="bg-[#EFECE5] rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl mb-3">🛡️</span>
                  <h4 className="font-heading font-normal text-xl text-[#173E4A] mb-2">Expert Approved</h4>
                  <p style={{ color: '#173E4A' }} className="font-body text-xs md:text-sm text-[#173E4A] font-medium leading-relaxed">
                    Carefully tested to ensure safety and visible results.
                  </p>
                </div>

                <div className="bg-[#EFECE5] rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl mb-3">🚚</span>
                  <h4 className="font-heading font-normal text-xl text-[#173E4A] mb-2">Free Shipping</h4>
                  <p style={{ color: '#173E4A' }} className="font-body text-xs md:text-sm text-[#173E4A] font-medium leading-relaxed">
                    Delivered to your doorstep with no extra costs nationwide.
                  </p>
                </div>

              </div>
            </div>

            {/* ── SECTION 3: PRODUCT FAQ ACCORDION (MATCHING SCREENSHOT 1) ── */}
            <div className="pt-16 border-t border-[#173E4A]/10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                <div className="lg:col-span-4">
                  <h2 className="font-heading text-5xl font-normal text-[#173E4A]">
                    FAQ
                  </h2>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-4">
                  {productFaqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#EFECE5] rounded-2xl p-6 border border-[#173E4A]/10 shadow-sm">
                      <button 
                        onClick={() => toggleAccordion(`product-faq-${idx}`)}
                        className="w-full flex items-center justify-between text-left font-body font-bold text-[#173E4A] text-base md:text-lg cursor-pointer gap-4"
                        style={{ color: '#173E4A' }}
                      >
                        <span style={{ color: '#173E4A' }} className="text-[#173E4A] font-bold">{faq.q}</span>
                        <span style={{ color: '#173E4A' }} className="text-[#173E4A] font-bold text-xl shrink-0">
                          {activeAccordion === `product-faq-${idx}` ? '–' : '+'}
                        </span>
                      </button>

                      {activeAccordion === `product-faq-${idx}` && (
                        <p style={{ color: '#173E4A' }} className="mt-4 text-sm md:text-base text-[#173E4A] font-body font-medium leading-relaxed animate-fadeIn">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
