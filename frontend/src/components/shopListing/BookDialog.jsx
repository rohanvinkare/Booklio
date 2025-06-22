import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Building, BookOpen, Star, Hash, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import notAvailable from "@/assets/notAvailable.png";

const BookDialog = ({ book, onClose, handleBuyNowClick }) => {
  return (
    <Dialog open={!!book} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-800 text-white border-gray-700 overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {book?.data.volumeInfo?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="relative">
                {book?.spCluster?.[0]?.price && (
                  <div className="absolute -top-1 -left-2 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md">
                    ₹{book.spCluster[0].price}
                  </div>
                )}
                <img
                  src={book?.data.volumeInfo?.imageLinks?.thumbnail || notAvailable}
                  alt={book?.data.volumeInfo?.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[3/4] object-cover rounded-lg shadow-xl"
                />
              </div>
              {book?.spCluster?.[0]?.price && (
                <Button
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-6"
                  onClick={(e) => {
                    handleBuyNowClick(book.isbn, book.spCluster[0].sellerId, e);
                    onClose();
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
              )}
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">About the Book</h3>
                <p className="text-gray-400 leading-relaxed">
                  {book?.data.volumeInfo?.description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-300">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  <span>By: {book?.data.volumeInfo?.authors?.join(", ") || "Unknown Author"}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Published: {book?.data.volumeInfo?.publishedDate || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Building className="w-5 h-5 mr-2 text-green-500" />
                  <span>Publisher: {book?.data.volumeInfo?.publisher || "Unknown"}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Hash className="w-5 h-5 mr-2 text-purple-500" />
                  <span>ISBN: {book?.isbn || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <BookOpen className="w-5 h-5 mr-2 text-pink-500" />
                  <span>{book?.data.volumeInfo?.pageCount || "N/A"} pages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDialog;
