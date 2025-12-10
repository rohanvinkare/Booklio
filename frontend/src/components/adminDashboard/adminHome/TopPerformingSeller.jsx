import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function TopPerformingSeller({ seller }) {
  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">⚡ Top Performing Seller</h3>
            <p className="text-gray-400 text-sm p-2">Highest revenue seller</p>
          </div>
          <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
        </div>
        {seller ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">{seller.name}</h4>
                <p className="text-gray-400 text-sm p-2">Top Seller</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">₹{seller.profit.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">Total Profit</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/30">
              <div>
                <p className="text-gray-400 text-sm mb-1">Books Sold</p>
                <p className="text-xl font-semibold text-white">{seller.booksSold}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                <p className="text-xl font-semibold text-white">{seller.orders}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No seller data available</p>
        )}
      </CardContent>
    </Card>
  );
}