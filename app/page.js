import Hero from '@/components/Hero';
import Products from '@/components/Products';
import Testimonials from '@/components/Testimonials';

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
    </main>
  );
}
