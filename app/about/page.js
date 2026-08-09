'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstagramSection from '@/components/InstagramSection';



export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#FBF7EC] text-text flex flex-col font-body selection:bg-[#1D7E9E] selection:text-white">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-[#F5EFD8]/60 to-[#FBF7EC]">
        {/* Background Ambient Glows — fluid so they don't overflow on small screens */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(90vw,600px)] aspect-square bg-[#5AB8D6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[min(60vw,350px)] aspect-square bg-[#F0A93B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D7E9E]/15 border border-[#1D7E9E]/30 text-text text-xs md:text-sm font-bold tracking-wider uppercase mb-6 shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#F0A93B]" />
              About SWISH IT
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-fluid-4xl font-semibold leading-[1.1] text-text mb-8 tracking-tight"
            >
              The Standard for <br />
              <span className="italic font-serif text-text">Effortless Clean</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl lg:text-2xl text-text leading-relaxed font-medium max-w-3xl mx-auto mb-12"
            >
              At <strong className="font-bold text-[#0F2931]">SWISH IT</strong>, we believe that a clean environment is the foundation for a confident life. We founded this company to cut through the complexity of traditional cleaning, delivering a line of hygiene products that are powerful, precise, and a pleasure to use.
            </motion.p>
          </motion.div>

          {/* Visual Showcase Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-4 rounded-3xl overflow-hidden shadow-2xl border border-[#1D7E9E]/20 bg-[#122A33] text-[#FBF7EC] p-8 md:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono tracking-widest text-[#F0A93B] uppercase font-bold">
                Engineering Efficacy
              </span>
              <h2 className="font-heading text-fluid-2xl leading-tight text-white font-medium">
                Designed to simplify chores into quick, satisfying moments.
              </h2>
              <p className="text-[#82CCDF] text-base md:text-lg leading-relaxed font-normal">
                We combine modern plant-powered chemistry with ergonomic design so you can spend less time scrubbing and more time living.
              </p>
              
              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-[#5AB8D6]/20">
                <div>
                  <div className="font-heading text-fluid-xl text-[#F0A93B] font-bold">3x</div>
                  <div className="text-xs text-[#82CCDF] font-mono mt-1 font-semibold">Concentrated</div>
                </div>
                <div>
                  <div className="font-heading text-fluid-xl text-[#F0A93B] font-bold">0%</div>
                  <div className="text-xs text-[#82CCDF] font-mono mt-1 font-semibold">Harsh Residue</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-72 md:h-96 rounded-2xl overflow-hidden flex items-center justify-center bg-[#155E78]/60 border border-[#5AB8D6]/20">
              <Image
                src="/img/blue-nobg.jpeg"
                alt="SWISH IT Signature Dishwashing Dew"
                fill
                className="object-contain p-6 hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OUR MISSION SECTION ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-[#FBF7EC] relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-text font-bold block mb-3">
              Our Purpose
            </span>
            <h2 className="font-heading text-fluid-2xl text-text font-semibold tracking-tight">
              Our Mission: <span className="italic text-text">Beyond Clean, To Confidence</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl p-8 md:p-14 shadow-[0_12px_40px_-12px_rgba(23,62,74,0.12)] border border-[#1D7E9E]/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0A93B]/10 rounded-bl-full pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#1D7E9E] text-white flex items-center justify-center shadow-md">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <blockquote className="font-heading text-fluid-xl text-text leading-snug font-normal">
                &ldquo;Our mission is simple: to make dishwashing suck less, with fast-acting formulas that smell incredible and actually work.&rdquo;
              </blockquote>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <span className="px-5 py-2 rounded-full bg-[#155E78] text-white text-xs font-bold font-mono shadow-sm">Move Faster</span>
                <span className="px-5 py-2 rounded-full bg-[#1D7E9E] text-white text-xs font-bold font-mono shadow-sm">Live Healthier</span>
                <span className="px-5 py-2 rounded-full bg-[#D48820] text-white text-xs font-bold font-mono shadow-sm">Effortless SWISH</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CORE COMMITMENTS SECTION ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-[#F5EFD8]/60 border-y border-[#1D7E9E]/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span style={{ color: 'var(--color-text)' }} className="text-xs font-mono uppercase tracking-widest text-text font-bold block">
              WHAT DRIVES US
            </span>
            <h2 style={{ color: 'var(--color-text)' }} className="font-heading text-fluid-2xl text-text font-semibold tracking-tight">
              Our Core Commitments
            </h2>
            <p style={{ color: '#1D7E9E' }} className="text-[#1D7E9E] text-base md:text-lg font-semibold">
              Our philosophy guides everything from product formulation to customer support. When you choose SWISH IT, you choose a brand committed to:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Commitment 1 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#1D7E9E]/20 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1D7E9E] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 style={{ color: 'var(--color-text)' }} className="font-heading text-2xl text-text font-bold mb-4">
                  Plant-Powered Chemistry
                </h3>
                <p style={{ color: '#1D7E9E' }} className="text-[#1D7E9E] text-sm md:text-base leading-relaxed font-semibold">
                  We formulate exclusively with organic coconut and citric acid-derived surfactants. It cuts through tough Indian grease instantly without drying out your hands.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center text-xs font-mono text-text font-bold">
                <span style={{ color: 'var(--color-text)' }}>PLANT-BASED &bull; TOUGH ON GREASE</span>
              </div>
            </motion.div>

            {/* Commitment 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#1D7E9E]/20 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#155E78] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 style={{ color: 'var(--color-text)' }} className="font-heading text-2xl text-text font-bold mb-4">
                  The Perfect Pump
                </h3>
                <p style={{ color: '#1D7E9E' }} className="text-[#1D7E9E] text-sm md:text-base leading-relaxed font-semibold">
                  No more messy squeezing or sticky caps. One perfect push delivers the exact amount of soap every time—eliminating spills and maximizing every drop.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center text-xs font-mono text-text font-bold">
                <span style={{ color: 'var(--color-text)' }}>EXACT DOSE &bull; ZERO SPILLS</span>
              </div>
            </motion.div>

            {/* Commitment 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#1D7E9E]/20 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D48820] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 style={{ color: 'var(--color-text)' }} className="font-heading text-2xl text-text font-bold mb-4">
                  Zero Harsh Fillers
                </h3>
                <p style={{ color: '#1D7E9E' }} className="text-[#1D7E9E] text-sm md:text-base leading-relaxed font-semibold">
                  We are certified cruelty-free and vegan. Our formula contains absolutely no synthetic sulfates, parabens, or artificial dyes, making it safe for baby bottles and sensitive skin.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center text-xs font-mono text-text font-bold">
                <span style={{ color: 'var(--color-text)' }}>NON-TOXIC &bull; VEGAN</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THE SWISH IT DIFFERENCE SECTION ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-[#FBF7EC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-text font-bold block">
                Why We Stand Out
              </span>
              <h2 className="font-heading text-fluid-2xl text-text leading-tight font-semibold">
                The SWISH IT <br />
                <span className="italic text-text">Difference</span>
              </h2>
              <p className="text-text text-base md:text-lg leading-relaxed font-medium">
                In a crowded market, what makes us stand out is our commitment to the effortless result. We don&apos;t just sell cleaning products; we sell time back, peace of mind, and the confidence that comes from a truly hygienic space.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#1D7E9E]/20 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#1D7E9E] text-white flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-text text-base">Time Back</h4>
                    <p className="text-xs text-text font-medium">Fast-acting formulas reduce kitchen cleanup time dramatically.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#1D7E9E]/20 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#155E78] text-white flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-text text-base">Peace of Mind</h4>
                    <p className="text-xs text-text font-medium">Non-toxic, residue-free chemistry safe for your whole family.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#1D7E9E]/20 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#D48820] text-white flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-text text-base">Hygienic Space</h4>
                    <p className="text-xs text-text font-medium">Commercial-grade clarity and freshness after every single wash.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Bottles Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-[#E8F5F8] p-6 border border-[#1D7E9E]/20 flex flex-col justify-between group">
                  <Image
                    src="/img/lime lush edited.png"
                    alt="Lime Lush Dishwashing Dew"
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-10 bg-[#155E78] text-white px-3 py-1.5 rounded-full text-xs font-mono w-max font-bold shadow-md">
                    Lime Lush &bull; Zesty
                  </div>
                </div>
                
                <div className="bg-[#122A33] text-white p-6 md:p-8 rounded-3xl border border-[#5AB8D6]/20 shadow-md">
                  <span className="text-3xl font-heading text-[#F0A93B] font-bold">0%</span>
                  <p className="text-xs font-mono text-[#82CCDF] mt-2 font-semibold">Harmful Fillers or Harsh Bleach</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
                <div className="bg-[#1D7E9E] text-white p-6 md:p-8 rounded-3xl shadow-lg">
                  <span className="text-3xl font-heading text-white font-bold">1 Swish</span>
                  <p className="text-xs font-mono text-white/90 mt-2 font-semibold">Leaves Surfaces Squeaky Clean</p>
                </div>

                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-[#FFF8E7] p-6 border border-[#F0A93B]/30 flex flex-col justify-between group">
                  <Image
                    src="/img/lemon edited.png"
                    alt="Lemon Loop Dishwashing Dew"
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-10 bg-[#155E78] text-white px-3 py-1.5 rounded-full text-xs font-mono w-max font-bold shadow-md">
                    Lemon Loop &bull; Radiant
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHO WE PROUDLY SERVE SECTION ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-[#122A33] text-[#FBF7EC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F0A93B] font-bold block">
              Our Community
            </span>
            <h2 className="font-heading text-fluid-2xl font-semibold tracking-tight text-white">
              We Proudly Serve
            </h2>
            <p className="text-[#82CCDF] text-base md:text-lg font-normal">
              Designed for anyone who appreciates quality, efficiency, and exceptional cleanliness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#155E78] rounded-3xl p-8 border border-[#5AB8D6]/30 flex flex-col justify-between hover:border-[#F0A93B]/60 transition-colors shadow-md">
              <div>
                <div className="text-4xl mb-6">🏡</div>
                <h3 className="font-heading text-2xl text-white font-bold mb-3">
                  Households
                </h3>
                <p className="text-[#82CCDF] text-sm md:text-base leading-relaxed">
                  Households looking for reliable, fast-acting cleanliness that protects skin and leaves dishes immaculate.
                </p>
              </div>
              <div className="mt-8 text-xs font-mono text-[#F0A93B] font-bold">
                RELIABLE &bull; FAST-ACTING
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#155E78] rounded-3xl p-8 border border-[#5AB8D6]/30 flex flex-col justify-between hover:border-[#F0A93B]/60 transition-colors shadow-md">
              <div>
                <div className="text-4xl mb-6">✨</div>
                <h3 className="font-heading text-2xl text-white font-bold mb-3">
                  Professionals
                </h3>
                <p className="text-[#82CCDF] text-sm md:text-base leading-relaxed">
                  Professionals who demand consistent, commercial-grade results in culinary and hospitality spaces.
                </p>
              </div>
              <div className="mt-8 text-xs font-mono text-[#F0A93B] font-bold">
                COMMERCIAL-GRADE &bull; CONSISTENT
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#155E78] rounded-3xl p-8 border border-[#5AB8D6]/30 flex flex-col justify-between hover:border-[#F0A93B]/60 transition-colors shadow-md">
              <div>
                <div className="text-4xl mb-6">⚡</div>
                <h3 className="font-heading text-2xl text-white font-bold mb-3">
                  Simplicity Seekers
                </h3>
                <p className="text-[#82CCDF] text-sm md:text-base leading-relaxed">
                  Anyone who believes that a superior clean should never be a struggle or a standard compromise.
                </p>
              </div>
              <div className="mt-8 text-xs font-mono text-[#F0A93B] font-bold">
                EFFORTLESS &bull; MODERN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#FBF7EC] to-[#F5EFD8] text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-xs font-mono uppercase tracking-widest text-text font-bold block">
            START YOUR SWISH
          </span>
          <h2 className="font-heading text-fluid-2xl text-text font-semibold leading-tight">
            Experience the advantage of a clean that&apos;s <br />
            <span className="italic text-text">powerful, modern, and immediate.</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full bg-[#1D7E9E] text-white font-bold hover:bg-[#155E78] transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base"
            >
              Explore Our Shop &rarr;
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#155E78] text-white font-bold hover:bg-[#122A33] transition-all shadow-md text-sm md:text-base"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      <InstagramSection />
      <Footer />
    </div>
  );
}
