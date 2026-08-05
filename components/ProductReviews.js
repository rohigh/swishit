'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: 'Ananya R.',
    rating: 5,
    date: '2 days ago',
    verified: true,
    title: 'Looks like a luxury product and works amazingly!',
    comment: 'Hands down the best dishwash I have ever used. The glass-look bottle looks stunning on my kitchen counter, and Ocean Garden smells like a high-end spa.',
    scent: 'Ocean Garden',
  },
  {
    id: 2,
    name: 'Rahul M.',
    rating: 5,
    date: '1 week ago',
    verified: true,
    title: 'One pump really does clean the whole sink',
    comment: 'I was skeptical about the one-pump claim, but Lime Lush cut through my heavy Indian cooking grease and fish curry odors in seconds. Highly recommend!',
    scent: 'Lime Lush',
  },
  {
    id: 3,
    name: 'Priya S.',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    title: 'Sparkling glassware with zero soapy residue',
    comment: 'Rinses off completely clean without leaving cloudy films or artificial perfume smells on our wine glasses and baby bottles.',
    scent: 'Trio Collection',
  },
  {
    id: 4,
    name: 'Karan T.',
    rating: 5,
    date: '3 weeks ago',
    verified: true,
    title: 'Gentle on hands, tough on oil',
    comment: 'My hands used to get dry and irritated from regular store dishwash liquids. Swishit keeps my skin soft even after washing a full dinner party sink.',
    scent: 'Lemon Loop',
  },
];

export default function ProductReviews({ productName = 'Swishit Dishwashing Dew' }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // New Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const userReview = {
      id: Date.now(),
      name: newName.trim(),
      rating: newRating,
      date: 'Just now',
      verified: true,
      title: newTitle.trim() || 'Verified Purchase Review',
      comment: newComment.trim(),
      scent: productName,
    };

    setReviews([userReview, ...reviews]);
    setFormSubmitted(true);

    setTimeout(() => {
      setShowReviewForm(false);
      setFormSubmitted(false);
      setNewName('');
      setNewTitle('');
      setNewComment('');
      setNewRating(5);
    }, 2000);
  };

  return (
    <div className="w-full py-8 text-[#173E4A]">
      {/* ── RATINGS OVERVIEW HEADER ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#173E4A]/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 md:gap-8 items-center">
          
          {/* Average Score Box */}
          <div className="sm:col-span-2 md:col-span-4 text-center md:text-left md:border-r border-[#173E4A]/10 md:pr-8">
            <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
              <span className="text-5xl font-heading font-bold text-[#173E4A]">4.9</span>
              <span className="text-lg font-medium text-[#173E4A]/60">/ 5.0</span>
            </div>
            
            {/* Stars */}
            <div className="flex justify-center md:justify-start gap-1 text-amber-400 text-lg mb-2">
              {'★★★★★'}
            </div>
            <p className="text-xs text-[#173E4A]/70 font-medium">Based on 2,500+ verified customer reviews</p>
            
            <div className="mt-4 pt-4 border-t border-[#173E4A]/10 flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-green-700">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              98% of customers recommend this product
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="sm:col-span-2 md:col-span-5 space-y-2">
            {[
              { stars: '5 ★', percent: 88, count: '2,200' },
              { stars: '4 ★', percent: 9, count: '225' },
              { stars: '3 ★', percent: 2, count: '50' },
              { stars: '2 ★', percent: 1, count: '25' },
              { stars: '1 ★', percent: 0, count: '0' },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-semibold font-mono text-[#173E4A]">{item.stars}</span>
                <div className="flex-grow h-2.5 bg-[#F4F1EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#155E78] rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-[#173E4A]/60">{item.percent}%</span>
              </div>
            ))}
          </div>

          {/* Write a Review Button */}
          <div className="sm:col-span-2 md:col-span-3 text-center">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full py-3.5 px-6 rounded-full bg-[#173E4A] hover:bg-[#155E78] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              {showReviewForm ? 'Cancel Review' : '★ Write a Review'}
            </button>
          </div>
        </div>
      </div>

      {/* ── WRITE A REVIEW FORM MODAL ── */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#155E78]/20 shadow-lg">
              <h3 className="text-xl font-heading font-semibold text-[#173E4A] mb-2">
                Write Your Review
              </h3>
              <p className="text-xs text-[#173E4A]/70 mb-6">
                Share your experience with SWISH IT. Your review helps other customers move faster and live healthier.
              </p>

              {formSubmitted ? (
                <div className="p-6 bg-green-50 rounded-2xl text-center text-green-800 font-semibold text-sm">
                  🎉 Thank you for your feedback! Your review has been published.
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-[#173E4A] mb-2">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`text-2xl transition-transform ${
                            star <= newRating ? 'text-amber-400 scale-110' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">Review Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Amazing grease-cutting power!"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173E4A] mb-1">Your Review</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what you liked about the scent, suds, and cleaning performance..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full bg-[#173E4A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#155E78] transition-all shadow-md"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REVIEWS LIST ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-[#173E4A] mb-4">
          Customer Feedbacks ({reviews.length})
        </h3>

        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 sm:p-5 md:p-6 rounded-3xl bg-white border border-[#173E4A]/10 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-[#173E4A]">{rev.name}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-xs text-[#173E4A]/50 font-mono">{rev.date}</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-amber-400 text-xs">
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>
              <h4 className="font-semibold text-sm text-[#173E4A]">{rev.title}</h4>
            </div>

            <p className="text-sm text-[#173E4A]/80 leading-relaxed font-body">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
