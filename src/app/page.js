import Hero from '@/components/layout/Hero';
import HomeMenu from '@/components/layout/HomeMenu';

export default function Home() {
  return (
    <>
      <div className="py-9" /> {/* Spacer */}
      <Hero />
      <div className="py-4" /> {/* Spacer */}
      <HomeMenu />
    </>
  );
}
