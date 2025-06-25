import { Search, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import GenreFilter from "./GenreFilter";

const SearchAndFilter = ({ searchQuery, setSearchQuery, bookData, selectedGenres, setSelectedGenres }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="relative w-full sm:w-3/4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] text-white bg-gray-900 border-gray-700 p-0">
          <GenreFilter bookData={bookData} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchAndFilter;

