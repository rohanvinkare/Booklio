import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchSellerBooks, fetchSellerOrders } from "../../store/sellerSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  FaArrowUp,
  FaRegFileAlt,
  FaRegClock,
  FaRegCheckCircle,
  FaChartLine,
  FaRegFolder,
  FaMoneyCheck,
  FaDollarSign,
  FaRupeeSign,
  FaFacebookSquare,
  FaBook,
  FaSalesforce,
  FaSellcast,
  FaShopify,
  FaShoppingBag,
  FaShoppingBasket,
  FaShoppingCart
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

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

  const genreCounts = books.reduce((acc, book) => {
    book.genre.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  console.log("Redux Store - Books:", books);

  // Get total books for percentage calculation
  const totalBooks = books.length || 1;

  // Get orders from Redux
  const { sellerOrders, loading, error, mostOrderedBook } = useSelector((state) => state.seller);

  console.log("Most Ordered Book:", mostOrderedBook);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerOrders(sellerId));
    }
  }, [sellerId, dispatch]);

  // Find the book that is ordered maximum times based on ISBN
  const findBestSellerBook = () => {
    if (!sellerOrders || sellerOrders.length === 0) {
      return { title: "N/A", isbn: null };
    }

    // Count occurrences of each ISBN
    const isbnCount = {};
    sellerOrders.forEach(order => {
      const isbn = order.isbn;
      isbnCount[isbn] = (isbnCount[isbn] || 0) + 1;
    });

    // Find ISBN with highest count
    let maxCount = 0;
    let bestSellerISBN = null;

    for (const isbn in isbnCount) {
      if (isbnCount[isbn] > maxCount) {
        maxCount = isbnCount[isbn];
        bestSellerISBN = isbn;
      }
    }

    // Find the corresponding book title
    if (bestSellerISBN) {
      const bestSellerOrder = sellerOrders.find(order => order.isbn === bestSellerISBN);
      if (bestSellerOrder?.bookInfo?.data?.volumeInfo?.title) {
        return { 
          title: bestSellerOrder.bookInfo.data.volumeInfo.title,
          isbn: bestSellerISBN
        };
      }
    }

    return { title: "N/A", isbn: null };
  };

  const bestSeller = findBestSellerBook();

  const totalRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price), 0) || 0;
  const monthlyRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price) / 12, 0) || 0;
  const totalProfit = sellerOrders?.reduce((sum, order) => sum + Number(order.price) * 0.04, 0) || 0;

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
      value: bestSeller.title, // Use the calculated best seller title
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


  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerBooks(sellerId));
    }
  }, [sellerId, dispatch]);


  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-[#232323] border-none shadow-md hover:shadow-lg transition"
          >
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${stat.iconBg}`}>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* book genres chart */}
        <Card className="bg-[#232323] border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between px-6">
            <div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Revenue Charts</span>
              </div>
              <CardTitle className="text-2xl mt-1">₹{totalRevenue}</CardTitle>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-green-400">{((totalProfit/totalRevenue)*100).toFixed(2)}%</span>
                <span className="ml-2 text-gray-400">Total Profit</span>
              </div>
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-xs text-gray-400">On track</span>
              </div>
            </div>
            <div className="bg-[#FF6B4A] text-white px-2 py-1 rounded-md text-xs font-medium">
            {((monthlyRevenue/totalRevenue)*100).toFixed(2)}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <Line data={revenueChartData} options={revenueChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Project Completion */}
        <Card className="bg-[#232323] border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Book Genres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(genreCounts).map(([genre, count], index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{genre}</span>
                  <span className="text-gray-400">{count} books</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                    style={{ width: `${(count / totalBooks) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="pt-4 flex">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-xs text-gray-500">{i * 10}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerHome;