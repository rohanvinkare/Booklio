import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Faqs } from "@/components/landingPage/Faqs";
import VideoCarousel from "@/components/landingPage/desktop/VideoCarousel";
import { HeroParallaxDemo } from "@/components/store-view/HeroParallaxDemo";
import { AnimatedPinDemo } from "@/components/store-view/AnimatedPinDemo";
import { AuroraText } from "@/components/magicui/aurora-text";

function ShoppingHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(0);

  const selectRandomProducts = useCallback(() => {
    if (productList?.length) {
      const shuffled = [...productList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    }
    return [];
  }, [productList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotationAngle((prev) => (prev + 72) % 360);
    }, 3500);

    return () => clearInterval(rotationInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-gray-100">
      {/* Hero Parallax Section */}
      <HeroParallaxDemo />

      {/* Genres Section */}
      <section className="mb-24 bg-[#060606]">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-blue-400">
            <AuroraText> Explore Genres</AuroraText>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Discover books from your favorite genres and find your next great read
          </p>

          <AnimatedPinDemo />
        </div>
      </section>

      {/* Video Carousel Section */}
      <VideoCarousel />

      {/* FAQ Section */}
      <section className="py-16 mt-12 bg-[#060606]">
        <div className="container mx-auto px-4">
          <Faqs />
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
