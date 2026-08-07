"use client"

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const PhoneCallIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const FAQS_DATA = [
  {
    question: "Is Swishit safe for sensitive skin and daily hand dishwashing?",
    answer: "Yes, 100%! Swishit is plant-powered, dermatologically tested, and free from harsh synthetic sulfates or parabens. It cuts through grease while keeping your hands soft, hydrated, and protected."
  },
  {
    question: "How does the Perfume-Lock™ odor elimination technology work?",
    answer: "Our proprietary Perfume-Lock™ formula neutralizes tough food odors (like fish curry, onions, garlic, and stale milk) at the molecular level, leaving your glassware and kitchen smelling fresh without transferring scents onto your food."
  },
  {
    question: "Is one pump really enough for a full sink of dirty dishes?",
    answer: "Yes! Our high-density concentrated formula produces long-lasting suds. One push of our precision pump dispenses the exact dosage needed to clean an entire typical sink load—zero spills, zero waste."
  },
  {
    question: "Can I refill and reuse the signature glass-look pump bottle?",
    answer: "Absolutely! Our heavy-duty pump bottles are engineered for infinite refills. You can order our eco-friendly refill pouches to save money while keeping single-use plastics out of landfills."
  },
  {
    question: "Is Swishit safe for baby bottles, pet dishes, and fine wine glasses?",
    answer: "Yes. Swishit rinses off completely clean without leaving cloudy films, soapy residue, or chemical aftertastes, making it completely safe for baby bottles, pet bowls, and delicate crystal glassware."
  },
  {
    question: "What scents are currently available?",
    answer: "We currently offer three signature drops: Ocean Garden (crisp marine mist), Lime Lush (zesty citrus leaf), and Lemon Loop (sunlit vibrant lemon). You can also order the Trio Collection bundle!"
  }
];

function FAQ() {
  return (
    <section className="w-full py-20 lg:py-32 bg-base border-t border-[#155E78]/10" id="faq">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Support */}
          <div className="flex gap-8 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="outline" className="border-[#1D7E9E]/30 text-[#1D7E9E] text-xs font-mono uppercase tracking-widest px-3.5 py-1 bg-[#1D7E9E]/10" style={{ color: '#1D7E9E' }}>
                  FAQ
                </Badge>
              </div>
              <div className="flex gap-4 flex-col">
                <h4 
                  style={{ color: 'var(--color-text)' }}
                  className="text-3xl md:text-5xl tracking-tight text-left font-heading font-medium text-text leading-tight"
                >
                  Everything you need to know about Swishit
                </h4>
                <p 
                  style={{ color: 'var(--color-text)' }}
                  className="text-base md:text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-text text-left font-body font-medium"
                >
                  Got questions about our plant-powered formula, infinite refill bottles, or shipping? We&apos;ve got answers. If you need further help, our team is always here for you.
                </p>
              </div>
              <div className="pt-2">
                <button 
                  className="inline-flex items-center gap-3 rounded-full px-6 h-12 bg-[#F0A93B] text-text hover:bg-[#D48820] hover:text-white font-body text-sm font-semibold transition-all shadow-md cursor-pointer"
                  style={{ backgroundColor: '#F0A93B', color: 'var(--color-text)' }}
                >
                  <span>Any questions? Reach out</span> 
                  <PhoneCallIcon className="w-4 h-4 text-text" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Accordion */}
          <Accordion type="single" collapsible className="w-full" defaultValue="faq-0">
            {FAQS_DATA.map((faq, index) => (
              <AccordionItem key={index} value={"faq-" + index}>
                <AccordionTrigger>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        </div>
      </div>
    </section>
  );
}

function FAQDemo() {
  return (
    <div className="w-full">
      <FAQ />
    </div>
  );
}

export { FAQ, FAQDemo };
