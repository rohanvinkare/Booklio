import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, DollarSign } from "lucide-react";

export default function BestSellingBook({ book }) {
  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {book ? (
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Book Cover */}
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
              <img
                src={book.image}
                alt={book.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                }}
              />
              <div className="absolute top-3 left-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30 backdrop-blur-sm">
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Right Section - Book Details */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                {/* Title and Author */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Best Selling Book</h3>
                  <h4 className="text-2xl font-bold text-white mb-2">{book.title}</h4>
                  <p className="text-lg text-gray-300">by {book.author}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-indigo-500/20 rounded-md">
                        <BookOpen className="h-4 w-4 text-indigo-400" />
                      </div>
                      <p className="text-sm text-gray-400">Total Sales</p>
                    </div>
                    <p className="text-xl font-bold text-white">{book.sales}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-green-500/20 rounded-md">
                        <DollarSign className="h-4 w-4 text-green-400" />
                      </div>
                      <p className="text-sm text-gray-400">Revenue</p>
                    </div>
                    <p className="text-xl font-bold text-white">₹{book.revenue.toFixed(2)}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
                  <h5 className="text-sm font-medium text-gray-400 mb-3">Book Details</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-400">ISBN</p>
                      <p className="text-white font-medium">{book.isbn || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Publisher</p>
                      <p className="text-white font-medium">{book.publisher || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Published Date</p>
                      <p className="text-white font-medium">{book.publishedDate || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Language</p>
                      <p className="text-white font-medium">{book.language || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-700/20">
            <p className="text-gray-400">No sales data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}