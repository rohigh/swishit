'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import blueBottleImg from '../public/img/ocean garden edited.png';
import handImg from '../public/img/hands (1).png';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const handRef = useRef(null);
  const bigTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const introUspTextRef = useRef(null);
  const usp1Ref = useRef(null);
  const usp2Ref = useRef(null);
  const usp3Ref = useRef(null);

  // Scroll Wrappers (to decouple entrance and scroll animations)
  const scrollHandRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRightTextRef = useRef(null);
  const scrollImageRef = useRef(null);
  const scrollBigTextRef = useRef(null);

  useGSAP(() => {
    // ── ENTRANCE ANIMATION ──────────────────────────
    // Elements start with visibility:hidden in JSX.
    // We position them with gsap.set, make them visible, then play the timeline.
    
    const entranceElements = [
      containerRef.current,
      textRef.current,
      imageRef.current,
      handRef.current,
      bigTextRef.current,
      rightTextRef.current,
    ];

    // Set initial positions with force3D:true and opacity:0.01 to pre-warm GPU hardware layers
    gsap.set(containerRef.current, { y: 0, x: 0, force3D: true });
    gsap.set(textRef.current, { y: 220, opacity: 0.01, scale: 0.95, force3D: true });
    gsap.set(imageRef.current, { y: 500, opacity: 0.01, force3D: true });
    gsap.set(handRef.current, { y: 550, opacity: 0.01, force3D: true });
    gsap.set(bigTextRef.current, { y: 250, opacity: 0.01, force3D: true });
    gsap.set(rightTextRef.current, { y: 350, opacity: 0.01, force3D: true });

    // Now make them all visible (they're at opacity:0.01 / offscreen, so nothing shows)
    entranceElements.forEach(el => {
      if (el) el.style.visibility = 'visible';
    });

    // Build the timeline PAUSED so it can't run during image decode
    const tl = gsap.timeline({ paused: true });

    // 1. Text fades in at left center (0.1s to 0.7s)
    tl.to(textRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      force3D: true
    }, 0.1)
    // 2. 0.2s DELAY! (0.7s + 0.2s = 0.9s). Text glides upwards to final position
    .to(textRef.current, {
      y: 0,
      duration: 1.4,
      ease: "power2.out",
      force3D: true
    }, 0.9)
    // 3. Right after the 0.2s delay (at 0.9s), bottle, hand, bg text, and right text come up!
    .to(imageRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.6,
      ease: "power3.out",
      force3D: true
    }, 0.9)
    .to(handRef.current, {
      y: 0,
      opacity: 0.95,
      duration: 1.6,
      ease: "power3.out",
      force3D: true
    }, 0.9)
    .to(bigTextRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.6,
      ease: "power3.out",
      force3D: true
    }, 0.9)
    .to(rightTextRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: "power3.out",
      force3D: true
    }, 0.9);

    // Wait for the browser to paint one frame, THEN play
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tl.play();
      });
    });

    // ── SCROLL TRIGGER TIMELINE WITH MATCHMEDIA ──────
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 641px)",
      isMobile: "(max-width: 640px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: "+=350%",
          scrub: true, 
        }
      });

      scrollTl
        .to(scrollHandRef.current, { y: 600, opacity: 0, ease: "power1.inOut" }, 0)
        .to(scrollContainerRef.current, { y: -100, opacity: 0, ease: "power1.inOut" }, 0)
        .to(scrollRightTextRef.current, { x: 100, opacity: 0, ease: "power1.inOut" }, 0)
        .to(scrollImageRef.current, { y: 280, scale: 1.1, ease: "power1.inOut" }, 0)
        .fromTo('.usp-word',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, ease: "power2.out", stagger: 0.05 }, 0.2
        )
        // 1. Intro text fades out and bottle moves right (desktop) or stays down (mobile)
        .to(introUspTextRef.current, { y: -60, opacity: 0, ease: "power1.inOut" }, 1.5)
        .to(scrollImageRef.current, { 
          x: isDesktop ? "10vw" : 0, 
          y: isDesktop ? 40 : 280, 
          scale: isDesktop ? 1.15 : 1.1, 
          ease: "power2.inOut" 
        }, 1.5)
        // 2. The 3 USPs appear one by one
        .fromTo(usp1Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power2.out" }, 2.0)
        .fromTo(usp2Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power2.out" }, 2.5)
        .fromTo(usp3Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power2.out" }, 3.0)
        // 3. Keep "Swish It" bg text visible during USPs, fade out at end of hero scroll
        .to(scrollBigTextRef.current, { opacity: 0, y: 80, ease: "power1.in" }, 3.3);
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-base">
      
      {/* ── GRAPHIC LAYER ─────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-end overflow-hidden pb-32 md:pb-40">
        
        {/* Massive Background Text */}
        <div ref={scrollBigTextRef} className="absolute inset-x-0 bottom-0 z-[-1] pointer-events-none flex items-end justify-center pb-2 md:pb-6 overflow-hidden">
          <div
            ref={bigTextRef}
            className="flex justify-center w-full"
            style={{ visibility: 'hidden' }}
          >
            <span className="text-[22vw] leading-none font-bold text-black/[0.035] tracking-tighter whitespace-nowrap">
              Swish It
            </span>
          </div>
        </div>

        {/* Hand Graphic */}
        <div ref={scrollHandRef} className="absolute bottom-0 -translate-y-14 md:translate-y-16 w-full flex justify-center z-0 pointer-events-none">
          <div 
            ref={handRef}
            className="relative w-[350px] h-[370px] md:w-[850px] md:h-[500px] lg:w-[950px] lg:h-[550px]"
            style={{ visibility: 'hidden' }}
          >
            <Image 
              src={handImg} 
              alt="Hand Reaching Up" 
              fill 
              sizes="(max-width: 768px) 320px, 950px"
              quality={80}
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* Product Graphic */}
        <div ref={scrollImageRef} className="relative z-10">
          <div 
            ref={imageRef} 
            className="relative w-[450px] h-[650px] md:w-[780px] md:h-[980px]"
            style={{ visibility: 'hidden' }}
          >
            <Image 
              src={blueBottleImg} 
              alt="Swishit Blue Bottle" 
              fill 
              sizes="(max-width: 768px) 450px, 780px"
              quality={80}
              className="object-contain scale-[1.5]"
              priority
            />
          </div>
        </div>

        {/* Intro USP Text that appears on scroll */}
        <div 
          ref={introUspTextRef}
          className="absolute left-1/2 -translate-x-1/2 top-[30%] md:top-[35%] w-full max-w-4xl text-center px-6 z-30"
        >
          <p className="font-body text-xl md:text-3xl lg:text-4xl text-text font-medium leading-normal tracking-tight">
            {"Engineered to eliminate the mess, cut through stubborn Indian grease,".split(" ").map((word, i) => (
              <span key={`w1-${i}`} className="usp-word inline-block opacity-0 -translate-x-4">{word}&nbsp;</span>
            ))}
            <br className="hidden md:block" />
            {"and leave your kitchen smelling genuinely clean.".split(" ").map((word, i) => (
              <span key={`w2-${i}`} className="usp-word inline-block opacity-0 -translate-x-4">{word}&nbsp;</span>
            ))}
          </p>
        </div>

        {/* 3 USPs List Layer that builds up on scroll */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-start px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
          <div className="w-full md:w-[45%] lg:w-[42%] max-w-[480px] flex flex-col justify-center gap-3 md:gap-5">
            
            {/* USP 1 */}
            <div ref={usp1Ref} className="opacity-0 translate-y-8 border-t border-gray-300/80 pt-4 pb-2 md:pt-5 md:pb-3 pointer-events-auto bg-base/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-lg md:rounded-none px-3 md:px-0">
              <div className="flex items-center gap-3 mb-1 md:mb-2">
                <span className="text-xs md:text-sm font-mono font-bold text-[#1D7E9E]">01</span>
                <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-gray-500">The Pump</span>
              </div>
              <p className="font-body text-base md:text-xl lg:text-2xl text-text font-medium leading-snug">
                One perfect push gives you the exact amount of soap every time—no tilts, no spills, and zero waste.
              </p>
            </div>

            {/* USP 2 */}
            <div ref={usp2Ref} className="opacity-0 translate-y-8 border-t border-gray-300/80 pt-4 pb-2 md:pt-5 md:pb-3 pointer-events-auto bg-base/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-lg md:rounded-none px-3 md:px-0">
              <div className="flex items-center gap-3 mb-1 md:mb-2">
                <span className="text-xs md:text-sm font-mono font-bold text-[#1D7E9E]">02</span>
                <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-gray-500">The Formula</span>
              </div>
              <p className="font-body text-base md:text-xl lg:text-2xl text-text font-medium leading-snug">
                Effortlessly cuts through tough dal and fish curry grease while keeping your hands soft.
              </p>
            </div>

            {/* USP 3 */}
            <div ref={usp3Ref} className="opacity-0 translate-y-8 border-t border-gray-300/80 pt-4 pb-2 md:pt-5 md:pb-3 pointer-events-auto bg-base/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-lg md:rounded-none px-3 md:px-0">
              <div className="flex items-center gap-3 mb-1 md:mb-2">
                <span className="text-xs md:text-sm font-mono font-bold text-[#1D7E9E]">03</span>
                <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-gray-500">The Scent</span>
              </div>
              <p className="font-body text-base md:text-xl lg:text-2xl text-text font-medium leading-snug">
                Perfume-Lock™ technology ensures your dishes and kitchen smell vibrantly fresh, never chemical.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ── CONTENT LAYER ─────────────────────────── */}
      <div className="container-content relative z-20 w-full h-full mx-auto px-8 md:px-16 lg:px-24 max-w-none pt-24 md:pt-32 pb-10 flex flex-col justify-between min-h-screen pointer-events-none">
        
        <div className="flex flex-col lg:flex-row justify-between items-start mt-4 md:mt-16 pointer-events-auto">
          
          {/* Top Left: Heading Group */}
          <div ref={scrollContainerRef}>
            <div ref={containerRef} className="flex flex-col gap-4 max-w-xl">
              <div ref={textRef} style={{ visibility: 'hidden' }}>
                <h1
                  className="font-body font-medium text-text tracking-tight leading-[1.05]"
                  style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}
                >
                  You&apos;re doing <br />
                  the dishes anyway. <br />
                  <span className="text-[#1D7E9E]">Might as well not hate it.</span>
                </h1>
              </div>
            </div>
          </div>
          
        </div>

        {/* Middle Right: Description Text */}
        <div className="absolute right-6 md:right-16 lg:right-24 top-[40%] md:top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
          <div ref={scrollRightTextRef}>
            <div 
              ref={rightTextRef}
              className="max-w-[220px] md:max-w-[280px]"
              style={{ visibility: 'hidden' }}
            >
              <p className="font-body text-base md:text-xl text-black leading-snug tracking-tight text-right">
                Fast pump action. Signature scent.<br/>No squeeze, no spills, no drama.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
