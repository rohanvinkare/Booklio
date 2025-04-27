import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaLinkedin, FaStar, FaBookOpen } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookDetails = () => {
  const { isbn, sellerId } = useParams(); // Extract isbn and sellerId from params
  const isbnId = isbn;
  const sellerUniqueId = sellerId;
  const [book, setBook] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handlePlaceOrderClick = () => {
    navigate("/placeOrder", {
      state: { sellerUniqueId, isbnId },
    });
  };

  const handleBookClick = (sellerId, isbn) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/seller/${sellerId}/isbn/${isbn}`);
  };

  const handleViewAllBooks = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/shop/listing');
  };

  useEffect(() => {
    // Fetch book details
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/sellers-by-book/${isbn}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBook(data.book);
          setSellers(data.sellers);
        } else {
          console.error("Failed to fetch data:", data.msg);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [isbn]);

  useEffect(() => {
    if (sellerId) {
      // Fetch seller details using sellerId
      fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/${sellerId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSellerInfo(data.seller);
          } else {
            console.error("Failed to fetch seller info:", data.msg);
          }
        })
        .catch((error) => console.error("Error fetching seller data:", error));
    }
  }, [sellerId]);

  useEffect(() => {
    // Fetch suggested books
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Flatten all books and shuffle them
          const allBooks = Object.values(data.bookData).flat();
          // Filter out the current book
          const filteredBooks = allBooks.filter(b => b.isbn !== isbn);
          const shuffledBooks = filteredBooks.sort(() => 0.5 - Math.random());
          // Take first 4 books
          setSuggestedBooks(shuffledBooks.slice(0, 4));
        }
      })
      .catch((error) => console.error("Error fetching suggested books:", error))
      .finally(() => setIsLoading(false));
  }, [isbn]);

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Book Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <div className="relative">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
            
            <Card className="relative bg-gray-800/30 backdrop-blur-md border border-gray-700/50 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-8 p-8">
                {/* Book Cover with 3D Effect */}
                <motion.div 
                  className="lg:w-1/3 flex flex-col items-center gap-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail}
                      alt={book.volumeInfo.title}
                      className="relative w-64 h-auto object-cover rounded-lg shadow-2xl transform hover:rotate-1 transition-transform duration-300"
                    />
                  </div>
                  
                  {sellerInfo && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-[1/3] bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 text-white backdrop-blur-sm">
                          View Seller Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            {sellerInfo.storeName}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="flex justify-center">
                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                              <img
                                src={sellerInfo.image}
                                alt={sellerInfo.storeName}
                                className="relative w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                              <p className="text-gray-300">
                                <span className="font-semibold text-blue-400">Seller Name:</span> {sellerInfo.name}
                              </p>
                              <p className="text-gray-300 mt-2">
                                <span className="font-semibold text-blue-400">Store Description:</span> {sellerInfo.storeDescription}
                              </p>
                            </div>
                            
                            <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                              <p className="text-gray-300">
                                <span className="font-semibold text-blue-400">Location:</span>{" "}
                                {`${sellerInfo.address.street}, ${sellerInfo.address.city}, ${sellerInfo.address.state}, ${sellerInfo.address.zipCode}`}
                              </p>
                            </div>

                            <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                              <p className="text-gray-300">
                                <span className="font-semibold text-blue-400">Email:</span> {sellerInfo.email}
                              </p>
                              <p className="text-gray-300 mt-2">
                                <span className="font-semibold text-blue-400">UPI ID:</span> {sellerInfo.upiId}
                              </p>
                            </div>

                            <div className="flex justify-center space-x-6">
                              <motion.a
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                href={sellerInfo.socialMediaLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
                              >
                                <FaFacebookF size={24} />
                              </motion.a>
                              <motion.a
                                whileHover={{ scale: 1.2, rotate: -10 }}
                                href={sellerInfo.socialMediaLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-500 hover:text-pink-400 transition-colors duration-300"
                              >
                                <FaInstagram size={24} />
                              </motion.a>
                              <motion.a
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                href={sellerInfo.socialMediaLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                              >
                                <FaLinkedin size={24} />
                              </motion.a>
                            </div>

                            <Button
                              onClick={() => alert(`Contacting ${sellerInfo.name}`)}
                              className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                            >
                              Contact Seller
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </motion.div>
                
                {/* Book Info */}
                <div className="lg:w-2/3 space-y-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-4xl font-bold text-white mb-2">{book.volumeInfo.title}</h2>
                    <div className="flex items-center space-x-2 mb-4">
                      <FaStar className="text-yellow-400" />
                      <span className="text-gray-300">4.8 (120 reviews)</span>
                    </div>

                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 backdrop-blur-sm">
                        <TabsTrigger value="details" className="data-[state=active]:bg-blue-500/50 data-[state=active]:backdrop-blur-sm">
                          Details
                        </TabsTrigger>
                        <TabsTrigger value="description" className="data-[state=active]:bg-blue-500/50 data-[state=active]:backdrop-blur-sm">
                          Description
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                          <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                            <p className="font-semibold text-blue-400">Author(s)</p>
                            <p>{book.volumeInfo.authors?.join(", ")}</p>
                          </div>
                          <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                            <p className="font-semibold text-blue-400">Publisher</p>
                            <p>{book.volumeInfo.publisher}</p>
                          </div>
                          <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                            <p className="font-semibold text-blue-400">Categories</p>
                            <p>{book.volumeInfo.categories?.join(", ")}</p>
                          </div>
                          <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                            <p className="font-semibold text-blue-400">Published Date</p>
                            <p>{book.volumeInfo.publishedDate}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="description" className="mt-4">
                        <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed">{book.volumeInfo.description}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button 
                      onClick={handlePlaceOrderClick} 
                      className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 text-white py-6 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    >
                      <FaBookOpen className="mr-2" />
                      Place Order
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Other Sellers Section - Only show if there are other sellers */}
        {sellers.filter(seller => seller.sellerId !== sellerId).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Other Sellers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {sellers
                  .filter(seller => seller.sellerId !== sellerId)
                  .map((seller) => (
                  <Dialog key={seller.sellerId}>
                    <DialogTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                      >
                        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="p-4">
                            <div className="flex flex-col items-center space-y-3">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                                <img
                                  src={seller.image}
                                  alt={seller.storeName}
                                  className="relative w-20 h-20 object-cover rounded-full border-2 border-blue-500"
                                />
                              </div>
                              <h3 className="text-lg font-semibold text-white text-center">
                                {seller.storeName}
                              </h3>
                              <p className="text-sm text-gray-400 text-center">
                                {seller.address.city}, {seller.address.state}
                              </p>
                              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                          {seller.storeName}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                            <img
                              src={seller.image}
                              alt={seller.storeName}
                              className="relative w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-gray-300">
                              <span className="font-semibold text-blue-400">Seller:</span> {seller.name}
                            </p>
                            <p className="text-gray-300 mt-2">
                              <span className="font-semibold text-blue-400">Description:</span> {seller.storeDescription}
                            </p>
                          </div>
                          
                          <div className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-gray-300">
                              <span className="font-semibold text-blue-400">Location:</span>{" "}
                              {`${seller.address.street}, ${seller.address.city}, ${seller.address.state}, ${seller.address.zipCode}`}
                            </p>
                          </div>
                          
                          <div className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-gray-300">
                              <span className="font-semibold text-blue-400">Contact:</span> {seller.email}
                            </p>
                          </div>
                          
                          <div className="flex justify-center space-x-4">
                            <motion.a
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              href={seller.socialMediaLinks?.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
                            >
                              <FaFacebookF size={24} />
                            </motion.a>
                            <motion.a
                              whileHover={{ scale: 1.2, rotate: -10 }}
                              href={seller.socialMediaLinks?.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-500 hover:text-pink-400 transition-colors duration-300"
                            >
                              <FaInstagram size={24} />
                            </motion.a>
                            <motion.a
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              href={seller.socialMediaLinks?.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                            >
                              <FaLinkedin size={24} />
                            </motion.a>
                          </div>
                          
                          <Button
                            onClick={() => alert(`Contacting ${seller.name}`)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            Contact Seller
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Suggested Books Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Continue Shopping
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {suggestedBooks.map((book, index) => {
                const price = book.spCluster?.[0]?.price;
                const thumbnail = book.data.volumeInfo?.imageLinks?.thumbnail;
                const title = book.data.volumeInfo?.title || "Unknown Title";
                const authors = book.data.volumeInfo?.authors?.join(", ") || "Unknown Author";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => handleBookClick(book.spCluster?.[0]?.sellerId, book.isbn)}
                  >
                    <Card className="bg-gray-800/50 min-h-[400px] backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="p-4 h-full flex flex-col">
                        <div className="relative mb-4 flex-shrink-0">
                          <div className="absolute -inset-1 blur opacity-30"></div>
                          <img
                            src={thumbnail || "https://via.placeholder.com/200x300"}
                            alt={title}
                            className="relative w-full h-[220px] object-contain rounded-lg"
                          />
                        </div>
                        <div className="space-y-2 flex-grow flex flex-col">
                          <h3 className="text-base font-semibold text-white line-clamp-2">
                            {title}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {authors}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center space-x-1">
                              <FaStar className="text-yellow-400 w-3 h-3" />
                              <span className="text-gray-300 text-sm">4.8</span>
                            </div>
                            <span className="text-blue-400 font-semibold text-sm">₹ {price}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-8">
            <Button 
              className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              onClick={handleViewAllBooks}
            >
              View All Books
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookDetails;
