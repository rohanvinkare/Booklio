import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RecentOrdersTable = ({ orders, books }) => {

  const getStatusBadge = (status) => {
    const baseClass =
      "px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block shadow-sm border";

    switch (status) {
      case "completed":
        return `${baseClass} bg-green-500/20 text-green-300 border-green-400/30`;
      case "cancelled":
        return `${baseClass} bg-red-500/20 text-red-300 border-red-400/30`;
      case "shipped":
        return `${baseClass} bg-blue-500/20 text-blue-300 border-blue-400/30`;
      case "pending":
        return `${baseClass} bg-yellow-500/20 text-yellow-300 border-yellow-400/30`;
      case "placed":
        return `${baseClass} bg-purple-500/20 text-purple-300 border-purple-400/30`;
      default:
        return `${baseClass} bg-gray-500/20 text-gray-300 border-gray-400/30`;
    }
  };


  return (
    <Card className="border border-[#1f1c2e] shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-sky-400">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-green-600 border-b border-[#2e2b3f]">
                <th className="text-left py-3 px-4">Book</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Qty</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.slice(0, 5).map((order, index) => {
                const book = books.find((b) => b.isbn === order.isbn);
                const title = book?.data?.volumeInfo?.title || "N/A";
                const customerName = order.user?.name || "N/A";
                const customerMobile = order.user?.mobile || "N/A";

                return (
                  <tr key={index} className="border-b border-[#2e2b3f] hover:bg-[#1a182c] transition">
                    <td className="py-3 px-4 text-white max-w-[200px]">
                      <div className="flex flex-col">
                        <span className="font-medium truncate">{title}</span>
                        <span className="py-1 text-xs text-neutral-400 break-words">ISBN: {order.isbn}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">{customerName}</span>
                        <span className="py-1 text-xs text-neutral-400">{customerMobile}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">₹{order.price}</span>
                        <span className="py-1 text-xs text-neutral-400">₹{(order.price / order.quantity).toFixed(2)} each</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">{order.quantity}</td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex flex-col">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="py-1 text-xs text-neutral-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;




