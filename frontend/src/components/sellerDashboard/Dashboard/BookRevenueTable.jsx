import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const BookRevenueTable = ({ bookStats }) => {
  return (
    <Card className="border border-[#1f1c2e] shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-sky-400">Book Revenue Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-green-600 border-b border-[#2e2b3f]">
                <th className="text-left py-3 px-4">Book Title</th>
                <th className="text-left py-3 px-4">Copies Sold</th>
                <th className="text-left py-3 px-4">Total Revenue</th>
                <th className="text-left py-3 px-4">Avg. Price</th>
                <th className="text-left py-3 px-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {bookStats.map((book, index) => (
                <tr
                  key={book.isbn}
                  className="border-b border-[#2e2b3f] hover:bg-[#1a182c] transition"
                >
                  <td className="py-3 px-4 text-white max-w-[250px]">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">#{index + 1}</span>
                      <span className="font-medium truncate">{book.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white">
                    <span className="text-blue-300 font-medium">{book.copiesSold}</span>
                    <span className="text-xs text-neutral-400 ml-1">copies</span>
                  </td>
                  <td className="py-3 px-4 text-white">
                    <span className="text-green-300 font-medium">₹{book.totalRevenue.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4 text-white">
                    <span className="text-yellow-300 font-medium">₹{book.averagePrice.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {index === 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30 shadow-sm">
                          Best Performer
                        </span>
                      ) : index === bookStats.length - 1 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-400/30 shadow-sm">
                          Lowest Revenue
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-sm">
                          {((book.totalRevenue / bookStats[0].totalRevenue) * 100).toFixed(1)}% of Best
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookRevenueTable;
