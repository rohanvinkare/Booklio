import { Card, CardContent } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GenrePieChart({ books }) {
  const genreCounts = books.reduce((acc, book) => {
    const genre = book.genre || "Unknown";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const genreLabels = Object.keys(genreCounts);
  const genreValues = Object.values(genreCounts);

  // Generate colors dynamically if needed
  const generateColors = (count) => {
    const palette = [
      "rgba(99, 102, 241, 0.8)", "rgba(14, 165, 233, 0.8)", "rgba(249, 115, 22, 0.8)",
      "rgba(236, 72, 153, 0.8)", "rgba(139, 92, 246, 0.8)", "rgba(16, 185, 129, 0.8)",
      "rgba(255, 206, 86, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)", "rgba(255, 99, 132, 0.8)"
    ];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  };

  const chartData = {
    labels: genreLabels,
    datasets: [
      {
        data: genreValues,
        backgroundColor: generateColors(genreLabels.length),
        borderColor: "rgba(17, 24, 39, 0.9)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        padding: 12,
        bodyFont: {
          family: "Inter, sans-serif",
        },
      },
    },
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">🌐 Genre Distribution</h3>
            <p className="text-sm text-gray-400">Book distribution by category</p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/30">
            {genreLabels.length} Categories
          </span>
        </div>

        {/* Chart */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-full h-64 max-w-xs">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Genre list */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
          {genreLabels.map((genre, index) => (
            <div key={genre} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              ></div>
              <span className="truncate">{genre} ({genreCounts[genre]})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
