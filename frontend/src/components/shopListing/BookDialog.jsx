import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Building, BookOpen, Star, Hash, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import notAvailable from "@/assets/notAvailable.png";

const BookDialog = ({ book, onClose, handleBuyNowClick }) => {
  return (
    <Dialog open={!!book} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-6 bg-gradient-to-br from-black via-[#0d0b1e] to-black text-white border border-[#1a1a1a] rounded-2xl shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400">
            {book?.data.volumeInfo?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image & Price */}
            <div className="w-full md:w-1/3 relative">
              {book?.spCluster?.[0]?.price && (
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-bold py-1 px-4 rounded-br-xl shadow-md animate-pulse z-10">
                  ₹{book.spCluster[0].price}
                </div>
              )}
              <img
                src={book?.data.volumeInfo?.imageLinks?.thumbnail || notAvailable}
                alt={book?.data.volumeInfo?.title}
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg border border-white/10"
                loading="lazy"
              />

              {book?.spCluster?.[0]?.price && (
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-500 hover:to-pink-600 text-white font-medium py-6 rounded-lg transition-shadow shadow-lg hover:shadow-fuchsia-600/30"
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

            {/* Book Info */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-violet-300 mb-2">About the Book</h3>
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {book?.data.volumeInfo?.description || "No description available."}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-white/80">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  <span>By: {book?.data.volumeInfo?.authors?.join(", ") || "Unknown Author"}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Calendar className="w-5 h-5 mr-2 text-sky-400" />
                  <span>Published: {book?.data.volumeInfo?.publishedDate || "N/A"}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Building className="w-5 h-5 mr-2 text-emerald-400" />
                  <span>Publisher: {book?.data.volumeInfo?.publisher || "Unknown"}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Hash className="w-5 h-5 mr-2 text-purple-400" />
                  <span>ISBN: {book?.isbn || "N/A"}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <BookOpen className="w-5 h-5 mr-2 text-pink-400" />
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

