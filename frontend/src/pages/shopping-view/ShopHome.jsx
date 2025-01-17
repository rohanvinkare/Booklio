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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
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

const genreIcon = [
  { id: "horror", label: "Horror", icon: Ghost },
  { id: "fantasy", label: "Fantasy", icon: Wand2 },
  { id: "mystery", label: "Mystery", icon: Search },
  { id: "fiction", label: "Fiction", icon: BookOpen },
  { id: "non-fiction", label: "Non-Fiction", icon: Book },
  { id: "manga", label: "Manga", icon: PenTool },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const featureImageList = [
    { image: bannerOne },
    { image: bannerTwo },
    { image: bannerThree },
    { image: bannerFour },
    { image: bannerFive },
  ];


  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");


  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="relative my-10 w-[80vw] h-[80vh] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genreIcon.map((brandItem, index) => (
              <Card
                key={index}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="mb-10">
        <Faqs />
      </div>
    </div>
  );
}

export default ShoppingHome;
