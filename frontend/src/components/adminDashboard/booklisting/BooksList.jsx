import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import {
  FaBook,
  FaSearch,
  FaStore,
  FaRupeeSign,
  FaBookOpen,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooksData } from "@/store/adminSlice/booksData";
import { fetchSellersData } from "@/store/adminSlice/sellerData";
import { Skeleton } from "@/components/ui/skeleton";

const BooksList = () => {
  const dispatch = useDispatch();

  const books = useSelector((state) => state.adminBooksData.value) || [];
  const booksStatus = useSelector((state) => state.adminBooksData.status);
  const sellers = useSelector((state) => state.adminSellersData.value) || [];
  const sellersStatus = useSelector((state) => state.adminSellersData.status);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showMoreMap, setShowMoreMap] = useState({});

  // Dispatch fetch actions if not loaded
  useEffect(() => {
    if (
      (booksStatus === "idle" || booksStatus === "failed") &&
      (!Array.isArray(books) || books.length === 0)
    ) {
      dispatch(fetchBooksData());
    }

    if (
      (sellersStatus === "idle" || sellersStatus === "failed") &&
      (!Array.isArray(sellers) || sellers.length === 0)
    ) {
      dispatch(fetchSellersData());
    }
  }, [dispatch, booksStatus, sellersStatus, books, sellers]);


  const loading = booksStatus === "loading" || sellersStatus === "loading";
  const error = booksStatus === "failed" || sellersStatus === "failed";

  const getSellerInfo = (sellerId) =>
    Array.isArray(sellers)
      ? sellers.find((s) => s.sellerId === sellerId)
      : null;

  const filteredBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];
    return books.filter((book) => {
      const title = book.data?.volumeInfo?.title?.toLowerCase() || "";
      const authors =
        book.data?.volumeInfo?.authors?.join(" ")?.toLowerCase() || "";
      return (
        title.includes(searchQuery.toLowerCase()) ||
        authors.includes(searchQuery.toLowerCase())
      );
    });
  }, [books, searchQuery]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-6 bg-gray-700 rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 text-red-400 min-h-screen">
        <h2 className="text-xl font-semibold">
          Failed to load books or sellers. Please try again later.
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sky-400 flex items-center gap-2">
          <FaBookOpen /> Book Management
        </h1>
        <div className="relative w-64">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search books..."
            className="w-full pl-10 bg-gray-800 border border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-auto rounded-xl border border-gray-700 shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-800 text-sky-400">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Genre</th>
              <th className="p-4">ISBN</th>
              <th className="p-4">Sellers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredBooks.map((book, index) => {
              const volumeInfo = book.data?.volumeInfo || {};
              const title = volumeInfo.title || "Untitled";
              const authors =
                volumeInfo.authors?.join(", ") || "Unknown Author";
              const image =
                volumeInfo.imageLinks?.thumbnail || "/default-image.jpg";
              const isbn = book.isbn || book.id || `book-${index}`;
              const genre = volumeInfo.categories?.[0] || "Uncategorized";
              const fullDescription =
                volumeInfo.description || "No description available.";
              const shortDescription =
                fullDescription.length > 350
                  ? fullDescription.slice(0, 350) + "..."
                  : fullDescription;
              const showMore = showMoreMap[isbn] || false;
              const spCluster = book.spCluster || [];

              return (
                <Dialog
                  key={isbn}
                  open={selectedBook === isbn}
                  onOpenChange={(open) => setSelectedBook(open ? isbn : null)}
                >
                  <DialogTrigger asChild>
                    <tr
                      className="hover:bg-sky-700/10 cursor-pointer"
                      onClick={() => setSelectedBook(isbn)}
                    >
                      <td className="p-4">
                        <img
                          src={image}
                          alt={title}
                          className="w-12 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-4 font-semibold max-w-xs truncate">
                        {title}
                      </td>
                      <td className="p-4 text-gray-300">{authors}</td>
                      <td className="p-4 text-gray-300">{genre}</td>
                      <td className="p-4 text-gray-300 font-bold">{isbn}</td>
                      <td className="p-4 text-gray-300">
                        {spCluster.length} seller(s)
                      </td>
                    </tr>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <div className="flex gap-6 flex-col lg:flex-row">
                      <img
                        src={image}
                        className="w-40 rounded shadow"
                        alt={title}
                      />
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-sky-300">
                          {title}
                        </h2>
                        <p className="text-gray-400 text-sm">by {authors}</p>
                        <p className="text-gray-400 text-sm">Genre: {genre}</p>
                        <p className="text-gray-400 text-sm">ISBN: {isbn}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-sky-400 mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {showMore ? fullDescription : shortDescription}
                      </p>
                      {fullDescription.length > 350 && (
                        <button
                          onClick={() =>
                            setShowMoreMap((prev) => ({
                              ...prev,
                              [isbn]: !prev[isbn],
                            }))
                          }
                          className="text-sky-400 mt-2 text-sm font-medium"
                        >
                          {showMore ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-sky-400 mb-2">
                        Available Sellers
                      </h3>
                      {spCluster.length > 0 ? (
                        <div className="space-y-3">
                          {spCluster.map((sellerObj, i) => {
                            const seller = getSellerInfo(sellerObj.sellerId);
                            return (
                              <div
                                key={i}
                                className="p-3 border border-gray-700 rounded-lg bg-gray-900"
                              >
                                <div className="flex justify-between">
                                  <div className="text-gray-100 font-semibold">
                                    <FaStore className="inline-block mr-2 text-sky-300" />
                                    {seller?.storeName || "Unnamed Store"}
                                  </div>
                                  <div className="flex gap-4 text-sm items-center">
                                    <span className="flex items-center text-green-400">
                                      Price :
                                      <FaRupeeSign className="mr-1" />
                                      {sellerObj.price}
                                    </span>
                                    <span className="flex items-center text-blue-400">
                                      Stock :
                                      <FaBook className="mr-1" />
                                      {sellerObj.stock}
                                    </span>
                                  </div>
                                </div>
                                {seller?.address && (
                                  <div className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                                    <FaMapMarkerAlt />
                                    {seller.address.city}, {seller.address.state}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No sellers available for this book
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksList;
