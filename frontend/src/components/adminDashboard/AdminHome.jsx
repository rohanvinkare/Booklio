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

  // Generalized fetch function for all data
  const fetchAllData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-batch-data`
      );
      const data = await response.json();
      console.log(data)
      if (data) {
        if (data.users) {
          dispatch(usersData(data.users));
        }
        if (data.sellers) {
          dispatch(sellersData(data.sellers));
        }
        if (data.management) {
          dispatch(managementsData(data.management));
        }
      } else {
        // In case of an error or no data
        dispatch(usersData([]));
        dispatch(sellersData([]));
        dispatch(managementsData([]));
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`
      );
      const data = await response.json();
      // console.log(data)
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
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgb(79, 70, 229)",
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
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Prepare data for pie chart (Genres overview)
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
        borderColor: "#ffffff",
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
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderColor: "rgba(79, 70, 229, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(79, 70, 229, 1)",
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
          font: {
            family: 'Inter, sans-serif',
            size: 10
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Inter, sans-serif'
          }
        }
      }
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-500">Overview of bookstore performance and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm bg-white rounded-xl overflow-hidden border-l-4 border-indigo-600">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium mb-1">Total Users</span>
              <span className="text-4xl font-bold text-gray-900">{users.length}</span>
              <span className="text-indigo-600 text-sm mt-2">Active accounts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white rounded-xl overflow-hidden border-l-4 border-sky-500">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium mb-1">Total Sellers</span>
              <span className="text-4xl font-bold text-gray-900">{sellers.length}</span>
              <span className="text-sky-500 text-sm mt-2">Registered partners</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white rounded-xl overflow-hidden border-l-4 border-orange-500">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium mb-1">Total Books</span>
              <span className="text-4xl font-bold text-gray-900">{books.length}</span>
              <span className="text-orange-500 text-sm mt-2">Available titles</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Books by Genre (Bar Chart) */}
      <Card className="shadow-sm rounded-xl bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Books by Genre</h3>
            <span className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {books.length} Total
            </span>
          </div>
          <div className="h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Genre Overview (Pie Chart) */}
        <Card className="shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Genre Distribution</h3>
              <span className="text-xs font-medium px-3 py-1 bg-sky-50 text-sky-700 rounded-full">
                {genreLabels.length} Categories
              </span>
            </div>
            <div className="w-full flex justify-center">
              <div className="w-96 h-96">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Users by Role (Radar Chart) */}
        <Card className="shadow-sm rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Team Composition</h3>
              <span className="text-xs font-medium px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
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
  );
};

export default AdminHome;