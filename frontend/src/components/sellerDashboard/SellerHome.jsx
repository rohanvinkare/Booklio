import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "tailwindcss/tailwind.css";
import { useOutletContext } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SellerHome = () => {
  const [sellerBookData, setsellerBookData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [booksAvailable, setBooksAvailable] = useState(0);
  const { sellerData } = useOutletContext();
  const sellerId = sellerData?.sellerId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/book/api/v1/books-by-seller/${sellerId}`
        );
        const data = await response.json();
        setsellerBookData(data);
        calculateMetrics(data);
        prepareChartData(data);
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = (data) => {
    const books = data.books;
    const booksCount = books.length;

    setBooksAvailable(booksCount); // Assuming all books in array are available
  };

  const prepareChartData = (data) => {
    const genres = data.books.map((book) => book.data.volumeInfo.categories?.[0] || "Unknown");

    // Get unique genres to use for x-axis labels
    const uniqueGenres = [...new Set(genres)];

    // Count the number of books per genre
    const bookCountByGenre = uniqueGenres.map((genre) =>
      genres.filter((g) => g === genre).length
    );

    // Define options dynamically for quantity comparison
    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "#4B5563",
          },
        },
        tooltip: {
          backgroundColor: "#2563EB",
          titleColor: "#FFF",
          bodyColor: "#FFF",
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#6B7280",
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#6B7280",
            callback: function (value) {
              return value; // Number of books, no currency format
            },
          },
          grid: {
            color: "#E5E7EB",
            borderDash: [5, 5],
          },
          suggestedMin: 0,
          suggestedMax: Math.max(...bookCountByGenre) + 2, // Add headroom above the max count
        },
      },
    };

    setChartData({
      labels: uniqueGenres,
      datasets: [
        {
          label: "Books by Genre",
          data: bookCountByGenre,
          backgroundColor: "#E11D48",
          borderColor: "#9B1C1C",
          borderWidth: 1,
        },
      ],
      options: barChartOptions,
    });
  };

  if (!sellerBookData || !chartData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center md:flex-row gap-6">
        {/* Bar Chart */}
        <Card className="flex-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Books Quantity Comparison by Genre</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px]">
            <Bar data={chartData} options={chartData.options} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerHome;
