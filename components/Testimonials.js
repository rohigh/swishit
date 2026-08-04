'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 6 testimonials arranged in 2 identical waves of 3 cards (Left -> Right -> Center)
const TESTIMONIALS = [
  // ── WAVE 1 ────────────────────────────────────────────────────────
  {
    id: 1,
    quote: "Not gonna lie, I was super skeptical about a plant-powered dish soap cutting through stubborn Indian dal and curry grease. But Swishit is incredible! One push cleans my entire sink without any residue.",
    name: "Priya Sharma",
    role: "home chef & daily cook",
    initials: "PS",
    bg: "bg-pastel-blue text-[#0369a1]",
    desktopPos: "top-[16%] left-[2%] lg:left-[5%] xl:left-[6%] w-[88%] max-w-[360px] md:w-[320px] lg:w-[360px] xl:w-[400px]",
    startTime: 1.5,
  },
  {
    id: 2,
    quote: "Honestly? I was tired of messy soap bottles that spill and waste half the liquid. The Pump on Swishit is genius—exact amount every time, and my hands don't feel stripped or dry afterward.",
    name: "Rahul Verma",
    role: "switched from typical liquid soaps",
    initials: "RV",
    bg: "bg-pastel-green text-[#15803d]",
    desktopPos: "top-[10%] right-[2%] lg:right-[5%] xl:right-[6%] w-[88%] max-w-[360px] md:w-[320px] lg:w-[360px] xl:w-[400px]",
    startTime: 1.7,
  },
  {
    id: 3,
    quote: "The Ocean Garden scent is a total game changer. Unlike harsh chemical soaps that leave an artificial smell on dishes, Perfume-Lock™ keeps my kitchen smelling genuinely fresh and clean. Never going back.",
    name: "Ananya Patel",
    role: "kitchen minimalist & mother of 2",
    initials: "AP",
    bg: "bg-pastel-yellow text-[#b45309]",
    desktopPos: "top-[56%] left-1/2 -translate-x-1/2 w-[88%] max-w-[360px] md:w-[320px] lg:w-[360px] xl:w-[400px]",
    startTime: 2.0,
  },

  // ── WAVE 2 ────────────────────────────────────────────────────────
  {
    id: 4,
    quote: "As someone who hosts dinner parties weekly, washing glassware used to be a chore. Lemon Loop leaves wine glasses crystal clear without a single water streak or cloudy film. Absolutely premium.",
    name: "Vikram Mehta",
    role: "food blogger & host",
    initials: "VM",
    bg: "bg-pastel-yellow text-[#a16207]",
    desktopPos: "top-[16%] left-[3%] lg:left-[6%] xl:left-[7%] w-[88%] max-w-[360px] md:w-[320px] lg:w-[360px] xl:w-[400px]",
    startTime: 3.8,
  },
  {
    id: 5,
    quote: "Finding a baby-safe dish soap that doesn't cost a fortune and actually removes greasy milk residue from bottles was impossible until Swishit. Lime Lush is gentle, safe, and ultra-effective.",
    name: "Sneha Ghosh",
    role: "mother of 3 & doctor",
    initials: "SG",
    bg: "bg-pastel-green text-[#15803d]",
    desktopPos: "top-[10%] right-[3%] lg:right-[6%] xl:right-[7%] w-[88%] max-w-[360px] md:w-[320px] lg:w-[360px] xl:w-[400px]",
    startTime: 4.0,
  },
  {
    id: 6,
    quote: "Protein shaker bottles are notorious for holding onto awful smells even after scrubbing. One pump of Ocean Garden eliminated that stale protein smell instantly. Truly lives up to the hype!",
    name: "Arjun Desai",
    role: "fitness enthusiast",
    initials: "AD",
    bg: "bg-pastel-blue text-[#1d7e9e]",
    desktopPos: "top-[56%] left-1/2 -translate-x-1/2 w-[88%] max-w-[360px] md:w-[320px] lg:w-[360px] xl:w-[400px]",
    startTime: 4.3,
  }
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const topTextRef = useRef(null);
  const bottomTextRef = useRef(null);
  const centerTextRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 767px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isDesktop: "(min-width: 1024px)"
    }, (context) => {
      let { isMobile, isTablet } = context.conditions;

      gsap.set(centerTextRef.current, { scale: 0.65, opacity: 0, force3D: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: isMobile ? "+=380%" : isTablet ? "+=420%" : "+=450%",
          scrub: true,
        }
      });

      if (isMobile) {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          gsap.set(card, { y: 720, opacity: 1, scale: 1 });
          tl.to(card, {
            y: -720,
            ease: "none",
            duration: 2.9,
          }, index * 0.85 + 1.2);
        });

        tl.to(topTextRef.current, { x: "-120vw", ease: "power2.inOut", duration: 2.0 }, 6.5);
        tl.to(bottomTextRef.current, { x: "120vw", ease: "power2.inOut", duration: 2.0 }, 6.5);
        tl.to(centerTextRef.current, { scale: 1.0, opacity: 1.0, ease: "power2.out", duration: 2.0 }, 6.5);

      } else if (isTablet) {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          gsap.set(card, { y: 950, opacity: 1 });
          tl.to(card, {
            y: -950,
            ease: "none",
            duration: 3.1,
          }, TESTIMONIALS[index].startTime);
        });

        tl.to(topTextRef.current, { x: "-120vw", ease: "power2.inOut", duration: 2.2 }, 6.2);
        tl.to(bottomTextRef.current, { x: "120vw", ease: "power2.inOut", duration: 2.2 }, 6.2);
        tl.to(centerTextRef.current, { scale: 1.0, opacity: 1.0, ease: "power2.out", duration: 2.2 }, 6.2);

      } else {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          gsap.set(card, { y: 1150, opacity: 1 });
          tl.to(card, {
            y: -1150,
            ease: "none",
            duration: 3.2,
          }, TESTIMONIALS[index].startTime);
        });

        tl.to(topTextRef.current, { x: "-120vw", ease: "power2.inOut", duration: 2.2 }, 6.2);
        tl.to(bottomTextRef.current, { x: "120vw", ease: "power2.inOut", duration: 2.2 }, 6.2);
        tl.to(centerTextRef.current, { scale: 1.0, opacity: 1.0, ease: "power2.out", duration: 2.2 }, 6.2);
      }
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen min-h-screen w-full bg-base overflow-hidden flex items-center justify-center select-none"
      id="testimonials"
    >
      {/* ── SPLIT MASSIVE BACKGROUND HEADING LAYER ── */}
      <div 
        style={{ zIndex: 1 }}
        className="absolute inset-0 flex flex-col items-center md:items-center justify-center pointer-events-none px-4 md:px-12 lg:px-16"
      >
        <div className="relative w-full max-w-6xl flex flex-col items-center md:items-start justify-center">
          
          {/* Top line: "What they" */}
          <div ref={topTextRef} className="will-change-transform">
            <h2 
              style={{ color: '#173E4A' }}
              className="font-body font-medium text-[clamp(2.5rem,8.5vw,10rem)] md:text-[clamp(3.5rem,8.5vw,11rem)] lg:text-[clamp(4.5rem,11vw,13rem)] tracking-tight text-center md:text-left leading-[0.9] md:leading-[0.88]"
            >
              What they
            </h2>
          </div>

          {/* Bottom line: "are saying" */}
          <div ref={bottomTextRef} className="will-change-transform">
            <h2 
              style={{ color: '#173E4A' }}
              className="font-body font-medium text-[clamp(2.5rem,8.5vw,10rem)] md:text-[clamp(3.5rem,8.5vw,11rem)] lg:text-[clamp(4.5rem,11vw,13rem)] tracking-tight text-center md:text-left leading-[0.9] md:leading-[0.88]"
            >
              are saying
            </h2>
          </div>

          {/* Center text: "Join the community..." (appears simultaneously as split occurs) */}
          <div 
            ref={centerTextRef} 
            className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 pointer-events-auto"
          >
            <div className="flex items-center justify-center gap-1 mb-2 text-[#F0A93B] text-base md:text-xl tracking-tighter" style={{ color: '#F0A93B' }}>
              ★★★★★
            </div>
            <span className="text-xs md:text-sm font-mono text-[#173E4A] mb-3 uppercase tracking-widest font-bold" style={{ color: '#173E4A' }}>
              2,500+ five-star reviews
            </span>
            <h3 className="font-heading font-normal text-2xl md:text-4xl lg:text-6xl text-[#173E4A] leading-tight tracking-tight" style={{ color: '#173E4A' }}>
              Join the community that&apos;s redefining dishwashing, one push at a time.
            </h3>
          </div>

        </div>
      </div>

      {/* ── FLOATING TESTIMONIAL CARDS LAYER ──────────────────────── */}
      <div 
        style={{ zIndex: 50 }}
        className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-center"
      >
        {TESTIMONIALS.map((test, index) => (
          <div
            key={test.id}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{ zIndex: 100 }}
            className={`
              absolute pointer-events-auto bg-white rounded-3xl p-5 md:p-6 lg:p-8 
              shadow-2xl border border-neutral-200/80
              flex flex-col justify-between
              max-md:top-1/2 max-md:-translate-y-1/2 max-md:left-1/2 max-md:-translate-x-1/2
              ${test.desktopPos}
            `}
          >
            {/* Quote Text */}
            <p 
              style={{ color: '#1A1A1A' }}
              className="font-body text-xs md:text-sm lg:text-base font-normal leading-relaxed mb-4 md:mb-6 tracking-normal"
            >
              &ldquo;{test.quote}&rdquo;
            </p>

            {/* Footer: Stars + Author Info */}
            <div>
              {/* 5 Stars */}
              <div className="flex items-center gap-1 mb-2 md:mb-3">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    style={{ color: '#F0A93B' }}
                    className="text-xs md:text-sm tracking-tighter"
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs md:text-sm ${test.bg}`}>
                  {test.initials}
                </div>
                <div className="flex flex-col">
                  <span 
                    style={{ color: '#1A1A1A' }}
                    className="font-body font-bold text-xs md:text-sm lg:text-base leading-tight"
                  >
                    {test.name}
                  </span>
                  <span 
                    style={{ color: '#173E4A' }}
                    className="font-body font-medium text-[11px] md:text-xs lg:text-sm"
                  >
                    {test.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
