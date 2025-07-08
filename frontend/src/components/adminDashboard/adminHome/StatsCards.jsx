import { Card, CardContent } from "@/components/ui/card";
import { Users, Store, BookOpen, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatsCards({ users, sellers, books, trends, calculatePercentageChange }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-indigo-500/20 rounded-lg mb-2">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="text-gray-400 text-sm font-medium mb-1">Total Users</span>
            <span className="text-2xl font-bold text-white mb-1">{users}</span>
            <div className="flex items-center">
              <span className={`text-xs ${trends.users.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trends.users.trend === 'up' ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
                {Math.abs(calculatePercentageChange(trends.users.current, trends.users.previous)).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-sky-500/20 rounded-lg mb-2">
              <Store className="h-5 w-5 text-sky-400" />
            </div>
            <span className="text-gray-400 text-sm font-medium mb-1">Total Sellers</span>
            <span className="text-2xl font-bold text-white mb-1">{sellers}</span>
            <div className="flex items-center">
              <span className={`text-xs ${trends.sellers.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trends.sellers.trend === 'up' ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
                {Math.abs(calculatePercentageChange(trends.sellers.current, trends.sellers.previous)).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-orange-500/20 rounded-lg mb-2">
              <BookOpen className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-gray-400 text-sm font-medium mb-1">Total Books</span>
            <span className="text-2xl font-bold text-white mb-1">{books}</span>
            <div className="flex items-center">
              <span className={`text-xs ${trends.books.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trends.books.trend === 'up' ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
                {Math.abs(calculatePercentageChange(trends.books.current, trends.books.previous)).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}