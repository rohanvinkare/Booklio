
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { fetchSellerBooks } from "@/store/sellerSlice"; // adjust path
import { clearSellerBookData } from "@/store/sellerSlice";

const SellerBooksList = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");
  const [showMoreMap, setShowMoreMap] = useState({});
  const { sellerData } = useOutletContext();
  const navigate = useNavigate();
  const sellerId = sellerData?.sellerId;

  const dispatch = useDispatch();
  const { sellerBookData, loading } = useSelector((state) => state.seller);
  const books = sellerBookData?.books || [];

  useEffect(() => {
    if (sellerId && books.length === 0) {
      dispatch(fetchSellerBooks(sellerId));
    }
  }, [sellerId, dispatch, books.length]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const title = book.data?.volumeInfo?.title?.toLowerCase() || "";
      const isbn = book.isbn?.toLowerCase() || "";
      return title.includes(search.toLowerCase()) || isbn.includes(search.toLowerCase());
    });
  }, [books, search]);

  const confirmRemoveBook = async (isbn) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return toast.error("Authentication token not found.");

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/remove-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "Bearer " + token, isbn }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Book removed successfully!");
        setSelectedBook(null);
        dispatch(clearSellerBookData());
      } else {
        toast.error(data.msg || "Failed to remove the book.");
      }
    } catch (err) {
      console.error("Error removing book:", err);
      toast.error("An error occurred.");
    }
  };


  return (
    <div className="p-6 text-white bg-gradient-to-b from-black via-[#0d0b1e] to-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Your Books
        </h1>
        <Button
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg"
          onClick={() => navigate("/seller/add-book")}
        >
          <FaUpload className="mr-2" /> Add New Book
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or ISBN"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/30 backdrop-blur-md border border-indigo-700 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-auto rounded-xl border backdrop-blur-md  shadow-2xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-4 text-left text-teal-400">Cover</th>
              <th className="p-4 text-left text-red-400">Title</th>
              <th className="p-4 text-left text-emerald-400">ISBN</th>
              <th className="p-4 text-left text-pink-400">Author</th>
              <th className="p-4 text-left text-sky-500">Genre</th>
              <th className="p-4 text-left text-yellow-300">Price</th>
              <th className="p-4 text-left text-orange-500">Stock</th>
              <th className="p-4 text-left text-lime-400">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-800">
            {filteredBooks.map((book, idx) => {
              const volumeInfo = book.data?.volumeInfo || {};
              const image = volumeInfo.imageLinks?.thumbnail || "https://eazysale.in/wp-content/uploads/2024/09/genericBookCover.jpg";
              const title = volumeInfo.title || "Untitled";
              const isbn = book.isbn;
              const price = book.spCluster?.[0]?.price || "N/A";
              const stock = book.spCluster?.[0]?.stock || "N/A";
              const author = volumeInfo.authors?.[0] || "Unknown";
              const genre = book.genre?.[0] || volumeInfo.categories?.[0] || "N/A";
              const rating = volumeInfo.averageRating || "-";
              const fullDescription = volumeInfo.description || 'No description available.';
              const shortDescription = fullDescription.length > 400 ? fullDescription.slice(0, 400) + "..." : fullDescription;
              const showMore = showMoreMap[isbn] || false;
              const isExpanded = selectedBook === isbn;

              return (
                <Dialog key={isbn || idx} open={isExpanded} onOpenChange={(open) => setSelectedBook(open ? isbn : null)}>
                  <DialogTrigger asChild>
                    <tr className="hover:bg-blue-500/10 transition cursor-pointer" onClick={() => setSelectedBook(isbn)}>
                      <td className="p-4">
                        <img src={image} alt={title} className="w-12 h-16 object-cover rounded-md shadow-md" />
                      </td>
                      <td className="p-4 font-semibold max-w-xs truncate text-gray-300">{title}</td>
                      <td className="p-4 text-gray-300 font-bold">{isbn}</td>
                      <td className="p-4 text-gray-300">{author}</td>
                      <td className="p-4 text-gray-300">{genre}</td>
                      <td className="p-4 text-green-400 font-bold">₹{price}</td>
                      <td className="p-4 text-white font-bold">{stock}</td>
                      <td className="p-4 text-yellow-400 font-bold">⭐ {rating}</td>
                    </tr>
                  </DialogTrigger>



                  <DialogContent className="max-w-2xl mx-auto my-4 bg-gradient-to-br from-black via-[#0a0a0f] to-black backdrop-blur-xl border border-purple-900/30 rounded-3xl shadow-2xl text-white p-4 space-y-3">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-black/80 via-purple-950/20 to-black/80 p-3 rounded-2xl border border-purple-800/20 mx-2">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        {/* Image */}
                        <div className="flex justify-center">
                          <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-violet-500/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                            <img
                              src={image}
                              alt={title}
                              className="relative rounded-2xl shadow-xl w-full max-w-[140px] object-contain bg-black/50 p-2 border border-purple-800/30"
                            />
                          </div>
                        </div>

                        {/* Title + Author + Genre */}
                        <div className="lg:col-span-2 space-y-2">
                          <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text leading-snug">
                              {title}
                            </h2>
                            <p className="text-xs text-purple-200/70 font-medium mt-1">by {author}</p>
                          </div>

                          {/* Rating Section */}
                          <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-purple-800/20">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-700'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-purple-200 font-medium text-xs">{rating}</span>
                              <span className="text-purple-300/60 text-xs">({volumeInfo.ratingsCount || 0} reviews)</span>
                            </div>
                          </div>

                          {/* Genre Tags */}
                          <div className="flex flex-wrap gap-1">
                            {genre.split(',').map((g, i) => (
                              <span key={i} className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 text-purple-200 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-purple-700/30">
                                {g.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mx-2">
                      <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-3 rounded-2xl border border-green-800/30">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">💰</span>
                          </div>
                          <div>
                            <p className="text-green-300/70 text-[10px] uppercase font-medium tracking-wide">Price</p>
                            <p className="text-lg font-bold text-green-400">₹{price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-3 rounded-2xl border border-blue-800/30">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">📦</span>
                          </div>
                          <div>
                            <p className="text-blue-300/70 text-[10px] uppercase font-medium tracking-wide">Stock</p>
                            <p className="text-lg font-bold text-blue-400">{stock}</p>
                            <p className="text-blue-300/60 text-[10px]">units available</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-2">
                      {[
                        { label: 'ISBN', value: isbn, icon: '📚', color: '' },
                        { label: 'Publisher', value: volumeInfo.publisher || 'N/A', icon: '🏢', color: 'indigo' },
                        { label: 'Published', value: volumeInfo.publishedDate || 'N/A', icon: '📅', color: 'violet' },
                        { label: 'Language', value: volumeInfo.language || 'N/A', icon: '🌐', color: 'purple' },
                        { label: 'Pages', value: volumeInfo.pageCount || 'N/A', icon: '📄', color: 'indigo' },
                        { label: 'Version', value: volumeInfo.contentVersion || 'N/A', icon: '🔄', color: 'violet' }
                      ].map((item, idx) => (
                        <div key={idx} className={`bg-gradient-to-br from-${item.color}-950/40 to-black/60 p-2.5 rounded-xl border border-${item.color}-800/20 hover:scale-[1.02] hover:border-${item.color}-700/40 transition-all duration-200`}>
                          <div className="flex gap-2 items-start">
                            <div className={`w-5 h-5 bg-${item.color}-500/20 rounded-lg flex items-center justify-center`}>
                              <span className="text-xs">{item.icon}</span>
                            </div>
                            <div>
                              <p className={`text-sky-500 font-bold text-[12px] uppercase  tracking-wide`}>{item.label}</p>
                              <p className="text-white font-semibold text-xs">{item.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="bg-gradient-to-br from-purple-950/30 to-black/60 p-3 rounded-2xl border border-purple-800/20 mx-2">
                      <h3 className="text-sm font-semibold text-purple-200 mb-2 flex gap-2 items-center">
                        <span className="text-base">📖</span>
                        Description
                      </h3>
                      <div className="max-w-full overflow-hidden max-h-[150px] overflow-y-auto">
                        <p className="text-sm text-purple-100/80 leading-snug break-words">
                          {showMore ? fullDescription : shortDescription}
                        </p>
                        {fullDescription && fullDescription.length > 400 && (
                          <button
                            className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors font-medium"
                            onClick={() => setShowMoreMap(prev => ({ ...prev, [isbn]: !prev[isbn] }))}
                          >
                            {showMore ? 'Show Less' : 'Show More'}
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-center pt-2 border-t border-purple-900/30 mx-2">
                      <Button
                        className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-bold px-6 py-1.5 rounded-xl border border-red-500/30 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-red-500/20"
                        onClick={() => confirmRemoveBook(isbn)}
                      >
                        <IoCloseCircle className="mr-2 text-base" />
                        Remove Book
                      </Button>
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

export default SellerBooksList;








