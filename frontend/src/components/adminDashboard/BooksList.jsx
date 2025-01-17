import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { booksData } from "@/store/adminSlice/booksData"; // Import the action from adminSlice
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"; // ShadCN card components
import { FaBook } from "react-icons/fa"; // Icons for the card
import { IoCloseCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button"; // ShadCN button
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // ShadCN dialog components

const BooksList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.adminBooksData.value); // Fetch books from Redux store
  const [selectedBook, setSelectedBook] = useState(null); // Track selected book for the dialog

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`);
        const data = await response.json();

        if (data.success && data.bookData) {
          const allBooks = [];
          Object.values(data.bookData).forEach((booksArray) => {
            if (Array.isArray(booksArray)) {
              allBooks.push(...booksArray);
            }
          });

          dispatch(booksData(allBooks)); // Dispatch formatted data to Redux
        } else {
          dispatch(booksData([])); // Fallback to empty array
        }
      } catch (error) {
        dispatch(booksData([])); // Fallback to empty array
      }
    };

    fetchBooks();
  }, [dispatch]);

  if (!books) {
    return <div className="text-center p-8 text-xl">Loading...</div>;;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {books.length > 0 ? (
        books.map((book, index) => {
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
          const price = spCluster?.[0]?.price || "Not available";
          const infoLink = data?.volumeInfo?.infoLink || "#";

          const uniqueKey = id || isbn || index;

          return (
            <Dialog
              key={uniqueKey}
              open={selectedBook === uniqueKey}
              onOpenChange={(open) => open ? setSelectedBook(uniqueKey) : setSelectedBook(null)}
            >
              <Card className="shadow-slate-500 flex flex-col justify-between z-10 w-full md:w-72 cursor-pointer relative">
                {/* Offer Badge */}
                <div className="relative">
                  <div className="absolute z-10 -top-1 -left-2 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md before:z-5 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:border-l-8 before:border-l-transparent before:border-t-8 before:border-t-red-700">
                    ₹{price}
                  </div>
                </div>
                <CardHeader>
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-64 object-contain"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                  <p className="text-sm text-gray-600">{authors}</p>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">{description}</p>
                </CardContent>
                <DialogTrigger asChild>
                  <CardFooter className="flex justify-center items-center bg-blue-600 text-white p-4 rounded-b-lg border-t border-slate-300">
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center justify-center px-4 py-2 rounded-lg"
                        variant="primary"
                        size="sm"
                      >
                        <FaBook className="mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                  </CardFooter>
                </DialogTrigger>
              </Card>
              <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-64 object-contain mb-4"
                  />
                  <p><strong>Authors:</strong> {authors}</p>
                  <p className="mt-2"><strong>Description:</strong> {description.split(" ").slice(0, 20).join(" ")}...</p>
                  <p className="mt-2"><strong>Price:</strong> {price !== "Not available" ? `₹${price}` : "Not available"}</p>
                  <p className="mt-2"><strong>ISBN:</strong> {isbn || "Not available"}</p>
                  <p className="mt-2"><strong>Publisher:</strong> {publisher}</p>
                  <p className="mt-2"><strong>Published Date:</strong> {publishedDate}</p>
                  <p className="mt-2"><strong>Maturity Rating:</strong> {maturityRating}</p>
                  <p className="mt-2"><strong>Language:</strong> {language}</p>
                  <p className="mt-2"><strong>Genre:</strong> {Array.isArray(genre) ? genre.join(", ") : genre}</p>
                  <p className="mt-2">
                    <strong>More Info:</strong> <a href={infoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View on Google Books</a>
                  </p>
                </DialogDescription>
                <DialogFooter>
                  <Button variant="outline" className="mr-4 rounded-xl bg-red-500 text-white" onClick={() => setSelectedBook(null)}>
                    Close<IoCloseCircle />
                  </Button>
                </DialogFooter>
              </DialogContent>

            </Dialog>
          );
        })
      ): <p>No books available</p>}
    </div>
  );
};

export default BooksList;
