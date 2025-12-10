import { Card, CardContent } from "@/components/ui/card";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function TeamRadarChart({ members }) {
  // Team composition data
  const roleCounts = members.reduce((acc, member) => {
    const role = member.role || "Unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
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

  const chartOptions = {
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

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1"> 👥 Team Composition</h3>
            <p className="text-gray-400 text-sm">Role distribution</p>
          </div>
          <span className="text-sm font-medium px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
            {members.length} Members
          </span>
        </div>
        <div className="h-auto w-full flex items-center justify-center">
          <div className="w-full max-w-[320px] h-full">
            <Radar data={chartData} options={chartOptions} />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}