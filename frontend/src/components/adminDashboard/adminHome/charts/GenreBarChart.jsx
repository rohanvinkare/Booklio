import { Card, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GenreBarChart({ books }) {
  const genreCounts = books.reduce((acc, book) => {
    const genre = book.genre || "Unknown";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const genreLabels = Object.keys(genreCounts);
  const genreValues = Object.values(genreCounts);

  const chartData = {
    labels: genreLabels,
    datasets: [
      {
        label: "Books by Genre",
        data: genreValues,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 30, // ✅ Adjust thickness for better visibility
        maxBarThickness: 50,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 🔥 Key for filling parent height
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
          color: 'rgba(255, 255, 255, 0.05)'
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

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 shadow-md hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-md rounded-2xl h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">📚 Books by Genre</h3>
            <p className="text-sm text-gray-400">Genre distribution across all books</p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/30">
            {books.length} Total
          </span>
        </div>

        {/* Taller, scroll-free chart */}
        <div className="relative flex-grow min-h-[22rem]"> 
          <Bar data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
