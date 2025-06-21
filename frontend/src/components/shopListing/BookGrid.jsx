import BookCard from "./BookCard";
import notAvailable from "@/assets/notAvailable.png";

const BookGrid = ({ books, handleBuyNowClick, setSelectedBook }) => {
  if (!books.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16">
        <img src={notAvailable} alt="No books available" className="h-48 mb-6 opacity-50" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Books Found</h3>
        <p className="text-gray-400 text-center max-w-md">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
      {books.map((book, index) => (
        <BookCard
          key={index}
          book={book}
          onClick={() => setSelectedBook(book)}
          handleBuyNowClick={handleBuyNowClick}
        />
      ))}
    </div>
  );
};

export default BookGrid;
