import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { booksData } from "@/store/adminSlice/booksData";
import { sellersData } from "@/store/adminSlice/sellerData";
import { usersData } from "@/store/adminSlice/usersData";
import { managementsData } from "@/store/adminSlice/managementData";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Pie, Radar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  BookOpen,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  DollarSign,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

const AdminHome = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.adminBooksData.value);
  const sellers = useSelector((state) => state.adminSellersData.value);
  const users = useSelector((state) => state.adminUsersData.value);
  const members = useSelector((state) => state.adminManagementsData.value);
  const [loading, setLoading] = useState(true);
  const [bestSellingBook, setBestSellingBook] = useState(null);
  const [topSeller, setTopSeller] = useState(null);
  const [sellerOrders, setSellerOrders] = useState({});

  // Mock data for trends
  const mockTrends = {
    users: { current: users.length, previous: Math.floor(users.length * 0.9), trend: "up" },
    sellers: { current: sellers.length, previous: Math.floor(sellers.length * 0.85), trend: "up" },
    books: { current: books.length, previous: Math.floor(books.length * 0.95), trend: "up" },
  };

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    return ((current - previous) / previous) * 100;
  };

  // Fetch orders for all sellers
  const fetchAllSellerOrders = async () => {
    try {
      const ordersPromises = sellers.map(seller =>
        fetch(`${import.meta.env.VITE_BASE_URL}/order/seller-order-list/${seller.sellerId}`)
          .then(res => res.json())
          .then(data => ({
            sellerId: seller.sellerId,
            orders: data.success ? data.data[0]?.orders || [] : []
          }))
      );

      const ordersResults = await Promise.all(ordersPromises);
      const ordersMap = ordersResults.reduce((acc, { sellerId, orders }) => {
        acc[sellerId] = orders;
        return acc;
      }, {});
      setSellerOrders(ordersMap);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    }
  };

  // Calculate best selling book and top seller
  const calculateBestSellingBookAndTopSeller = () => {
    const bookSales = {};
    Object.values(sellerOrders).forEach(orders => {
      orders.forEach(order => {
        const { isbn, price, quantity } = order;
        if (!bookSales[isbn]) {
          bookSales[isbn] = {
            totalSales: 0,
            totalRevenue: 0,
            orders: []
          };
        }
        bookSales[isbn].totalSales += quantity;
        bookSales[isbn].totalRevenue += price;
        bookSales[isbn].orders.push(order);
      });
    });

    const bestSellingIsbn = Object.entries(bookSales)
      .sort(([, a], [, b]) => b.totalSales - a.totalSales)[0]?.[0];

    if (bestSellingIsbn) {
      const bestSellingBookData = books.find(book => book.isbn === bestSellingIsbn);
      if (bestSellingBookData) {
        setBestSellingBook({
          title: bestSellingBookData.data?.volumeInfo?.title || "Unknown Title",
          author: bestSellingBookData.data?.volumeInfo?.authors?.[0] || "Unknown Author",
          sales: bookSales[bestSellingIsbn].totalSales,
          revenue: bookSales[bestSellingIsbn].totalRevenue,
          rating: bestSellingBookData.data?.volumeInfo?.averageRating || 0,
          image: bestSellingBookData.data?.volumeInfo?.imageLinks?.thumbnail || "/default-image.jpg",
          isbn: bestSellingBookData.isbn,
          publisher: bestSellingBookData.data?.volumeInfo?.publisher,
          publishedDate: bestSellingBookData.data?.volumeInfo?.publishedDate,
          language: bestSellingBookData.data?.volumeInfo?.language
        });
      }
    }

    const sellerProfits = {};
    Object.entries(sellerOrders).forEach(([sellerId, orders]) => {
      const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
      const totalProfit = totalRevenue * 0.95;
      const booksSold = orders.reduce((sum, order) => sum + order.quantity, 0);

      sellerProfits[sellerId] = {
        totalRevenue,
        totalProfit,
        booksSold,
        orders: orders.length
      };
    });

    const topSellerId = Object.entries(sellerProfits)
      .sort(([, a], [, b]) => b.totalProfit - a.totalProfit)[0]?.[0];

    if (topSellerId) {
      const sellerData = sellers.find(seller => seller.sellerId === topSellerId);
      if (sellerData) {
        setTopSeller({
          name: sellerData.name,
          profit: sellerProfits[topSellerId].totalProfit,
          booksSold: sellerProfits[topSellerId].booksSold,
          orders: sellerProfits[topSellerId].orders,
          rating: 4.5
        });
      }
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-batch-data`
      );
      const data = await response.json();
      if (data) {
        if (data.users) dispatch(usersData(data.users));
        if (data.sellers) dispatch(sellersData(data.sellers));
        if (data.management) dispatch(managementsData(data.management));
      } else {
        dispatch(usersData([]));
        dispatch(sellersData([]));
        dispatch(managementsData([]));
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`
      );
      const data = await response.json();
      if (data.success && data.bookData) {
        const allBooks = Object.values(data.bookData).flat();
        dispatch(booksData(allBooks));
      } else {
        dispatch(booksData([]));
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAllData();
  }, [dispatch]);

  useEffect(() => {
    if (sellers.length > 0) {
      fetchAllSellerOrders();
    }
  }, [sellers]);

  useEffect(() => {
    if (Object.keys(sellerOrders).length > 0 && books.length > 0) {
      calculateBestSellingBookAndTopSeller();
    }
  }, [sellerOrders, books]);

  // Process data for charts
  const processOrdersPerMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const ordersPerMonth = new Array(12).fill(0);

    Object.values(sellerOrders).forEach(orders => {
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const monthIndex = orderDate.getMonth();
        ordersPerMonth[monthIndex]++;
      });
    });

    return {
      labels: months,
      data: ordersPerMonth
    };
  };

  const ordersData = processOrdersPerMonth();

  const ordersChartData = {
    labels: ordersData.labels,
    datasets: [
      {
        label: 'Orders Placed',
        data: ordersData.data,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const ordersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        bodyFont: {
          family: 'Inter, sans-serif'
        },
        callbacks: {
          label: function (context) {
            return `Orders: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  // Genre distribution data
  const genreCounts = books.reduce((acc, book) => {
    const genre = book.genre || "Unknown";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const genreLabels = Object.keys(genreCounts);
  const genreValues = Object.values(genreCounts);

  const barData = {
    labels: genreLabels,
    datasets: [
      {
        label: "Books by Genre",
        data: genreValues,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        bodyFont: {
          family: 'Inter, sans-serif'
        },
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} books`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  // Pie chart data
  const pieData = {
    labels: genreLabels,
    datasets: [
      {
        data: genreValues,
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: "rgba(17, 24, 39, 0.9)",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20,
          font: {
            family: 'Inter, sans-serif',
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        bodyFont: {
          family: 'Inter, sans-serif'
        }
      }
    }
  };

  // Team composition data
  const roleCounts = members.reduce((acc, member) => {
    const role = member.role || "Unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const radarData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        label: "Users by Role",
        data: Object.values(roleCounts),
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointRadius: 4,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'Inter, sans-serif',
            size: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'Inter, sans-serif'
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 bg-gray-800 mb-2" />
          <Skeleton className="h-4 w-64 bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 bg-gray-700 mb-2" />
                <Skeleton className="h-8 w-16 bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 bg-gray-700 mb-4" />
                <Skeleton className="h-64 w-full bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800/30 p-6 rounded-xl border border-gray-700/30 backdrop-blur-sm">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Admin Dashboard</h2>
          <p className="text-gray-400">Overview of bookstore performance and analytics</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-300 bg-gray-700/30 px-4 py-2 rounded-lg border border-gray-600/30 backdrop-blur-sm">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Main Content Grid - Flipped Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Right Column - Stats and Charts (Now on the right) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Small Stats Grid at Top */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-indigo-500/20 rounded-lg mb-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span className="text-gray-400 text-sm font-medium mb-1">Total Users</span>
                  <span className="text-2xl font-bold text-white mb-1">{users.length}</span>
                  <div className="flex items-center">
                    <span className={`text-xs ${mockTrends.users.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {mockTrends.users.trend === 'up' ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
                      {Math.abs(calculatePercentageChange(mockTrends.users.current, mockTrends.users.previous)).toFixed(1)}%
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
                  <span className="text-2xl font-bold text-white mb-1">{sellers.length}</span>
                  <div className="flex items-center">
                    <span className={`text-xs ${mockTrends.sellers.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {mockTrends.sellers.trend === 'up' ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
                      {Math.abs(calculatePercentageChange(mockTrends.sellers.current, mockTrends.sellers.previous)).toFixed(1)}%
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
                  <span className="text-2xl font-bold text-white mb-1">{books.length}</span>
                  <div className="flex items-center">
                    <span className={`text-xs ${mockTrends.books.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {mockTrends.books.trend === 'up' ? <ArrowUpRight className="h-3 w-3 inline" /> : <ArrowDownRight className="h-3 w-3 inline" />}
                      {Math.abs(calculatePercentageChange(mockTrends.books.current, mockTrends.books.previous)).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Selling Book */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl overflow-hidden">
            <CardContent className="p-0">
              {bestSellingBook ? (
                <div className="flex flex-col md:flex-row">
                  {/* Left Section - Book Cover */}
                  <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                    <img
                      src={bestSellingBook.image}
                      alt={bestSellingBook.title}
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
                    {/* <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="text-white font-medium">{bestSellingBook.rating}</span>
                      </div>
                    </div> */}
                  </div>

                  {/* Right Section - Book Details */}
                  <div className="flex-1 p-6">
                    <div className="space-y-4">
                      {/* Title and Author */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Best Selling Book</h3>
                        <h4 className="text-2xl font-bold text-white mb-2">{bestSellingBook.title}</h4>
                        <p className="text-lg text-gray-300">by {bestSellingBook.author}</p>
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
                          <p className="text-xl font-bold text-white">{bestSellingBook.sales}</p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-green-500/20 rounded-md">
                              <DollarSign className="h-4 w-4 text-green-400" />
                            </div>
                            <p className="text-sm text-gray-400">Revenue</p>
                          </div>
                          <p className="text-xl font-bold text-white">₹{bestSellingBook.revenue.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
                        <h5 className="text-sm font-medium text-gray-400 mb-3">Book Details</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-400">ISBN</p>
                            <p className="text-white font-medium">{bestSellingBook.isbn || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Publisher</p>
                            <p className="text-white font-medium">{bestSellingBook.publisher || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Published Date</p>
                            <p className="text-white font-medium">{bestSellingBook.publishedDate || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Language</p>
                            <p className="text-white font-medium">{bestSellingBook.language || 'N/A'}</p>
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

          {/* Charts Grid */}
          <div className="space-y-4">
            {/* Orders Per Month Chart */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Orders Per Month</h3>
                    <p className="text-gray-400 text-sm">Monthly distribution</p>
                  </div>
                  <span className="text-sm font-medium px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                    Monthly
                  </span>
                </div>
                <div className="h-72">
                  <Line data={ordersChartData} options={ordersChartOptions} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/20 rounded-lg p-3 border border-gray-600/30">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Highest</h4>
                    <p className="text-lg font-semibold text-white">
                      {ordersData.labels[ordersData.data.indexOf(Math.max(...ordersData.data))]} - {Math.max(...ordersData.data)}
                    </p>
                  </div>
                  <div className="bg-gray-700/20 rounded-lg p-3 border border-gray-600/30">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Total</h4>
                    <p className="text-lg font-semibold text-white">
                      {ordersData.data.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Books by Genre Chart */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Books by Genre</h3>
                    <p className="text-gray-400 text-sm">Genre distribution</p>
                  </div>
                  <span className="text-sm font-medium px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                    {books.length} Total
                  </span>
                </div>
                <div className="h-72">
                  <Bar data={barData} options={barOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Left Column - Performance and Distribution (Now on the left) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Performing Seller */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Top Performing Seller</h3>
                  <p className="text-gray-400 text-sm">Highest revenue seller</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
              </div>
              {topSeller ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{topSeller.name}</h4>
                      <p className="text-gray-400 text-sm">Top Seller</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">₹{topSeller.profit.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">Total Profit</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/30">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Books Sold</p>
                      <p className="text-xl font-semibold text-white">{topSeller.booksSold}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                      <p className="text-xl font-semibold text-white">{topSeller.orders}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No seller data available</p>
              )}
            </CardContent>
          </Card>

          {/* Genre Distribution */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Genre Distribution</h3>
                  <p className="text-gray-400 text-sm">Book distribution</p>
                </div>
                <span className="text-sm font-medium px-3 py-1.5 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
                  {genreLabels.length} Categories
                </span>
              </div>
              <div className="w-full flex justify-center">
                <div className="w-full h-64">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Composition */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Team Composition</h3>
                  <p className="text-gray-400 text-sm">Role distribution</p>
                </div>
                <span className="text-sm font-medium px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                  {members.length} Members
                </span>
              </div>
              <div className="h-64">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;