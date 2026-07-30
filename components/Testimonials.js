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
    desktopPos: "top-[16%] left-[4%] lg:left-[6%] w-[90%] md:w-[360px] lg:w-[400px]",
    startTime: 1.5,
  },
  {
    id: 2,
    quote: "Honestly? I was tired of messy soap bottles that spill and waste half the liquid. The Pump on Swishit is genius—exact amount every time, and my hands don't feel stripped or dry afterward.",
    name: "Rahul Verma",
    role: "switched from typical liquid soaps",
    initials: "RV",
    bg: "bg-pastel-green text-[#15803d]",
    desktopPos: "top-[10%] right-[4%] lg:right-[6%] w-[90%] md:w-[360px] lg:w-[400px]",
    startTime: 1.7,
  },
  {
    id: 3,
    quote: "The Ocean Garden scent is a total game changer. Unlike harsh chemical soaps that leave an artificial smell on dishes, Perfume-Lock™ keeps my kitchen smelling genuinely fresh and clean. Never going back.",
    name: "Ananya Patel",
    role: "kitchen minimalist & mother of 2",
    initials: "AP",
    bg: "bg-pastel-yellow text-[#b45309]",
    desktopPos: "top-[55%] left-1/2 -translate-x-1/2 w-[90%] md:w-[360px] lg:w-[400px]",
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
    desktopPos: "top-[16%] left-[5%] lg:left-[7%] w-[90%] md:w-[360px] lg:w-[400px]",
    startTime: 3.8,
  },
  {
    id: 5,
    quote: "Finding a baby-safe dish soap that doesn't cost a fortune and actually removes greasy milk residue from bottles was impossible until Swishit. Lime Lush is gentle, safe, and ultra-effective.",
    name: "Sneha Ghosh",
    role: "mother of 3 & doctor",
    initials: "SG",
    bg: "bg-pastel-green text-[#15803d]",
    desktopPos: "top-[10%] right-[5%] lg:right-[7%] w-[90%] md:w-[360px] lg:w-[400px]",
    startTime: 4.0,
  },
  {
    id: 6,
    quote: "Protein shaker bottles are notorious for holding onto awful smells even after scrubbing. One pump of Ocean Garden eliminated that stale protein smell instantly. Truly lives up to the hype!",
    name: "Arjun Desai",
    role: "fitness enthusiast",
    initials: "AD",
    bg: "bg-pastel-blue text-[#1d7e9e]",
    desktopPos: "top-[55%] left-1/2 -translate-x-1/2 w-[90%] md:w-[360px] lg:w-[400px]",
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
      isDesktop: "(min-width: 769px)",
      isMobile: "(max-width: 768px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      // Initially hide center community text during testimonial cards float
      gsap.set(centerTextRef.current, { scale: 0.65, opacity: 0, force3D: true });

      // Snappy pinned timeline with zero initial peeking and theatrical text split exit
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: isDesktop ? "+=400%" : "+=480%",
          scrub: true,
        }
      });

      if (isDesktop) {
        // 1. Cards float up across the static text
        cardRefs.current.forEach((card, index) => {
          if (!card) return;

          gsap.set(card, { y: 1200, opacity: 1 });

          const startTime = TESTIMONIALS[index].startTime;

          tl.to(card, {
            y: -1200,
            ease: "none",
            duration: 3.2,
          }, startTime);
        });

        // 2. AFTER testimonials pass, slide out "What they" (left) & "are saying" (right)
        // AND simultaneously reveal "Join the community..." at the exact same start time (6.2)!
        tl.to(topTextRef.current, {
          x: "-120vw",
          ease: "power2.inOut",
          duration: 2.2,
        }, 6.2);

        tl.to(bottomTextRef.current, {
          x: "120vw",
          ease: "power2.inOut",
          duration: 2.2,
        }, 6.2);

        tl.to(centerTextRef.current, {
          scale: 1.0,
          opacity: 1.0,
          ease: "power2.out",
          duration: 2.2,
        }, 6.2);

      } else {
        // Mobile: Sequential conveyor belt
        cardRefs.current.forEach((card, index) => {
          if (!card) return;

          gsap.set(card, { y: 1100, opacity: 1, scale: 1 });

          const startTime = index * 0.8 + 1.5;

          tl.to(card, {
            y: -1100,
            ease: "none",
            duration: 2.8,
          }, startTime);
        });

        // Mobile text split exit & simultaneous community reveal after cards clear
        tl.to(topTextRef.current, {
          x: "-120vw",
          ease: "power2.inOut",
          duration: 2.0,
        }, 6.8);

        tl.to(bottomTextRef.current, {
          x: "120vw",
          ease: "power2.inOut",
          duration: 2.0,
        }, 6.8);

        tl.to(centerTextRef.current, {
          scale: 1.0,
          opacity: 1.0,
          ease: "power2.out",
          duration: 2.0,
        }, 6.8);
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
        className="absolute inset-0 flex flex-col items-start pt-12 md:pt-0 md:items-center justify-center pointer-events-none px-6 md:px-16"
      >
        <div className="relative w-full max-w-6xl flex flex-col items-start justify-center">
          
          {/* Top line: "What they" */}
          <div ref={topTextRef} className="will-change-transform">
            <h2 
              style={{ color: '#173E4A' }}
              className="font-body font-medium text-[clamp(4rem,14vw,14rem)] tracking-tight text-left leading-[0.88]"
            >
              What they
            </h2>
          </div>

          {/* Bottom line: "are saying" */}
          <div ref={bottomTextRef} className="will-change-transform">
            <h2 
              style={{ color: '#173E4A' }}
              className="font-body font-medium text-[clamp(4rem,14vw,14rem)] tracking-tight text-left leading-[0.88]"
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
        className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-center"
      >
        {TESTIMONIALS.map((test, index) => (
          <div
            key={test.id}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{ zIndex: 100 }}
            className={`
              absolute pointer-events-auto bg-white rounded-3xl p-6 md:p-8 
              shadow-2xl border border-neutral-200/80
              flex flex-col justify-between
              ${test.desktopPos}
            `}
          >
            {/* Quote Text - Explicit hex style guarantees 100% dark #1A1A1A contrast */}
            <p 
              style={{ color: '#1A1A1A' }}
              className="font-body text-sm md:text-base font-normal leading-relaxed mb-6 tracking-normal"
            >
              &ldquo;{test.quote}&rdquo;
            </p>

            {/* Footer: Stars + Author Info */}
            <div>
              {/* 5 Stars */}
              <div className="flex items-center gap-1 mb-3">
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm ${test.bg}`}>
                  {test.initials}
                </div>
                <div className="flex flex-col">
                  <span 
                    style={{ color: '#1A1A1A' }}
                    className="font-body font-bold text-sm md:text-base leading-tight"
                  >
                    {test.name}
                  </span>
                  <span 
                    style={{ color: '#173E4A' }}
                    className="font-body font-medium text-xs md:text-sm"
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
