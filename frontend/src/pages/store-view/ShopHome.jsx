// React imports
import { useEffect, useState, useRef, lazy } from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Custom hooks and components
import { useToast } from "@/hooks/use-toast";
import { Faqs } from "@/components/landingPage/Faqs";
import VideoCarousel from "@/components/landingPage/desktop/VideoCarousel";
import { AnimatedPinDemo } from "@/components/store-view/AnimatedPinDemo";
import { AuroraText } from "@/components/magicui/aurora-text";

const StoreHeroSection = lazy(() => import("@/components/store-view/StoreHeroSection.jsx"));

function ShoppingHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel rotation effect (optional visual flair)
  const [rotationAngle, setRotationAngle] = useState(0);
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotationAngle((prev) => (prev + 72) % 360);
    }, 3500);
    return () => clearInterval(rotationInterval);
  }, []);

  return (
    <div className="min-h-screen  text-gray-100">
      <section className="mb-24 bg-gradient-to-b from-[#000000] via-[#0d0b1e] to-black">
        {/* Hero section */}
        <StoreHeroSection />

        {/* Genres and Animation */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-blue-400">
            <AuroraText>Explore Genres</AuroraText>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Discover books from your favorite genres and find your next great read
          </p>
          <AnimatedPinDemo />
        </div>

        {/* Video Carousel */}
        <div className="my-16 py-8">
          <VideoCarousel />
        </div>

        {/* FAQ Section */}
        <section className="py-16 mt-12">
          <div className="container mx-auto px-4">
            <Faqs />
          </div>
        </section>
      </section>
    </div>
  );
}

export default ShoppingHome;







