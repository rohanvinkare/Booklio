import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IoCloseCircle } from "react-icons/io5";
import { FaBook, FaCalendar, FaLanguage, FaInfoCircle, FaStore, FaStar, FaRupeeSign, FaTag, FaUser, FaMapMarkerAlt } from "react-icons/fa";

const BookDetailView = ({ book, selectedBook, setSelectedBook, getSellerInfo }) => {
  const { data, spCluster, id, isbn } = book;
  const title = data?.volumeInfo?.title || "Untitled";
  const authors = data?.volumeInfo?.authors?.join(", ") || "Unknown Author";
  const description = data?.volumeInfo?.description || "No description available.";
  const maturityRating = data?.volumeInfo?.maturityRating || "Not defined.";
  const publishedDate = data?.volumeInfo?.publishedDate || "Not defined.";
  const publisher = data?.volumeInfo?.publisher || "Not defined.";
  const language = data?.volumeInfo?.language || "Language not defined.";
  const genre = data?.volumeInfo?.categories || "No genre available.";
  const imageUrl = data?.volumeInfo?.imageLinks?.thumbnail || "/default-image.jpg";
  const infoLink = data?.volumeInfo?.infoLink || "#";

  return (
    <DialogContent className="max-w-4xl p-0 bg-gray-800 border-gray-700 rounded-xl shadow-lg h-[85vh] flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-100 mb-2">{title}</h2>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {genre[0] || "Uncategorized"}
              </span>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Image and Basic Info */}
              <div className="space-y-4">
                {/* Book Cover */}
                <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                  <div className="relative aspect-[3/4] w-3/4 mx-auto overflow-hidden rounded-lg shadow-xl">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <FaUser className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Authors</p>
                        <p className="text-gray-100 text-sm">{authors}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <FaStore className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Publisher</p>
                        <p className="text-gray-100 text-sm">{publisher}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <FaCalendar className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Published Date</p>
                        <p className="text-gray-100 text-sm">{publishedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <FaLanguage className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Language</p>
                        <p className="text-gray-100 text-sm">{language}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Description and Sellers */}
              <div className="space-y-4">
                {/* Description */}
                <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                  <div className="flex items-start space-x-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                      <FaInfoCircle className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-200 font-semibold mb-1">Description</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                    </div>
                  </div>
                </div>

                {/* Available Sellers */}
                <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                  <div className="flex items-start space-x-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                      <FaStore className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-200 font-semibold mb-2">Available Sellers</h3>
                      {spCluster && spCluster.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {spCluster.map((sellerCluster, idx) => {
                            const seller = getSellerInfo(sellerCluster.sellerId);
                            return seller ? (
                              <div
                                key={idx}
                                className="bg-gray-800 p-2 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-colors duration-300"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-gray-100">
                                    {seller.storeName || "Unnamed Store"}
                                  </h4>
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center text-orange-400">
                                      <FaRupeeSign className="h-3 w-3 mr-1" />
                                      <span className="text-sm font-medium">{sellerCluster.price || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center text-blue-400">
                                      <FaBook className="h-3 w-3 mr-1" />
                                      <span className="text-sm font-medium">{sellerCluster.stock || "N/A"}</span>
                                    </div>
                                  </div>
                                </div>
                                {seller.address && (
                                  <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                                    <span>
                                      {seller.address.city}, {seller.address.state}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-gray-400 text-sm">No sellers available for this book</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* More Info Link */}
                <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                      <FaInfoCircle className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-200 font-semibold text-sm">More Info</h3>
                      <a
                        href={infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm"
                      >
                        View on Google Books
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800 p-3">
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setSelectedBook(null)}
              className="px-4 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors rounded-xl text-sm"
            >
              Close
              <IoCloseCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default BookDetailView;
