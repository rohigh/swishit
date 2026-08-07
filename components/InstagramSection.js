'use client';

import React, { useState, useEffect } from 'react';
import { CircularGallery } from '@/components/ui/circular-gallery-2';

// ── CUSTOMIZABLE GALLERY ITEMS ──
// You can easily add, remove, or change any images and labels here!
const CUSTOM_GALLERY_ITEMS = [
  {
    image: '/img/ocean garden edited.png',
    text: 'Ocean Garden Dew',
    permalink: 'https://instagram.com/swishit.official',
  },
  {
    image: '/img/lime lush edited.png',
    text: 'Lime Lush Dew',
    permalink: 'https://instagram.com/swishit.official',
  },
  {
    image: '/img/lemon edited.png',
    text: 'Lemon Loop Dew',
    permalink: 'https://instagram.com/swishit.official',
  },
  {
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    text: 'Aesthetic Kitchen Sink',
    permalink: 'https://instagram.com/swishit.official',
  },
  {
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80',
    text: 'Plant-Powered Science',
    permalink: 'https://instagram.com/swishit.official',
  },
  {
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    text: 'Glass Pump Bottle',
    permalink: 'https://instagram.com/swishit.official',
  },
  {
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    text: 'Sparkling Dishes',
    permalink: 'https://instagram.com/swishit.official',
  },
  {
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80',
    text: 'Trio Collection Bundle',
    permalink: 'https://instagram.com/swishit.official',
  },
];

export default function InstagramSection() {
  const [items, setItems] = useState(CUSTOM_GALLERY_ITEMS);

  useEffect(() => {
    fetch('/api/instagram')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch((err) => {
        console.log('Using custom curated gallery items');
      });
  }, []);

  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-[#FBF7EC] border-t border-[#155E78]/10 overflow-hidden" id="instagram">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center mb-6 md:mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D7E9E]/10 border border-[#1D7E9E]/20 text-text text-xs font-mono font-bold uppercase tracking-widest mb-3">
          <svg className="w-4 h-4 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          @swishit.official
        </span>

        <h2 className="font-heading font-normal text-fluid-2xl text-text tracking-tight mb-3">
          Follow Us on Instagram
        </h2>
        <p className="font-body text-text/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Tag <strong className="text-text">@swishit.official</strong> in your kitchen counter setups for a chance to be featured!
        </p>
      </div>

      {/* 3D Circular WebGL Gallery — fluid height, min 340px on small phones, max 640px on wide screens */}
      <div className="relative h-[clamp(340px,45vw,640px)] w-full my-2">
        <CircularGallery
          items={items}
          bend={3}
          borderRadius={0.05}
          scrollSpeed={2}
          scrollEase={0.02}
        />
      </div>

      <div className="text-center mt-6">
        <a
          href="https://instagram.com/swishit.official"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#155E78] hover:bg-[#155E78] text-white font-body font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
        >
          <span>Follow @swishit.official</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
