// React and Redux imports
import { useEffect, useState, useRef, useCallback, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";

// Store and routing
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";

// Custom hooks and components
import { useToast } from "@/hooks/use-toast";
import { Faqs } from "@/components/landingPage/Faqs";
import VideoCarousel from "@/components/landingPage/desktop/VideoCarousel";

import { AnimatedPinDemo } from "@/components/store-view/AnimatedPinDemo";
import { AuroraText } from "@/components/magicui/aurora-text";

const StoreHeroSection = lazy(() => import("@/components/store-view/StoreHeroSection.jsx"))


function ShoppingHome() {
  const [isScrolled, setIsScrolled] = useState(false); // Scroll state
  const heroRef = useRef(null); // Ref for hero section

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false); // Dialog control
  const { user } = useSelector((state) => state.auth); // Get user from auth state

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast(); // Toast notification hook

  //  Scroll listener for header behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigate to product listing page with filters
  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  // Show product detail dialog when productDetails is set
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const [selectedProducts, setSelectedProducts] = useState([]); // For future use
  const [rotationAngle, setRotationAngle] = useState(0); // Carousel animation angle

  //  Select random subset of products
  const selectRandomProducts = useCallback(() => {
    if (productList?.length) {
      const shuffled = [...productList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    }
    return [];
  }, [productList]);

  // Initial fetch of products
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  // ⏱ Auto-rotate effect for carousel or visuals
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotationAngle((prev) => (prev + 72) % 360);
    }, 3500);

    return () => clearInterval(rotationInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100">

      {/* ------ This is Aurora bg color background ------ */}
      <section className="mb-24 bg-gradient-to-b from-[#000000] via-[#0d0b1e] to-black">

        <StoreHeroSection />


        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-blue-400">
            <AuroraText>Explore Genres</AuroraText>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Discover books from your favorite genres and find your next great read
          </p>

          {/* Responsive animated genre tags */}
          <AnimatedPinDemo />
        </div>


        {/* Video Carousel Section */}
        <div className="my-16 py-8">
          <VideoCarousel />
        </div>



        {/* FAQ Section */}
        <section className="py-16 mt-12 bg-[#060606]">
          <div className="container mx-auto px-4">
            <Faqs />
          </div>
        </section>


      </section>
    </div>
  );
}

export default ShoppingHome;

