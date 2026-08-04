import HeroBanner from '../components/home/HeroBanner';
import FeaturedCollections from '../components/home/FeaturedCollections';
import CategoryShowcase from '../components/home/CategoryShowcase';
import TrendingSection from '../components/home/TrendingSection';
import BrandStory from '../components/home/BrandStory';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import InstagramGallery from '../components/home/InstagramGallery';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedCollections />
      <TrendingSection />
      <BrandStory />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
    </div>
  );
}
