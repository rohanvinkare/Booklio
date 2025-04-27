import React from "react";
import { Button } from "@/components/ui/button"; // ShadCN button
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // ShadCN dialog components
import { IoCloseCircle } from "react-icons/io5"; // Close icon

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
    <DialogContent className="max-w-4xl p-8 bg-white rounded-lg shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-3xl font-semibold text-gray-800">{title}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-gray-600">
        <div className="flex gap-8">
          {/* Image Section */}
          <div className="flex-shrink-0 w-1/3 pr-10">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto object-contain mb-4 rounded-lg shadow-md"
            />
          </div>

          {/* Details Section */}
          <div className="w-2/3">
            <p>
              <strong className="text-gray-800">Authors:</strong> {authors}
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">Description:</strong>{" "}
              {description.split(" ").slice(0, 20).join(" ")}...
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">ISBN:</strong> {isbn || "Not available"}
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">Publisher:</strong> {publisher}
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">Published Date:</strong> {publishedDate}
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">Maturity Rating:</strong> {maturityRating}
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">Language:</strong> {language}
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">Genre:</strong>{" "}
              {Array.isArray(genre) ? genre.join(", ") : genre}
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">More Info:</strong>{" "}
              <a
                href={infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                View on Google Books
              </a>
            </p>

            <div className="mt-4">
              <strong className="text-gray-800">Sellers:</strong>
              {spCluster.map((sellerCluster, idx) => {
                const seller = getSellerInfo(sellerCluster.sellerId);
                return seller ? (
                  <div key={idx} className="mt-4 bg-gray-50 p-4 rounded-md shadow-sm">
                    <p>
                      <strong className="text-gray-800">{seller.storeName || "Unnamed Store"}</strong>
                    </p>
                    <p className="text-orange-500 font-bold">
                      Price: ₹{sellerCluster.price || "Not available"}
                    </p>
                    <p className="text-blue-500">
                      Stock: {sellerCluster.stock || "Not available"}
                    </p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </DialogDescription>
      <DialogFooter>
        <Button
          variant="outline"
          className="mr-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
          onClick={() => setSelectedBook(null)}
        >
          Close
          <IoCloseCircle className="ml-2" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default BookDetailView;
