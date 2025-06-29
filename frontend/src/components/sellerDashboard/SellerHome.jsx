import { useEffect } from "react";  // Remove useState since it's not used
import { useOutletContext } from "react-router-dom";
import { fetchSellerBooks, fetchSellerOrders } from "../../store/sellerSlice";
import { useDispatch, useSelector } from "react-redux";

import { FaChartLine, FaRegCheckCircle, FaMoneyCheck, FaRupeeSign, FaBook, FaShoppingCar} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SellerHome = () => {
  const dispatch = useDispatch();
  const { sellerData } = useOutletContext();
  const sellerId = sellerData?.sellerId;

  const sellerBooks = useSelector(state => state.seller.sellerBookData);
  const books = sellerBooks?.books || []; // Ensure books is always an array
  console.log("Books:", books);
  const genreCounts = books.reduce((acc, book) => {
    book.genre.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  // Get total books for percentage calculation
  const totalBooks = books.length || 1;

  // Get orders from Redux
  const { sellerOrders, loading, error, mostOrderedBook } = useSelector((state) => state.seller);
  // Add these debug logs
  console.log("Sample Order Data:", sellerOrders?.[0]);
  console.log("Sample Book Info:", sellerOrders?.[0]?.book);
  console.log("Seller Orders:", sellerOrders);
  console.log("Most Ordered Book:", mostOrderedBook);
  console.log("Loading:", loading);
  console.log("Error:", error);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerBooks(sellerId));
      dispatch(fetchSellerOrders(sellerId));
      console.log("Fetching data for seller:", sellerId);
    }
  }, [sellerId, dispatch]); // Remove sellerOrders from dependencies

  const totalRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price), 0) || 0;
  const monthlyRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price) / 12, 0) || 0;
  const totalProfit = sellerOrders?.reduce((sum, order) => sum + Number(order.price) * 0.04, 0) || 0;

  // Update the bookStats calculation
  const bookStats = sellerOrders?.reduce((acc, order) => {
    const isbn = order.isbn;
    // Find the book details from the books array
    const bookDetails = books.find(book => book.isbn === isbn);
    const bookTitle = bookDetails?.data?.volumeInfo?.title || "Unknown Book";
    const price = Number(order.price) || 0;

    if (!acc[isbn]) {
      acc[isbn] = {
        title: bookTitle,
        totalRevenue: 0,
        copiesSold: 0,
        averagePrice: 0
      };
    }

    acc[isbn].totalRevenue += price;
    acc[isbn].copiesSold += 1;
    acc[isbn].averagePrice = acc[isbn].totalRevenue / acc[isbn].copiesSold;

    return acc;
  }, {});

  // Convert to array and sort by revenue
  const sortedBookStats = Object.entries(bookStats || {})
    .map(([isbn, stats]) => ({
      isbn,
      ...stats
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  const findBestSellerBook = () => {
    return sortedBookStats.length > 0 ? sortedBookStats[0] : { title: "N/A", isbn: null };
  };

  const bestSeller = findBestSellerBook();

  const stats = [
    {
      title: "Annual Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: <FaChartLine />,
      iconBg: "from-blue-400 to-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: `₹${monthlyRevenue.toFixed(2)}`,
      icon: <FaMoneyCheck />,
      iconBg: "from-purple-400 to-purple-600",
    },
    {
      title: "Total Profit",
      value: `₹${totalProfit.toFixed(2)}`,
      icon: <FaRupeeSign />,
      iconBg: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Total Books",
      value: `${totalBooks}`,
      icon: <FaBook />,
      iconBg: "from-green-400 to-green-600",
    },
    {
      title: "Books Sold",
      value: `${sellerOrders.length}`,
      icon: <FaRegCheckCircle />,
      iconBg: "from-blue-400 to-blue-600",
    },
    {
      title: "Best Seller",
      value: bestSeller.title,
      icon: <FaShoppingCart />,
      iconBg: "from-indigo-400 to-indigo-600",
    },
  ];

  const revenueChartData = {
    labels: sellerOrders?.map((order) => new Date(order.createdAt).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Total Revenue",
        data: sellerOrders?.map((order) => Number(order.price)) || [],
        borderColor: "#FF6B4A",
        backgroundColor: "rgba(255, 107, 74, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Monthly Revenue",
        data: sellerOrders?.map((order) => Number(order.price) / 12) || [],
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Total Profit",
        data: sellerOrders?.map((order) => Number(order.price) * 0.04) || [],
        borderColor: "#42B883",
        backgroundColor: "rgba(66, 184, 131, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
    <div className="space-y-8 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-lg`}>
                  <span className="text-xl text-white">{stat.icon}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#232323] border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Line data={revenueChartData} options={revenueChartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-[#232323] border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Genre Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Bar
              data={{
                labels: Object.keys(genreCounts),
                datasets: [
                  {
                    label: "Books by Genre",
                    data: Object.values(genreCounts),
                    backgroundColor: "rgba(255, 107, 74, 0.6)",
                    borderColor: "#FF6B4A",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: "#fff",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#aaa" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                  },
                  y: {
                    ticks: { color: "#aaa" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="bg-[#232323] border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Book</th>
                  <th className="text-left py-3 px-4 text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-400">Price</th>
                  <th className="text-left py-3 px-4 text-gray-400">Quantity</th>
                  <th className="text-left py-3 px-4 text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders?.slice(0, 5).map((order, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {books.find(book => book.isbn === order.isbn)?.data?.volumeInfo?.title || "N/A"}
                        </span>
                        <span className="text-sm text-gray-400">ISBN: {order.isbn}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.user?.name || "N/A"}</span>
                        <span className="text-sm text-gray-400">{order.user?.mobile || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">₹{order.price}</span>
                        <span className="text-sm text-gray-400">₹{(order.price / order.quantity).toFixed(2)} each</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <span className="font-medium">{order.quantity}</span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex flex-col">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : order.status === "shipped"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                        {order.status === "pending" ? "Placed" : order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Book Revenue Analysis Section */}
      <Card className="bg-[#232323] border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Book Revenue Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Book Title</th>
                  <th className="text-left py-3 px-4 text-gray-400">Copies Sold</th>
                  <th className="text-left py-3 px-4 text-gray-400">Total Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-400">Average Price</th>
                  <th className="text-left py-3 px-4 text-gray-400">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookStats.map((book, index) => (
                  <tr key={book.isbn} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">#{index + 1}</span>
                        <span className="font-medium">{book.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">{book.copiesSold}</span>
                        <span className="text-gray-400">copies</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">₹{book.totalRevenue.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">₹{book.averagePrice.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            Best Performer
                          </span>
                        ) : index === sortedBookStats.length - 1 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                            Lowest Revenue
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            {((book.totalRevenue / sortedBookStats[0].totalRevenue) * 100).toFixed(1)}% of Best
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

      {/* Book Sales Distribution Chart */}
      <Card className="bg-[#232323] border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Book Sales Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <Bar
            data={{
              labels: sortedBookStats.map(book => book.title),
              datasets: [
                {
                  label: "Copies Sold",
                  data: sortedBookStats.map(book => book.copiesSold),
                  backgroundColor: "rgba(74, 144, 226, 0.6)",
                  borderColor: "#4A90E2",
                  borderWidth: 1,
                },
                {
                  label: "Revenue (₹)",
                  data: sortedBookStats.map(book => book.totalRevenue),
                  backgroundColor: "rgba(255, 107, 74, 0.6)",
                  borderColor: "#FF6B4A",
                  borderWidth: 1,
                }
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    color: "#fff",
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#aaa",
                    maxRotation: 45,
                    minRotation: 45
                  },
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                },
                y: {
                  ticks: { color: "#aaa" },
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerHome;