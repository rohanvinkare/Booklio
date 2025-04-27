import { Button } from "@/components/ui/button";
import bannerOne from "@/assets/slide1.jpg";
import bannerTwo from "@/assets/slide2.jpg";
import bannerThree from "@/assets/slide3.jpg";
import bannerFour from "@/assets/slide4.jpg";
import bannerFive from "@/assets/slide5.jpg";
import {
  BookOpen,
  Baby,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCheck,
  PenTool,
  Book,
  User,
  Ghost,
  Search,
  Wand2,
  WatchIcon,
  ArrowRight,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { Faqs } from "@/components/landingPage/Faqs";
import { Footer } from "@/components/landingPage/Footer";
import VideoCarousel from "@/components/landingPage/VideoCarousel";

const genreIcon = [
  { id: "horror", label: "Horror", icon: Ghost, color: "text-red-400" },
  { id: "fantasy", label: "Fantasy", icon: Wand2, color: "text-purple-400" },
  { id: "mystery", label: "Mystery", icon: Search, color: "text-blue-400" },
  { id: "fiction", label: "Fiction", icon: BookOpen, color: "text-green-400" },
  { id: "non-fiction", label: "Non-Fiction", icon: Book, color: "text-orange-400" },
  { id: "manga", label: "Manga", icon: PenTool, color: "text-pink-400" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const featureImageList = [
    { image: bannerOne, title: "Discover New Worlds", subtitle: "Explore our latest collection of books" },
    { image: bannerTwo, title: "Best Sellers", subtitle: "Find your next favorite read" },
    { image: bannerThree, title: "Special Offers", subtitle: "Limited time deals on popular titles" },
    { image: bannerFour, title: "New Arrivals", subtitle: "Fresh picks just for you" },
    { image: bannerFive, title: "Classic Collection", subtitle: "Timeless stories that never fade" },
  ];

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

  // Add this function to randomly select products
  const selectRandomProducts = useCallback(() => {
    if (productList?.length) {
      const shuffled = [...productList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5); // Select 5 random products
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
    const slideTimer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3500); // Changed to 3000ms (3 seconds)

    // Cleanup on component unmount
    return () => clearInterval(slideTimer);
  }, [featureImageList.length]);

  // Update the rotation interval for featured products
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotationAngle(prev => (prev + 72) % 360); // 360/5 = 72 degrees per item
    }, 3500); // Changed to 3000ms (3 seconds)

    return () => clearInterval(rotationInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">

      {/* Hero Section with Parallax */}
      <div
        ref={heroRef}
        className="relative h-[90vh] w-full overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))"
        }}
      >
        {featureImageList.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute top-40 inset-0 flex items-center justify-center">
              <div className="text-center max-w-2xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-300">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  className="bg-blue-500 text-gray-900 hover:bg-blue-400 transition-colors"
                  onClick={() => navigate("/shop/listing")}
                >
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featureImageList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-blue-400" : "bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Genres Section */}
      <section className="py-16 bg-backgroundContrast">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-400">Explore Genres</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Discover books from your favorite genres and find your next great read
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {genreIcon.slice(0, 6).map((genre, index) => (
              <Card
                key={index}
                onClick={() => navigate("/shop/listing")}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-background border-gray-600"
              >
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className={`${genre.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                    <genre.icon className="w-12 h-12" />
                  </div>
                  <span className="font-semibold text-lg text-gray-200 group-hover:text-blue-400 transition-colors">
                    {genre.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <VideoCarousel />

      {/* FAQ Section */}
      <section className="py-16 bg-backgroundContrast">
        <div className="container mx-auto px-4">
          <Faqs />
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
