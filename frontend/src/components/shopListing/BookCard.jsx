import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";


const BookCard = ({ book, onClick, handleBuyNowClick }) => {
    const price = book.spCluster?.[0]?.price;
    const thumbnail = book.data.volumeInfo?.imageLinks?.thumbnail;
    const title = book.data.volumeInfo?.title || "Unknown Title";
    const description =
        book.data.volumeInfo?.description || "No description available";

    return (
        <Card
            className="group bg-[#0B1027]/60 border border-blue-950/60 hover:border-blue-500 transition-all duration-300 overflow-hidden cursor-pointer flex flex-row w-full max-w-full"
            onClick={onClick}
        >
            {/* Book Cover */}
            <div className="w-28 sm:w-36 md:w-40 lg:w-44 bg-gray-900 shrink-0 overflow-hidden flex">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                )}
            </div>

            {/* Book Details */}
            <CardContent className="px-3 py-4 sm:px-5 sm:py-6 flex flex-col justify-between flex-grow">
                <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-sm sm:text-lg font-semibold text-white line-clamp-1">{title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">
                        {book.data.volumeInfo.authors?.join(", ") || "Unknown Author"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-3">{description}</p>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span>{book.data.volumeInfo.pageCount || "N/A"} pages</span>
                        </div>
                        {price && (
                            <div className="flex items-center gap-1 text-red-400 font-semibold">
                                ₹{price}
                            </div>
                        )}
                    </div>
                </div>

                {price && (
                    <div className="mt-3 sm:mt-5">
                        <Button
                            className="w-full sm:w-fit bg-white hover:bg-blue-600 text-black hover:text-white font-medium flex items-center justify-center gap-2 px-2.5 py-1.5 text-xs sm:text-sm"
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
};

export default BookCard;
