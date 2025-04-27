import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FaBook, FaBookOpen, FaStoreAlt, FaStoreAltSlash, FaUpload } from "react-icons/fa";
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
  // const navigate = useNavigate();

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
    toast((t) => (
      <div className="flex flex-col items-center bg-white rounded-lg">
        <span className="text-gray-800 font-semibold text-lg mb-4">
          Are you sure you want to delete this book?
        </span>
        <div className="flex space-x-4">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              removeBook(isbn);
              toast.dismiss(t.id);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ));
  };

  const removeBook = async (isbn) => {
    const token = localStorage.getItem("accessToken");
    try {
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
        fetchBooks();

      } else {
        toast.error("Failed to remove the book. Please try again.");
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {books.length > 0 ? (
        books.map((book, index) => {
          const {
            data: { volumeInfo },
            spCluster,
          } = book;

          console.log(books, "books")

          // Extract relevant data
          const title = volumeInfo?.title || "Untitled";
          const authors = volumeInfo?.authors?.join(", ") || "Unknown Author";
          const description =
            volumeInfo?.description || "No description available.";
          const imageUrl =
            volumeInfo?.imageLinks?.thumbnail || "/default-image.jpg";
          const isbn =
            volumeInfo?.industryIdentifiers?.[0]?.identifier || "N/A";
          const publishedDate = volumeInfo?.publishedDate || "N/A";
          const publisher = volumeInfo?.publisher || "N/A";
          const stock = spCluster[0]?.stock || "N/A";
          const sellerPrice = spCluster[0]?.price || "N/A";

          // Find price for the current seller
          // const sellerPrice =
          //   spCluster.find((cluster) => cluster.sellerId === sellerId)?.price ||
          //   "N/A";

          return (
            <Dialog
              key={isbn || index}
              open={selectedBook === isbn}
              onOpenChange={(open) =>
                open ? setSelectedBook(isbn) : setSelectedBook(null)
              }
            >
              <Card className="shadow-lg flex flex-col justify-between z-10 w-full md:w-72 cursor-pointer relative">
                {/* Price Badge */}
                <div className="relative">
                  <div className="absolute z-10 -top-1 -left-2 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md before:z-5 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:border-l-8 before:border-l-transparent before:border-t-8 before:border-t-red-700">
                    ₹{sellerPrice}
                  </div>
                </div>
                <CardHeader className="px-4 py-2 flex justify-center items-center">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-64 object-contain"
                  />
                  <div className="flex justify-center items-center gap-2">
                    <FaStoreAlt /> 
                    <span className="rounded-xl text-blue-300">Stock: {stock} books available</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <h2 className="text-xl font-semibold text-white">
                    {title}
                  </h2>
                  <p className="text-sm text-white">{authors}</p>
                  <p className="mt-2 text-sm text-white line-clamp-3">
                    {description}
                  </p>
                </CardContent>
                <DialogTrigger asChild>
                  <CardFooter className="flex justify-center items-center bg-blue-600 text-white p-4 rounded-b-lg border-t border-gray-300">
                    <Button className="flex items-center justify-center px-4 py-2 rounded-lg">
                      <FaBook className="mr-2" />
                      View
                    </Button>
                  </CardFooter>
                </DialogTrigger>
              </Card>
              <DialogContent className="max-w-3xl p-6 bg-[#232323] text-white rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="flex ">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-1/3 h-auto object-contain mr-6"
                  />
                  <div className="flex flex-col space-y-2 w-2/3">
                    <p>
                      <strong>Author:</strong> {authors}
                    </p>
                    <p>
                      <strong>Description:</strong> {truncatedDescription(description)}
                    </p>
                    <p>
                      <strong>Price:</strong> <b className="text-green-500"> ₹{sellerPrice}</b>
                    </p>
                    <p>
                      <strong>Stock:</strong> <b className="text-blue-500">{stock} books available</b>
                    </p>
                    <p>
                      <strong>ISBN:</strong> <b>{isbn} </b>
                    </p>
                    <p>
                      <strong>Published Date:</strong> {publishedDate}
                    </p>
                    <p>
                      <strong>Publisher:</strong> {publisher}
                    </p>
                  </div>
                </DialogDescription>
                <DialogFooter className="flex justify-end">
                  <Button
                    className="bg-red-500 text-black"
                    onClick={() => confirmRemoveBook(book.isbn)} // Confirmation before delete
                  >
                    Remove <IoCloseCircle className="ml-2" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })
      ) : (
        <p className="text-center text-gray-700">No books available</p>
      )}
    </div>
  );
};

export default SellerBooksList;
