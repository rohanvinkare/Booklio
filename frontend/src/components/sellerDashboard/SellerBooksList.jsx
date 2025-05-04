import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FaBook, FaBookOpen, FaStoreAlt, FaStoreAltSlash, FaUpload, FaUser, FaCalendar, FaLanguage, FaInfoCircle, FaStore, FaRupeeSign, FaTag } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SellerBooksList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const { sellerData } = useOutletContext();
  const sellerId = sellerData?.sellerId;
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL
        }/book/api/v1/books-by-seller/${sellerId}`
      );
      const data = await response.json();
      
      if (data.success && Array.isArray(data.books)) {
        setBooks(data.books);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching seller books:", error);
      setBooks([]);
    }
  };


  useEffect(() => {
    if (!sellerId) return;
    fetchBooks();
  }, [sellerId, fetchBooks]);


  // Function to confirm and remove a book
  const confirmRemoveBook = async (isbn) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/book/api/v1/remove-book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: "Bearer " + token,
            isbn: isbn,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Book removed successfully!");
        setSelectedBook(null); // Close the dialog
        fetchBooks(); // Refresh the book list
      } else {
        toast.error(data.msg || "Failed to remove the book. Please try again.");
      }
    } catch (error) {
      console.error("Error removing the book:", error);
      toast.error("An error occurred. Please try again.");
    }
  };




  if (!books) {
    return <div className="text-center p-8 text-xl">Loading...</div>;
  }




  const truncatedDescription = (description) => {
    const words = description.split(" ");
    return words.length > 60
      ? words.slice(0, 120).join(" ") + "..."
      : description;
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Your Books</h1>
        <Button
          onClick={() => navigate("/seller/add-book")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaUpload className="text-lg" />
          Add New Book
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-300 mb-2">No Books Found</h2>
          <p className="text-gray-400 mb-6">Start by adding your first book to your inventory</p>
          <Button
            onClick={() => navigate("/seller/add-book")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
          >
            <FaUpload className="text-lg" />
            Add Your First Book
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book, index) => {
            const {
              data: { volumeInfo },
              spCluster,
            } = book;

            const title = volumeInfo?.title || "Untitled";
            const authors = volumeInfo?.authors?.join(", ") || "Unknown Author";
            const description = volumeInfo?.description || "No description available.";
            const imageUrl = volumeInfo?.imageLinks?.thumbnail || "/default-image.jpg";
            const isbn = book.isbn;
            const publishedDate = volumeInfo?.publishedDate || "N/A";
            const publisher = volumeInfo?.publisher || "N/A";
            const language = volumeInfo?.language || "N/A";
            const genre = volumeInfo?.categories?.[0] || "Uncategorized";
            const stock = spCluster[0]?.stock || "N/A";
            const sellerPrice = spCluster[0]?.price || "N/A";

            return (
              <Dialog
                key={isbn || index}
                open={selectedBook === isbn}
                onOpenChange={(open) =>
                  open ? setSelectedBook(isbn) : setSelectedBook(null)
                }
              >
                <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <div className="absolute z-10 -top-2 -left-2 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md rounded-tl-lg rounded-br-lg">
                      ₹{sellerPrice}
                    </div>
                    <div className="absolute z-10 top-2 right-2 bg-yellow-500/90 text-green-700 text-xs font-medium py-1 px-3 rounded-full">
                      Stock: {stock}
                    </div>
                  </div>
                  <CardHeader className="px-4 py-4">
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <h2 className="text-lg font-semibold text-white line-clamp-2 mb-2">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-400 mb-2">{authors}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {description}
                    </p>
                  </CardContent>
                  <DialogTrigger asChild>
                    <CardFooter className="px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 transition-colors">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <FaBook className="mr-2" />
                        View Details
                      </Button>
                    </CardFooter>
                  </DialogTrigger>
                </Card>

                <DialogContent className="max-w-4xl p-0 bg-gray-800 border-gray-700 rounded-xl shadow-lg h-[85vh] flex flex-col">
                  {/* Main Content Area */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-gray-100 mb-2">{title}</h2>
                          <div className="flex items-center justify-center gap-2">
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {genre}
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                              ISBN: {isbn}
                            </span>
                          </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column - Image and Basic Info */}
                          <div className="space-y-6">
                            {/* Book Cover */}
                            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                              <div className="relative aspect-[3/4] w-3/4 mx-auto overflow-hidden rounded-lg shadow-xl">
                                <img
                                  src={imageUrl}
                                  alt={title}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                            </div>

                            {/* Basic Info */}
                            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                              <h3 className="text-lg font-semibold text-gray-200 mb-4">Book Information</h3>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <FaUser className="h-5 w-5 text-indigo-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Authors</p>
                                    <p className="text-gray-100">{authors}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <FaStore className="h-5 w-5 text-indigo-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Publisher</p>
                                    <p className="text-gray-100">{publisher}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <FaCalendar className="h-5 w-5 text-indigo-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Published Date</p>
                                    <p className="text-gray-100">{publishedDate}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <FaLanguage className="h-5 w-5 text-indigo-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Language</p>
                                    <p className="text-gray-100">{language}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <FaTag className="h-5 w-5 text-indigo-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Categories</p>
                                    <p className="text-gray-100">{volumeInfo?.categories?.join(", ") || "Uncategorized"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Description and Stock Info */}
                          <div className="space-y-6">
                            {/* Description */}
                            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                  <FaInfoCircle className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Description</h3>
                                  <p className="text-gray-400 leading-relaxed">{description}</p>
                                </div>
                              </div>
                            </div>

                            {/* Stock Information */}
                            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                  <FaStore className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div className="w-full">
                                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Stock Information</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                      <p className="text-sm text-gray-400 mb-1">Price</p>
                                      <p className="text-xl font-semibold text-orange-400">₹{sellerPrice}</p>
                                    </div>
                                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                      <p className="text-sm text-gray-400 mb-1">Available Stock</p>
                                      <p className="text-xl font-semibold text-blue-400">{stock} books</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Additional Details */}
                            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                  <FaBookOpen className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Additional Details</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-400">Page Count</p>
                                      <p className="text-gray-100">{volumeInfo?.pageCount || "N/A"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-400">Maturity Rating</p>
                                      <p className="text-gray-100">{volumeInfo?.maturityRating || "N/A"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-400">Print Type</p>
                                      <p className="text-gray-100">{volumeInfo?.printType || "N/A"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-400">Content Version</p>
                                      <p className="text-gray-100">{volumeInfo?.contentVersion || "N/A"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800 p-4">
                      <div className="flex justify-end space-x-3">
                        <Button
                          onClick={() => setSelectedBook(null)}
                          className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors rounded-xl text-sm"
                        >
                          Close
                          <IoCloseCircle className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors rounded-xl text-sm"
                          onClick={() => confirmRemoveBook(isbn)}
                        >
                          Remove Book
                          <IoCloseCircle className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerBooksList;
