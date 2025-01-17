import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { booksData } from "@/store/adminSlice/booksData";
import { sellersData } from "@/store/adminSlice/sellerData";
import { usersData } from "@/store/adminSlice/usersData";
import { managementsData } from "@/store/adminSlice/managementData";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Pie, Radar } from "react-chartjs-2";
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

// Register necessary Chart.js components
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

  useEffect(() => {
    // Fetch books
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

    // Fetch sellers
    const fetchSellers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-member-data/`
        );
        const data = await response.json();
        if (data.success && data.memberData) {
          dispatch(sellersData(data.memberData));
        }
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-user-data/`
        );
        const data = await response.json();
        if (data.success && data.userData) {
          dispatch(usersData(data.userData));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch management data
    const fetchManagement = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-member-data/`
        );
        const data = await response.json();
        if (data.success && data.memberData) {
          dispatch(managementsData(data.memberData));
        }
      } catch (error) {
        console.error("Error fetching management data:", error);
      }
    };

    fetchBooks();
    fetchSellers();
    fetchUsers();
    fetchManagement();
  }, [dispatch]);

  // Prepare data for bar chart (Books by Genre)
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for pie chart (Genres overview)
  const pieData = {
    labels: genreLabels,
    datasets: [
      {
        data: genreValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  // Process data to count members per role for radar chart
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
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Display Total Counts */}
      <div className="flex justify-around items-center bg-white shadow-lg rounded-xl p-6 mb-6">
        <div className="text-center">
          <h4 className="text-xl font-bold text-gray-800">Total Users</h4>
          <p className="text-3xl font-bold text-gray-700">{users.length}</p>
        </div>
        <div className="text-center">
          <h4 className="text-xl font-bold text-gray-800">Total Sellers</h4>
          <p className="text-3xl font-bold text-gray-700">{sellers.length}</p>
        </div>
        <div className="text-center">
          <h4 className="text-xl font-bold text-gray-800">Total Books</h4>
          <p className="text-3xl font-bold text-gray-700">{books.length}</p>
        </div>
      </div>

      {/* Books by Genre (Bar Chart) */}
      <Card className="shadow-lg rounded-xl bg-white p-6">
        <CardContent>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Books by Genre
          </h3>
          <Bar data={barData} />
        </CardContent>
      </Card>

      <div className="flex flex-row">
        {/* Genre Overview (Pie Chart) */}
        <Card className="shadow-lg rounded-xl w-1/2 m-2 bg-white p-6">
          <CardContent>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Genre Overview
            </h3>
            <Pie data={pieData} />
          </CardContent>
        </Card>

        {/* Users by Role (Radar Chart) */}
        <Card className="shadow-lg rounded-xl w-1/2 m-2 bg-white p-6">
          <CardContent>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Users by Role
            </h3>
            <Radar data={radarData} options={radarOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
