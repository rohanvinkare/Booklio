import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { booksData } from "@/store/adminSlice/booksData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FaBook, FaSearch, FaFilter, FaStar, FaRupeeSign, FaTag, FaBookOpen, FaUser, FaCalendar, FaLanguage } from "react-icons/fa";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BookDetailView from "@/components/adminDashboard/BookDetailView";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const BooksList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.adminBooksData.value);
  const sellers = useSelector((state) => state.adminSellersData.value);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
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
          dispatch(booksData(allBooks));
        } else {
          dispatch(booksData([]));
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        dispatch(booksData([]));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [dispatch]);

  const getSellerInfo = (sellerId) => {
    return sellers.find((seller) => seller.sellerId === sellerId);
  };

  const filteredBooks = books.filter((book) => {
    const title = book.data?.volumeInfo?.title?.toLowerCase() || "";
    const authors = book.data?.volumeInfo?.authors?.join(" ")?.toLowerCase() || "";
    const description = book.data?.volumeInfo?.description?.toLowerCase() || "";
    const genre = book.data?.volumeInfo?.categories?.[0]?.toLowerCase() || "";

    const matchesSearch = title.includes(searchQuery.toLowerCase()) ||
      authors.includes(searchQuery.toLowerCase()) ||
      description.includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === "all" || genre.includes(genreFilter.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-8 w-48 bg-gray-800" />
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-64 bg-gray-800" />
            <Skeleton className="h-10 w-full sm:w-32 bg-gray-800" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader className="p-4">
                <Skeleton className="h-64 w-full bg-gray-700" />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
              </CardContent>
              <CardFooter className="p-4">
                <Skeleton className="h-10 w-full bg-gray-700" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <FaBookOpen className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100">Books Management</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-gray-100 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-full sm:w-32 bg-gray-800 border-gray-700 text-gray-100 hover:border-indigo-500 transition-all duration-200">
              <FaFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">All Genres</SelectItem>
              <SelectItem value="fiction" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Fiction</SelectItem>
              <SelectItem value="non-fiction" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Non-Fiction</SelectItem>
              <SelectItem value="science" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Science</SelectItem>
              <SelectItem value="technology" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => {
            const { id, isbn } = book;
            const uniqueKey = id || isbn || index;
            const volumeInfo = book.data?.volumeInfo || {};
            const imageUrl = volumeInfo.imageLinks?.thumbnail || "/default-image.jpg";
            const title = volumeInfo.title || "Untitled";
            const authors = volumeInfo.authors?.join(", ") || "Unknown Author";

            return (
              <Dialog
                key={uniqueKey}
                open={selectedBook === uniqueKey}
                onOpenChange={(open) =>
                  open ? setSelectedBook(uniqueKey) : setSelectedBook(null)
                }
              >
                <DialogTrigger asChild>
                  <Card className="bg-gray-800 border-gray-700 cursor-pointer">
                    <CardHeader className="p-4">
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <h2 className="text-lg font-bold text-gray-100 line-clamp-2">{title}</h2>
                      <div className="flex items-center text-sm text-gray-300">
                        <FaUser className="h-4 w-4 mr-2 text-indigo-400" />
                        <span className="line-clamp-1">{authors}</span>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

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
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto shadow-lg">
              <FaBook className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg font-medium">No books found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;
