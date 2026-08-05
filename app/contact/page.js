'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FBF7EC] text-[#173E4A] flex flex-col font-body selection:bg-[#1D7E9E] selection:text-white">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#F5EFD8]/60 to-[#FBF7EC] overflow-hidden">
        {/* Background glow effects — fluid so they don't overflow on small screens */}
        <div className="absolute top-1/3 left-1/4 w-[min(80vw,500px)] aspect-square bg-[#5AB8D6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[min(60vw,300px)] aspect-square bg-[#F0A93B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D7E9E]/15 border border-[#1D7E9E]/30 text-[#155E78] text-xs md:text-sm font-bold tracking-wider uppercase mb-6 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#F0A93B]" />
            We&apos;re Here to Help
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-fluid-4xl font-semibold leading-[1.1] text-[#173E4A] mb-6 tracking-tight"
          >
            Contact <span className="italic font-serif text-[#155E78]">SWISH IT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: '#1D7E9E' }}
            className="text-base md:text-xl text-[#1D7E9E] font-semibold max-w-2xl mx-auto leading-relaxed"
          >
            Have a question about our high-performance hygiene line, order status, or commercial inquiries? Send us a message and our team will get back to you promptly.
          </motion.p>
        </div>
      </section>

      {/* ── MAIN FORM & INFO GRID SECTION ── */}
      <section className="pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_35px_-10px_rgba(23,62,74,0.12)] border border-[#1D7E9E]/20 relative"
          >
            <h2 className="font-heading text-fluid-xl text-[#173E4A] font-bold mb-2">
              Send Us a Message
            </h2>
            <p className="text-[#173E4A] text-sm md:text-base font-medium mb-8">
              Fill out the form below and we&apos;ll respond within 24 business hours.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#EAF7EE] border border-[#2E9ABF]/40 rounded-2xl p-8 text-center space-y-4 my-8"
                >
                  <div className="w-16 h-16 bg-[#1D7E9E] text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
                    ✓
                  </div>
                  <h3 className="font-heading text-2xl text-[#173E4A] font-bold">
                    Message Received!
                  </h3>
                  <p className="text-[#173E4A] text-sm md:text-base font-medium max-w-md mx-auto">
                    Thank you for reaching out to SWISH IT. Our customer care team will review your message and reply shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#173E4A] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#122A33] transition-colors shadow-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#173E4A] font-bold mb-2">
                        Your Name <span className="text-[#D48820]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Jane Doe"
                        className="w-full bg-[#FBF7EC] border-2 border-[#1D7E9E]/25 rounded-xl px-4 py-3 text-sm text-[#173E4A] font-medium placeholder:text-[#173E4A]/50 focus:outline-none focus:border-[#1D7E9E] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#173E4A] font-bold mb-2">
                        Email Address <span className="text-[#D48820]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="jane@example.com"
                        className="w-full bg-[#FBF7EC] border-2 border-[#1D7E9E]/25 rounded-xl px-4 py-3 text-sm text-[#173E4A] font-medium placeholder:text-[#173E4A]/50 focus:outline-none focus:border-[#1D7E9E] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#173E4A] font-bold mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-[#FBF7EC] border-2 border-[#1D7E9E]/25 rounded-xl px-4 py-3 text-sm text-[#173E4A] font-medium focus:outline-none focus:border-[#1D7E9E] focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="General Inquiry">General Product Inquiry</option>
                      <option value="Wholesale">Wholesale & Commercial Orders</option>
                      <option value="Order Support">Order Status & Shipping</option>
                      <option value="Press / Media">Press & Partnerships</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#173E4A] font-bold mb-2">
                      Message <span className="text-[#D48820]">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you achieve an effortless clean?"
                      className="w-full bg-[#FBF7EC] border-2 border-[#1D7E9E]/25 rounded-xl px-4 py-3 text-sm text-[#173E4A] font-medium placeholder:text-[#173E4A]/50 focus:outline-none focus:border-[#1D7E9E] focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#1D7E9E] text-white font-bold text-base hover:bg-[#155E78] transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <span>Send Message &rarr;</span>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Contact Channels & Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Support Card */}
            <div className="bg-[#122A33] text-[#FBF7EC] rounded-3xl p-8 border border-[#5AB8D6]/30 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#F0A93B]/10 rounded-bl-full pointer-events-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#F0A93B] font-bold block mb-2">
                Customer Support
              </span>
              <h3 className="font-heading text-2xl mb-4 font-bold text-white">
                Direct Email Assistance
              </h3>
              <p className="text-[#82CCDF] text-sm mb-6 leading-relaxed font-normal">
                For customer service, order changes, or general product feedback:
              </p>
              
              <div className="space-y-3">
                <a
                  href="mailto:support@swishit.app"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#173E4A] hover:bg-[#1F4B5A] text-[#FBF7EC] transition-colors group border border-[#5AB8D6]/20"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1D7E9E] text-white flex items-center justify-center shrink-0 shadow-sm">
                    ✉
                  </div>
                  <div>
                    <div className="text-xs text-[#82CCDF] font-mono font-semibold">General Enquiries</div>
                    <div className="font-bold text-sm text-white group-hover:text-[#F0A93B] transition-colors">support@swishit.app</div>
                  </div>
                </a>

                <a
                  href="mailto:wholesale@swishit.app"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#173E4A] hover:bg-[#1F4B5A] text-[#FBF7EC] transition-colors group border border-[#5AB8D6]/20"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F0A93B] text-[#122A33] flex items-center justify-center shrink-0 font-bold shadow-sm">
                    💼
                  </div>
                  <div>
                    <div className="text-xs text-[#82CCDF] font-mono font-semibold">Commercial & Wholesale</div>
                    <div className="font-bold text-sm text-white group-hover:text-[#F0A93B] transition-colors">wholesale@swishit.app</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#1D7E9E]/20 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1D7E9E] text-white flex items-center justify-center font-bold shadow-sm">
                  🕒
                </div>
                <div>
                  <h4 className="font-heading text-xl text-[#173E4A] font-bold">Hours & Availability</h4>
                  <p className="text-xs text-[#173E4A] font-medium">Fast support Monday through Friday</p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 text-sm pt-2">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#173E4A] font-medium">Monday – Friday</span>
                  <span className="font-bold text-[#173E4A]">9:00 AM – 6:00 PM EST</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#173E4A] font-medium">Saturday & Sunday</span>
                  <span className="font-bold text-[#155E78]">Email Only</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#173E4A] font-medium">Response Guarantee</span>
                  <span className="font-bold text-[#D48820] font-mono">Under 24 Hours</span>
                </div>
              </div>
            </div>

            {/* Brand Promise Callout */}
            <div className="bg-[#E8F5F8] rounded-3xl p-8 border border-[#1D7E9E]/25 text-center space-y-3 shadow-sm">
              <span className="text-2xl">✨</span>
              <h4 className="font-heading text-xl text-[#173E4A] font-bold">The SWISH IT Care Standard</h4>
              <p className="text-xs text-[#173E4A] leading-relaxed font-medium">
                Every query is handled by real team members who know our products inside out. Your satisfaction is our priority.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── QUICK FAQ SECTION ── */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-[#F5EFD8]/60 border-t border-[#1D7E9E]/15">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-heading text-fluid-xl text-[#173E4A] font-semibold">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#1D7E9E]/20 shadow-md">
              <h4 className="font-bold text-[#173E4A] text-lg mb-2">How fast do orders ship?</h4>
              <p className="text-sm text-[#173E4A] leading-relaxed font-medium">
                Orders are processed within 1-2 business days and shipped with standard tracking.
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#1D7E9E]/20 shadow-md">
              <h4 className="font-bold text-[#173E4A] text-lg mb-2">Do you offer bulk commercial supply?</h4>
              <p className="text-sm text-[#173E4A] leading-relaxed font-medium">
                Yes! We serve restaurants, hotels, and commercial kitchens with custom bulk packaging options.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/#faq" className="text-sm font-bold text-[#155E78] hover:text-[#173E4A] hover:underline">
              View all FAQs on our homepage &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
