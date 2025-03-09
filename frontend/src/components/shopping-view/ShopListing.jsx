import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ShopListing = () => {
  const [bookData, setBookData] = useState({});
  const [selectedGenre, setSelectedGenre] = useState(null); // To store selected genre
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch genres and books using the fetch API
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBookData(data.bookData);
          const genres = Object.keys(data.bookData);
          setSelectedGenre(genres[0]); // Set the first genre as default
          setBooks(data.bookData[genres[0]]); // Set initial books for the first genre
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleGenreChange = (genre, checked) => {
    if (checked) {
      setSelectedGenre(genre);
      setBooks(bookData[genre]);
    } else {
      setSelectedGenre(null);
      setBooks(Object.values(bookData).flat());
    }
  };

  const handleBuyNowClick = (isbn, sellerId) => {
    navigate(`/seller/${sellerId}/isbn/${isbn}`);
  };

  // Filter books based on the search query
  const filteredBooks = books.filter((book) => {
    const title = book.data.volumeInfo?.title?.toLowerCase() || "";
    const authors =
      book.data.volumeInfo?.authors?.join(", ").toLowerCase() || "";
    return (
      title.includes(searchQuery.toLowerCase()) ||
      authors.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex gap-4 p-10">
      {/* Left Sidebar: Genres */}
      <div className="w-1/5">
        <h2 className="text-xl font-bold mb-2">Genres</h2>
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* "All Books" option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="all-books"
                  checked={!selectedGenre}
                  onChange={() => {
                    setSelectedGenre(null);
                    setBooks(Object.values(bookData).flat());
                  }}
                  className="mr-2"
                />
                <label htmlFor="all-books">All Books</label>
              </div>

              {/* Map over genres */}
              {Object.keys(bookData).map((genre) => {
                const sanitizedGenreId = genre
                  .replace(/\s+/g, "-")
                  .toLowerCase();
                return (
                  <div key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      id={sanitizedGenreId}
                      checked={genre === selectedGenre}
                      onChange={(e) =>
                        handleGenreChange(genre, e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={sanitizedGenreId}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Section: Books */}
      <div className="w-4/5">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <h2 className="text-xl font-bold mb-4">
          {selectedGenre
            ? `Books in ${
                selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)
              }`
            : "All Books"}
        </h2>

        {/* Display filtered books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => {
              const price = book.spCluster?.[0]?.price;
              const thumbnail = book.data.volumeInfo?.imageLinks?.thumbnail;
              const title = book.data.volumeInfo?.title || "Unknown Title";
              const description =
                book.data.volumeInfo?.description || "No description available";

              return (
                <Card key={index} className="shadow-lg p-4 relative">
                  {price && (
                    <div className="absolute z-10 top-0 left-0 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md">
                      ₹{price}
                    </div>
                  )}

                  <CardHeader>
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-48 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <CardTitle className="mt-2 text-lg font-bold">
                      {title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-700 truncate">{description}</p>
                    <p className="text-gray-500 mt-2">
                      <strong>Author:</strong>{" "}
                      {book.data.volumeInfo.authors?.join(", ") || "Unknown"}
                    </p>
                    <p className="text-gray-500">
                      <strong>Publisher:</strong>{" "}
                      {book.data.volumeInfo.publisher || "Unknown"}
                    </p>
                    <p className="text-gray-500">
                      <strong>Pages:</strong>{" "}
                      {book.data.volumeInfo.pageCount || "N/A"}
                    </p>
                  </CardContent>

                  {price && (
                    <CardFooter className="flex p-0 w-full bg-blue-700 rounded-lg justify-center items-center">
                      <Button
                        className="text-white"
                        onClick={() =>
                          handleBuyNowClick(
                            book.isbn,
                            book.spCluster?.[0]?.sellerId
                          )
                        }
                      >
                        Buy Now
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              );
            })
          ) : (
            <p className="text-gray-500">
              No books match your search criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopListing;
