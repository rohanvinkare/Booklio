import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { booksData } from "@/store/adminSlice/booksData";
import { usersData } from "@/store/adminSlice/usersData";
import { managementsData } from "@/store/adminSlice/managementData";
import HeaderSection from "@/components/adminDashboard/adminHome/HeaderSection";
import StatsCards from "@/components/adminDashboard/adminHome/StatsCards";
import BestSellingBook from "@/components/adminDashboard/adminHome/BestSellingBook";
import TopPerformingSeller from "@/components/adminDashboard/adminHome/TopPerformingSeller";
import OrdersChart from "@/components/adminDashboard/adminHome/charts/OrdersChart";
import GenreBarChart from "@/components/adminDashboard/adminHome/charts/GenreBarChart";
import GenrePieChart from "@/components/adminDashboard/adminHome/charts/GenrePieChart";
import TeamRadarChart from "@/components/adminDashboard/adminHome/charts/TeamRadarChart";
import SkeletonLoader from "@/components/adminDashboard/adminHome/SkeletonLoader";
import { setSellersData } from "@/store/adminSlice/sellerData";


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

  const mockTrends = {
    users: { current: users.length, previous: Math.floor(users.length * 0.9), trend: "up" },
    sellers: { current: sellers.length, previous: Math.floor(sellers.length * 0.85), trend: "up" },
    books: { current: books.length, previous: Math.floor(books.length * 0.95), trend: "up" },
  };

  const calculatePercentageChange = (current, previous) => {
    return ((current - previous) / previous) * 100;
  };

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

  const calculateBestSellingBookAndTopSeller = () => {
    const bookSales = {};
    Object.values(sellerOrders).forEach(orders => {
      orders.forEach(order => {
        const { isbn, price, quantity } = order;
        if (!bookSales[isbn]) {
          bookSales[isbn] = { totalSales: 0, totalRevenue: 0, orders: [] };
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
          image: bestSellingBookData.data?.volumeInfo?.imageLinks?.thumbnail || "https://eazysale.in/wp-content/uploads/2024/09/genericBookCover.jpg",
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

  const fetchAllData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-batch-data`);
      const data = await res.json();
      if (data) {
        if (data.users) dispatch(usersData(data.users));
        if (data.sellers) dispatch(setSellersData(data.sellers));
        if (data.management) dispatch(managementsData(data.management));
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`);
      const data = await res.json();
      if (data.success && data.bookData) {
        const allBooks = Object.values(data.bookData).flat();
        dispatch(booksData(allBooks));
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const promises = [];

      if (books.length === 0) promises.push(fetchBooks());
      if (users.length === 0 || sellers.length === 0 || members.length === 0)
        promises.push(fetchAllData());

      await Promise.all(promises);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (sellers.length > 0) fetchAllSellerOrders();
  }, [sellers]);

  useEffect(() => {
    if (Object.keys(sellerOrders).length > 0 && books.length > 0) {
      calculateBestSellingBookAndTopSeller();
    }
  }, [sellerOrders, books]);



  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);



  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen">
      <HeaderSection />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-4">
          <StatsCards
            users={users.length}
            sellers={sellers.length}
            books={books.length}
            trends={mockTrends}
            calculatePercentageChange={calculatePercentageChange}
          />

          <BestSellingBook book={bestSellingBook} />

          <div className="space-y-4">
            <OrdersChart sellerOrders={sellerOrders} />
            <GenreBarChart books={books} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <TopPerformingSeller seller={topSeller} />
          <GenrePieChart books={books} />
          <TeamRadarChart members={members} />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
