import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import LoadingSpinner from "@/components/store-view/LoadingSpinner";

const SuggestedBooksSection = ({ books, isLoading, onBookClick, onViewAllClick }) => {
  return (
    <div className="mb-12 px-3 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 text-center mb-5">
        Continue Shopping
      </h2>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book, index) => {
              const price = book.spCluster?.[0]?.price;
              const sellerId = book.spCluster?.[0]?.sellerId;
              const isbn = book.isbn;
              const thumbnail = book.data.volumeInfo?.imageLinks?.thumbnail;
              const title = book.data.volumeInfo?.title || "Unknown Title";
              const authors = book.data.volumeInfo?.authors?.join(", ") || "Unknown Author";

              return (
                <div key={index} className="h-full">
                  <Card className="h-[300px] sm:h-[420px] flex flex-col justify-between bg-gradient-to-br from-[#0d0b1e] via-[#111018] to-black/90 backdrop-blur-md border border-white/10 shadow-md hover:shadow-blue-700/30 transition-all duration-300 rounded-xl">
                    <div className="p-2 sm:p-4 flex flex-col h-full">
                      {/* Book Image */}
                      <div className="mb-2 flex-shrink-0">
                        <img
                          src={thumbnail || 'https://via.placeholder.com/200x300'}
                          alt={title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-[120px] sm:h-[220px] object-contain rounded-lg shadow-inner"
                        />
                      </div>

                      {/* Book Info */}
                      <div className="space-y-1 flex flex-col flex-grow">
                        <h3 className="text-xs sm:text-base font-semibold text-white line-clamp-2">{title}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">{authors}</p>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-400 w-3 h-3" />
                            <span className="text-gray-100 text-[10px] sm:text-sm">4.8</span>
                          </div>
                          <span className="text-yellow-400 font-semibold text-[10px] sm:text-sm">
                            ₹ {price || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Buy Now Button */}
                      <Button
                        size="sm"
                        className="mt-3 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 bg-white text-black font-bold rounded-md hover:scale-105 transition-transform"
                        onClick={() => onBookClick(sellerId, isbn)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-6">
            <Button
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-sky-500 hover:to-fuchsia-500 text-white font-medium px-5 sm:px-8 py-2 sm:py-3 rounded-xl shadow-md hover:shadow-pink-500/30 transition-transform transform hover:scale-105 text-sm"
              onClick={onViewAllClick}
            >
              View All Books
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestedBooksSection;
