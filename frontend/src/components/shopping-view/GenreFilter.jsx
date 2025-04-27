import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

const GenreFilter = ({ bookData, selectedGenres, setSelectedGenres }) => {
  const handleGenreChange = (genre, checked) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[120px] left-4 w-60 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 overflow-hidden"
    >
      <div className="p-4 bg-gray-900/50 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-100">Genre Filters</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Select genres to filter books
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)] px-4 py-2">
        <div className="space-y-4">
          {/* "All Books" Option */}
          <div className="relative flex items-center space-x-2 group">
            <Checkbox
              id="all-books"
              checked={selectedGenres.length === 0}
              onCheckedChange={() => setSelectedGenres([])}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label
              htmlFor="all-books"
              className="text-sm font-medium leading-none group-hover:text-blue-400 transition-colors cursor-pointer"
            >
              All Books
            </Label>
            {selectedGenres.length === 0 && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-r-full"
              />
            )}
          </div>

          <div className="h-px bg-gray-700/50" /> {/* Divider */}

          {/* Genre Options */}
          <div className="space-y-3">
            {Object.keys(bookData).map((genre) => (
              <div
                key={genre}
                className="relative flex items-center space-x-2 group"
              >
                <Checkbox
                  id={genre.replace(/\s+/g, "-").toLowerCase()}
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={(checked) => handleGenreChange(genre, checked)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label
                  htmlFor={genre.replace(/\s+/g, "-").toLowerCase()}
                  className="text-sm font-medium leading-none group-hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </Label>
                {selectedGenres.includes(genre) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-r-full"
                  />
                )}
                <span className="ml-auto text-xs text-gray-500">
                  {bookData[genre].length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Selected Filters Summary */}
      {selectedGenres.length > 0 && (
        <div className="p-4 bg-gray-900/50 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {selectedGenres.length} genre{selectedGenres.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedGenres([])}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GenreFilter;
  