import Hero from '@/components/Hero';
import Products from '@/components/Products';
import Testimonials from '@/components/Testimonials';
import Community from '@/components/Community';
import InstagramSection from '@/components/InstagramSection';
import { FAQ } from '@/components/ui/faq-section';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Swishit – Dishwashing Dew',
  description: 'Plant-powered dishwashing liquid',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-base">
      <Hero />
      <Products />
      <Testimonials />
      <Community />
      <InstagramSection />
      <FAQ />
      <Footer />
    </main>
  );
}
