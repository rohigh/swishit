'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PRODUCTS = [
  {
    id: 'bundle',
    name: 'The Complete Collection',
    desc: 'Ocean Garden, Lime Lush & Lemon Loop. The perfect trio for a spotless kitchen.',
    price: 399,
    badge: 'Free Shipping',
    bg: 'bg-pastel-yellow',
    images: [
      '/img/ocean garden edited.png',
      '/img/lime lush edited.png',
      '/img/lemon edited.png',
    ],
    isBundle: true,
  },
  {
    id: 'lemon',
    name: 'Lemon Loop',
    desc: 'Sunlit and zesty. Cuts through tough grease instantly.',
    price: 135,
    badge: null,
    bg: 'bg-pastel-yellow',
    image: '/img/lemon edited.png',
    isBundle: false,
    customScale: 'scale-[1.75] group-hover:scale-[1.9]',
  },
  {
    id: 'lime',
    name: 'Lime Lush',
    desc: 'Fresh and vibrant. Gentle on your hands.',
    price: 135,
    badge: null,
    bg: 'bg-pastel-green',
    image: '/img/lime lush edited.png',
    isBundle: false,
    customScale: 'scale-[2.2] group-hover:scale-[2.35]',
  },
  {
    id: 'ocean',
    name: 'Ocean Garden',
    desc: 'Crisp and refreshing. Leaves dishes sparkling.',
    price: 135,
    badge: null,
    bg: 'bg-pastel-blue',
    image: '/img/ocean garden edited.png',
    isBundle: false,
    customScale: 'scale-[2.2] group-hover:scale-[2.35]',
  }
];

export default function Products() {
  return (
    <section className="relative w-full bg-base py-32 px-6" id="products">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-24 max-w-2xl">
          <h2 className="font-heading font-normal text-[clamp(2.5rem,5vw,4rem)] text-text leading-tight tracking-tight mb-6">
            Pick Your Scent.
          </h2>
          <p className="font-body text-text-muted text-lg">
            Grab our complete bundle for the best value, or pick your favorite single scent.
          </p>
        </div>

        {/* ── Sticky Card Stacking Container ────────────────── */}
        <div className="relative w-full flex flex-col gap-8 pb-32">
          {PRODUCTS.map((prod, index) => (
            <motion.div
              key={prod.id}
              className={`sticky w-full rounded-[24px] overflow-hidden border border-surface-border shadow-sm group ${prod.bg}`}
              style={{
                top: `calc(120px + ${index * 30}px)`, // Stacks beautifully
                minHeight: '580px',
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[580px]">
                
                {/* Text Content */}
                <div className="p-10 md:p-14 flex flex-col justify-center">
                  {prod.badge && (
                    <span className="self-start inline-flex items-center px-4 py-1.5 rounded-full bg-text text-white text-[10px] uppercase font-bold tracking-widest mb-6">
                      {prod.badge}
                    </span>
                  )}
                  
                  <h3 className="font-heading text-4xl text-text mb-4">
                    {prod.name}
                  </h3>
                  <p className="font-body text-text-muted text-base leading-relaxed mb-10 max-w-sm">
                    {prod.desc}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-1">Price</span>
                      <span className="text-2xl font-body font-semibold text-text">₹{prod.price}</span>
                    </div>
                    
                    <button className="h-12 px-6 rounded-full bg-text text-white font-body font-medium text-sm hover:bg-text-muted transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Images */}
                <div className="relative w-full h-[450px] md:h-full bg-black/5 flex items-center justify-center overflow-hidden">
                  {prod.isBundle ? (
                    <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
                      {prod.images.map((img, i) => (
                        <div 
                          key={i}
                          className={`
                            absolute w-[260px] h-[360px] 
                            ${i === 0 ? '-translate-x-14 rotate-[-8deg] z-10' : ''}
                            ${i === 1 ? 'translate-x-14 rotate-[8deg] z-10' : ''}
                            ${i === 2 ? 'z-20 translate-y-6 scale-110' : ''}
                          `}
                        >
                          <Image 
                            src={img} 
                            alt={prod.name} 
                            fill 
                            className={`object-contain drop-shadow-xl ${img.includes('lemon') ? 'scale-[1.4]' : 'scale-[1.75]'}`} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className={`relative w-[320px] h-[450px] ${prod.customScale || 'scale-[1.75] group-hover:scale-[1.9]'} transition-transform duration-1000 ease-[0.19,1,0.22,1]`}>
                        <Image 
                          src={prod.image} 
                          alt={prod.name} 
                          fill 
                          className="object-contain drop-shadow-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
