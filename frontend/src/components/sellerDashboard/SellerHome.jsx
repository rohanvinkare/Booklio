import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchSellerBooks, fetchSellerOrders } from "../../store/sellerSlice";
import { useDispatch, useSelector } from "react-redux";
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
import {
  FaChartLine,
  FaRegCheckCircle,
  FaMoneyCheck,
  FaRupeeSign,
  FaBook,
  FaShoppingCart,
} from "react-icons/fa";

import StatsCards from "@/components/sellerDashboard/Dashboard/StatsCards";
import RevenueChart from "@/components/sellerDashboard/Dashboard/RevenueChart";
import GenreChart from "@/components/sellerDashboard/Dashboard/GenreChart";
import RecentOrdersTable from "@/components/sellerDashboard/Dashboard/RecentOrdersTable";
import BookRevenueTable from "@/components/sellerDashboard/Dashboard/BookRevenueTable";
import BookSalesChart from "@/components/sellerDashboard/Dashboard/BookSalesChart";

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

  const sellerBooks = useSelector((state) => state.seller.sellerBookData);
  const books = sellerBooks?.books || [];
  const genreCounts = books.reduce((acc, book) => {
    book.genre.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  const totalBooks = books.length || 1;
  const { sellerOrders } = useSelector((state) => state.seller);

  useEffect(() => {
    if (sellerId) {
      if (!sellerBooks) {
        dispatch(fetchSellerBooks(sellerId));
      }
      if (!sellerOrders || sellerOrders.length === 0) {
        dispatch(fetchSellerOrders(sellerId));
      }
    }
  }, [sellerId, dispatch, sellerBooks, sellerOrders]);


  const totalRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price), 0) || 0;
  const monthlyRevenue = sellerOrders?.reduce((sum, order) => sum + Number(order.price) / 12, 0) || 0;
  const totalProfit = sellerOrders?.reduce((sum, order) => sum + Number(order.price) * 0.04, 0) || 0;

  const bookStats = sellerOrders?.reduce((acc, order) => {
    const isbn = order.isbn;
    const bookDetails = books.find((book) => book.isbn === isbn);
    const bookTitle = bookDetails?.data?.volumeInfo?.title || "Unknown Book";
    const price = Number(order.price) || 0;

    if (!acc[isbn]) {
      acc[isbn] = {
        title: bookTitle,
        totalRevenue: 0,
        copiesSold: 0,
        averagePrice: 0,
      };
    }

    acc[isbn].totalRevenue += price;
    acc[isbn].copiesSold += 1;
    acc[isbn].averagePrice = acc[isbn].totalRevenue / acc[isbn].copiesSold;

    return acc;
  }, {});

  const sortedBookStats = Object.entries(bookStats || {})
    .map(([isbn, stats]) => ({
      isbn,
      ...stats,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  const bestSeller = sortedBookStats.length > 0 ? sortedBookStats[0] : { title: "N/A", isbn: null };

  const stats = [
    {
      title: "Annual Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: <FaChartLine />,
      iconBg: "from-blue-500 to-violet-600",
    },
    {
      title: "Monthly Revenue",
      value: `₹${monthlyRevenue.toFixed(2)}`,
      icon: <FaMoneyCheck />,
      iconBg: "from-purple-500 to-fuchsia-600",
    },
    {
      title: "Total Profit",
      value: `₹${totalProfit.toFixed(2)}`,
      icon: <FaRupeeSign />,
      iconBg: "from-yellow-400 to-orange-500",
    },
    {
      title: "Total Books",
      value: `${totalBooks}`,
      icon: <FaBook />,
      iconBg: "from-green-400 to-emerald-500",
    },
    {
      title: "Books Sold",
      value: `${sellerOrders.length}`,
      icon: <FaRegCheckCircle />,
      iconBg: "from-sky-400 to-cyan-500",
    },
    {
      title: "Best Seller",
      value: bestSeller.title,
      icon: <FaShoppingCart />,
      iconBg: "from-pink-500 to-rose-500",
    },
  ];

  const revenueChartData = {
    labels: sellerOrders?.map((order) => new Date(order.createdAt).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Total Revenue",
        data: sellerOrders?.map((order) => Number(order.price)) || [],
        borderColor: "#FF0080",
        backgroundColor: "rgba(255, 0, 128, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Monthly Revenue",
        data: sellerOrders?.map((order) => Number(order.price) / 12) || [],
        borderColor: "#7928CA",
        backgroundColor: "rgba(121, 40, 202, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Total Profit",
        data: sellerOrders?.map((order) => Number(order.price) * 0.04) || [],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
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
          color: "#ffffff", // legend label color
        },
      },
      tooltip: {
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        backgroundColor: "#1f1f1f",
        borderColor: "#ffffff30",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff", // x-axis tick color
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff", // y-axis tick color
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };


  return (
    <div className="min-h-screen bg-transparent px-4 py-8 md:p-10 space-y-10 text-white">


      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueChartData} options={revenueChartOptions} />
        <GenreChart genreCounts={genreCounts} />
      </div>

      <RecentOrdersTable orders={sellerOrders} books={books} />
      <BookRevenueTable bookStats={sortedBookStats} />
      <BookSalesChart bookStats={sortedBookStats} />
    </div>
  );
};

export default SellerHome;
