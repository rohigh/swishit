'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Community() {
  const sectionRef = useRef(null);
  const zoomWrapperRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    // 1. Smooth entrance right under testimonials split
    gsap.fromTo(
      zoomWrapperRef.current,
      {
        scale: 0.92,
        opacity: 0,
        y: 30,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      }
    );

    // 2. Staggered spring out for the 3 community cards
    gsap.fromTo(
      cardRefs.current,
      {
        scale: 0.9,
        opacity: 0,
        y: 30,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: sectionRef });

  // Interactive like counter for Social Spotlight card
  const [likes, setLikes] = useState(2481);
  const [liked, setLiked] = useState(false);

  // Interactive Scent Lab voting
  const [votedScent, setVotedScent] = useState(null);

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  const handleVote = (scent) => {
    setVotedScent(scent);
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-base pt-12 md:pt-20 pb-20 md:pb-28 lg:pb-32 px-4 md:px-6 overflow-hidden -mt-36 md:-mt-48" id="community">
      <div className="max-w-7xl mx-auto">
        
        {/* ── ZOOMING CONTENT WRAPPER ───────────────────────────── */}
        <div ref={zoomWrapperRef} className="will-change-transform">
          {/* ── INTERACTIVE COMMUNITY CARDS GRID ───────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 mb-16 md:mb-24">
          
          {/* Card 1: Social Spotlight */}
          <motion.div 
            ref={(el) => (cardRefs.current[0] = el)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-pastel-blue rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-neutral-200/60 shadow-sm relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1D7E9E] text-white flex items-center justify-center font-bold text-sm">
                    PK
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-body font-bold text-sm text-text">
                      @priya_kitchens <span className="text-[#1D7E9E] text-xs">✓</span>
                    </div>
                    <div className="text-xs text-text-muted">Instagram Spotlight</div>
                  </div>
                </div>
                <span className="text-xs font-mono bg-white/60 px-2.5 py-1 rounded-full text-text-muted">
                  #SwishItClean
                </span>
              </div>

              <p className="font-body text-text text-base leading-relaxed mb-8">
                &ldquo;I literally never thought I&apos;d get compliments on my dish soap bottle?! The Ocean Garden pump on my kitchen island looks like luxury skincare 🌊✨ Never hiding soap under the sink again!&rdquo;
              </p>
            </div>

            {/* Interactive Like Button */}
            <div className="pt-6 border-t border-black/5 flex items-center justify-between">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                  liked 
                    ? 'bg-[#1D7E9E] text-white scale-105 shadow-md' 
                    : 'bg-white/80 text-text hover:bg-white'
                }`}
              >
                <span className={liked ? 'animate-bounce' : ''}>❤️</span>
                <span>{liked ? 'Liked!' : 'Like this aesthetic'}</span>
              </button>
              <span className="font-mono text-xs font-semibold text-text-muted">
                {likes.toLocaleString()} likes
              </span>
            </div>
          </motion.div>

          {/* Card 2: Scent Lab Voting */}
          <motion.div 
            ref={(el) => (cardRefs.current[1] = el)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-pastel-yellow rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-neutral-200/60 shadow-sm relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#F0A93B] bg-[#F0A93B]/10 px-3 py-1 rounded-full border border-[#F0A93B]/20">
                  🧪 Scent Lab
                </span>
                <span className="text-xs text-text-muted font-mono">Community Vote</span>
              </div>

              <h3 className="font-heading text-2xl text-text mb-3">
                Vote Next Season&apos;s Scent
              </h3>
              <p className="font-body text-text-muted text-sm leading-relaxed mb-6">
                We craft our Perfume-Lock™ scents with our community. Which limited-edition drop should we brew next?
              </p>
            </div>

            {/* Clickable Voting Pills */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleVote('mandarin')}
                className={`w-full text-left p-3.5 rounded-2xl border font-body text-sm font-medium flex items-center justify-between transition-all duration-200 ${
                  votedScent === 'mandarin'
                    ? 'bg-[#F0A93B] text-[#173E4A] border-[#F0A93B] shadow-md font-semibold'
                    : 'bg-white/70 text-text border-black/5 hover:bg-white'
                }`}
              >
                <span>🍊 Mandarin Sunburst</span>
                <span className="font-mono text-xs font-bold">{votedScent === 'mandarin' ? '62%' : '58%'}</span>
              </button>

              <button 
                onClick={() => handleVote('eucalyptus')}
                className={`w-full text-left p-3.5 rounded-2xl border font-body text-sm font-medium flex items-center justify-between transition-all duration-200 ${
                  votedScent === 'eucalyptus'
                    ? 'bg-[#F0A93B] text-[#173E4A] border-[#F0A93B] shadow-md font-semibold'
                    : 'bg-white/70 text-text border-black/5 hover:bg-white'
                }`}
              >
                <span>🌿 Eucalyptus Rain</span>
                <span className="font-mono text-xs font-bold">{votedScent === 'eucalyptus' ? '54%' : '42%'}</span>
              </button>

              {votedScent && (
                <p className="text-[0.6875rem] text-[#F0A93B] font-mono font-bold text-center mt-1 animate-fadeIn">
                  ✓ Thanks for voting! Drop arrives next month.
                </p>
              )}
            </div>
          </motion.div>

          {/* Card 3: Sustainability Impact */}
          <motion.div 
            ref={(el) => (cardRefs.current[2] = el)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-pastel-green rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-neutral-200/60 shadow-sm relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#1D7E9E] bg-[#1D7E9E]/10 px-3 py-1 rounded-full border border-[#1D7E9E]/20">
                  🌱 Zero Waste
                </span>
                <span className="text-xs text-text-muted font-mono">2026 Impact</span>
              </div>

              <div className="font-heading text-4xl lg:text-5xl text-[#1D7E9E] font-bold mb-2">
                50,000+
              </div>
              <h3 className="font-body font-bold text-lg text-text mb-3">
                Plastic Bottles Saved
              </h3>
              <p className="font-body text-text-muted text-sm leading-relaxed mb-8">
                Our members refill and reuse our signature pump bottles, keeping thousands of single-use plastics out of landfills every single month.
              </p>
            </div>

            <div className="pt-6 border-t border-black/5 flex items-center justify-between">
              <span className="text-xs font-body font-semibold text-text">
                1 Pump = Exact Dose
              </span>
              <span className="text-xs font-mono text-[#1D7E9E] font-bold bg-white/80 px-3 py-1 rounded-full border border-[#1D7E9E]/20">
                0% Spills
              </span>
            </div>
          </motion.div>
        </div>
        </div>

      </div>
    </section>
  );
}
