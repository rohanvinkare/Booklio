import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { booksData } from "@/store/adminSlice/booksData"; // Import the action from adminSlice
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"; // ShadCN card components
import { FaBook } from "react-icons/fa"; // Icons for the card
import { Dialog, DialogTrigger } from "@/components/ui/dialog"; // ShadCN dialog components
import BookDetailView from "@/components/adminDashboard/BookDetailView"; // Import new component
import { Button } from "../landingPage/Button";

const BooksList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.adminBooksData.value); // Fetch books from Redux store
  const sellers = useSelector((state) => state.adminSellersData.value); // Fetch sellers from Redux store
  const [selectedBook, setSelectedBook] = useState(null); // Track selected book for the dialog

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`
        );
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

  const getSellerInfo = (sellerId) => {
    return sellers.find((seller) => seller.sellerId === sellerId);
  };

  if (!books) {
    return <div className="text-center p-8 text-xl">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {books.length > 0 ? (
        books.map((book, index) => {
          const { id, isbn } = book;
          const uniqueKey = id || isbn || index;

          return (
            <Dialog
              key={uniqueKey}
              open={selectedBook === uniqueKey}
              onOpenChange={(open) =>
                open ? setSelectedBook(uniqueKey) : setSelectedBook(null)
              }
            >
              <Card className="shadow-slate-500 flex flex-col justify-between z-10 w-full md:w-72 cursor-pointer relative">
                <CardHeader className="px-0 py-2 my-0" >
                  <img
                    src={book.data?.volumeInfo?.imageLinks?.thumbnail || "/default-image.jpg"}
                    alt={book.data?.volumeInfo?.title || "Untitled"}
                    className="w-full h-64 object-contain"
                  />
                </CardHeader>
                <CardContent className="my-0">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {book.data?.volumeInfo?.title || "Untitled"}
                  </h2>
                  <p className="text-sm text-gray-600">{book.data?.volumeInfo?.authors?.join(", ") || "Unknown Author"}</p>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {book.data?.volumeInfo?.description || "No description available."}
                  </p>
                </CardContent>
                <DialogTrigger asChild>
                  <CardFooter className="flex justify-center items-center bg-blue-600 text-white p-4 rounded-b-lg border-t border-slate-300">
                    <a
                      className="flex items-center justify-center px-4 py-2 rounded-lg"
                      variant="primary"
                      size="sm"
                    >
                      <FaBook className="mr-2" />
                      View
                    </a>
                  </CardFooter>
                </DialogTrigger>
              </Card>

              <BookDetailView
                book={book}
                selectedBook={selectedBook}
                setSelectedBook={setSelectedBook}
                getSellerInfo={getSellerInfo}
              />
            </Dialog>
          );
        })
      ) : (
        <p>No books available</p>
      )}
    </div>
  );
};

export default BooksList;
