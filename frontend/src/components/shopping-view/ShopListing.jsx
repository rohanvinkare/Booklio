import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GenreFilter from "./GenreFilter";
import notAvailable from "../../assets/notAvailable.png";
import { Search, BookOpen, ShoppingCart, Star, Calendar, Building, Hash, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const ShopListing = () => {
  const [bookData, setBookData] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBookData(data.bookData);
          setSelectedGenres([]);
          setBooks(Object.values(data.bookData).flat());
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedGenres.length === 0) {
      setBooks(Object.values(bookData).flat());
    } else {
      setBooks(selectedGenres.flatMap((g) => bookData[g] || []));
    }
  }, [selectedGenres, bookData]);

  const handleBuyNowClick = (isbn, sellerId, event) => {
    event.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/seller/${sellerId}/isbn/${isbn}`);
  };

  const filteredBooks = books.filter((book) => {
    const title = book.data.volumeInfo?.title?.toLowerCase() || "";
    const authors = book.data.volumeInfo?.authors?.join(", ").toLowerCase() || "";
    return (
      title.includes(searchQuery.toLowerCase()) ||
      authors.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-grow bg-gray-900 min-h-screen">
      {/* Desktop Sidebar: Genres - Fixed position, hidden on mobile */}
      <div className="hidden md:block fixed w-1/4 xl:w-1/5 min-h-screen overflow-auto">
        <GenreFilter
          bookData={bookData}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="w-full md:w-3/4 md:ml-[25%] xl:w-4/5 xl:ml-[20%] p-4 md:p-10 mt-[4rem] min-h-screen pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-3/4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] text-white p-0 bg-gray-900 border-gray-700">
              <div className="h-full">
                <GenreFilter
                  bookData={bookData}
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white">
          {selectedGenres.length > 0
            ? `Books in ${selectedGenres.join(", ")}`
            : "All Books"}
        </h2>

        {/* Display filtered books */}
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => {
                const price = book.spCluster?.[0]?.price;
                const thumbnail = book.data.volumeInfo?.imageLinks?.thumbnail;
                const title = book.data.volumeInfo?.title || "Unknown Title";
                const description = book.data.volumeInfo?.description || "No description available";

                return (
                  <Card 
                  key={index} 
                  className="group bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden cursor-pointer relative h-full flex flex-col"
                  onClick={() => setSelectedBook(book)}
                >
                  {/* Price Flag */}
                  {price && (
                    <div className="absolute z-10 -top-1 -left-2 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md before:z-5 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:border-l-8 before:border-l-transparent before:border-t-8 before:border-t-red-700">
                      ₹{price}
                    </div>
                  )}
              
                  {/* Image Section - Fixed Height */}
                  <div className="relative h-[200px] w-full overflow-hidden flex-shrink-0">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
              
                  {/* Content Section - Flexible Height */}
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {description}
                      </p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-400">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          <span className="line-clamp-1">
                            {book.data.volumeInfo.authors?.join(", ") || "Unknown Author"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                          <span>{book.data.volumeInfo.pageCount || "N/A"} pages</span>
                        </div>
                      </div>
                    </div>
              
                    {/* Buy Button - Always at Bottom */}
                    {price && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <Button
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-2"
                          onClick={(e) => handleBuyNowClick(book.isbn, book.spCluster?.[0]?.sellerId, e)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Buy Now</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <img src={notAvailable} alt="No books available" className="h-48 mb-6 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Books Found
                </h3>
                <p className="text-gray-400 text-center max-w-md">
                  We couldn&apos;t find any books matching your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-800 text-white border-gray-700 overflow-hidden flex flex-col p-6">
          <DialogHeader className="flex-shrink-0 mb-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white">
                {selectedBook?.data.volumeInfo?.title}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-grow custom-scrollbar">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Fixed Image and Buy Button */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="md:sticky md:top-0">
                  {/* Image Container */}
                  <div className="relative">
                    {selectedBook?.spCluster?.[0]?.price && (
                      <div className="absolute z-10 -top-1 -left-2 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md before:z-5 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:border-l-8 before:border-l-transparent before:border-t-8 before:border-t-red-700">
                        ₹{selectedBook.spCluster[0].price}
                      </div>
                    )}
                    <img
                      src={selectedBook?.data.volumeInfo?.imageLinks?.thumbnail || notAvailable}
                      alt={selectedBook?.data.volumeInfo?.title}
                      className="w-full aspect-[3/4] object-cover rounded-lg shadow-xl"
                    />
                  </div>

                  {/* Buy Button Below Image */}
                  {selectedBook?.spCluster?.[0]?.price && (
                    <Button
                      className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-6"
                      onClick={(e) => {
                        handleBuyNowClick(selectedBook.isbn, selectedBook.spCluster[0].sellerId, e);
                        setSelectedBook(null);
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Buy Now</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column - Scrollable Content */}
              <div className="w-full md:w-2/3 space-y-6 mt-6 md:mt-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">About the Book</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {selectedBook?.data.volumeInfo?.description || "No description available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-300">
                    <Star className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">By: {selectedBook?.data.volumeInfo?.authors?.join(", ") || "Unknown Author"}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">Published: {selectedBook?.data.volumeInfo?.publishedDate || "N/A"}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Building className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Publisher: {selectedBook?.data.volumeInfo?.publisher || "Unknown"}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Hash className="w-5 h-5 mr-2 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">ISBN: {selectedBook?.isbn || "N/A"}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <BookOpen className="w-5 h-5 mr-2 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">{selectedBook?.data.volumeInfo?.pageCount || "N/A"} pages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopListing;