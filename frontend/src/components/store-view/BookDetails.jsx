import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { booksData } from "@/store/user/books";
import BookDetailsMain from "@/components/store-view/BookDetailsMain";
// import OtherSellersSection from "@/components/store-view/OtherSellersSection"; // removed for now
import SuggestedBooksSection from "@/components/store-view/SuggestedBooksSection";
import LoadingSpinner from "@/components/store-view/LoadingSpinner";

const BookDetails = () => {
  const dispatch = useDispatch();
  const { isbn, sellerId } = useParams();
  const isbnId = isbn;
  const sellerUniqueId = sellerId;
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  // const [sellers, setSellers] = useState([]); // No longer needed
  const [sellerInfo, setSellerInfo] = useState(null);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const bookData = useSelector((state) => state.booksListing.value);

  const handlePlaceOrderClick = () => {
    navigate("/placeOrder", {
      state: {
        sellerUniqueId,
        isbnId,
        book: book.data,
        price: book.price,
        stock: book.stock,
        sellerInfo,
      },
    });
  };

  const handleBookClick = (sellerId, isbn) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/seller/${sellerId}/isbn/${isbn}`);
  };

  const handleViewAllBooks = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/shop/listing");
  };

  // ✅ Fetch book and seller info from new API
  useEffect(() => {
    const fetchBookAndSeller = async () => {
      try {
        const url = `${import.meta.env.VITE_BASE_URL}/book/api/v1/books-by-seller/${sellerId}/${isbn}`;
        const response = await axios.get(url);
        if (response.data.success) {
          setBook(response.data.book);
          setSellerInfo(response.data.sellerInfo);
          // If other sellers come in response, you can set them here
          // setSellers(response.data.otherSellers || []);
        }
      } catch (error) {
        console.error("Error fetching book and seller info:", error);
      }
    };
    if (isbn && sellerId) fetchBookAndSeller();
  }, [isbn, sellerId]);

  // Fetch all-genre-book if not in store
  useEffect(() => {
    const fetchAllGenreBooks = async () => {
      setIsLoading(true);
      try {
        if (Object.keys(bookData).length === 0) {
          // console.log("📡 Fetching book data from API (Redux store is empty)");
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`);
          if (response.data.success) {
            dispatch(booksData(response.data.bookData));
            // console.log("✅ Book data stored in Redux after API call");
          }
        } else {
          // console.log("📦 Using book data from Redux store");
        }
      } catch (error) {
        console.error("❌ Error fetching all-genre-book:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllGenreBooks();
  }, [bookData, dispatch]);

  // Prepare suggested books from store
  useEffect(() => {
    if (Object.keys(bookData).length > 0) {
      const allBooks = Object.values(bookData).flat();
      const filtered = allBooks.filter((b) => b.isbn !== isbn);
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      setSuggestedBooks(shuffled.slice(0, 4));
    }
  }, [bookData, isbn]);

  if (!book) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0b1e] to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Aurora Divider */}
        <div className="text-center mb-16">
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-md" />
        </div>

        {/* Main Book Details */}
        <BookDetailsMain
          book={book.data}
          price={book.price}
          stock={book.stock}
          sellerInfo={sellerInfo}
          onPlaceOrderClick={handlePlaceOrderClick}
        />


        {/* Aurora Styled Suggestions */}
        <SuggestedBooksSection
          books={suggestedBooks}
          isLoading={isLoading}
          onBookClick={handleBookClick}
          onViewAllClick={handleViewAllBooks}
        />
      </div>
    </div>
  );

};

export default BookDetails;
