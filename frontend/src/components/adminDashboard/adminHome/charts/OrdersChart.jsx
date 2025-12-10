// import { Card, CardContent } from "@/components/ui/card";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function OrdersChart({ sellerOrders }) {
//   // Process data for charts
//   const processOrdersPerMonth = () => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const ordersPerMonth = new Array(12).fill(0);

//     Object.values(sellerOrders).forEach(orders => {
//       orders.forEach(order => {
//         const orderDate = new Date(order.createdAt);
//         const monthIndex = orderDate.getMonth();
//         ordersPerMonth[monthIndex]++;
//       });
//     });

//     return {
//       labels: months,
//       data: ordersPerMonth
//     };
//   };

//   const ordersData = processOrdersPerMonth();

//   const chartData = {
//     labels: ordersData.labels,
//     datasets: [
//       {
//         label: 'Orders Placed',
//         data: ordersData.data,
//         backgroundColor: 'rgba(99, 102, 241, 0.2)',
//         borderColor: 'rgb(99, 102, 241)',
//         borderWidth: 2,
//         fill: true,
//         tension: 0.4,
//       }
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: 'rgba(255, 255, 255, 0.7)',
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(17, 24, 39, 0.9)',
//         padding: 12,
//         bodyFont: {
//           family: 'Inter, sans-serif'
//         },
//         callbacks: {
//           label: function (context) {
//             return `Orders: ${context.parsed.y}`;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)'
//         },
//         ticks: {
//           color: 'rgba(255, 255, 255, 0.7)',
//           stepSize: 1
//         }
//       },
//       x: {
//         grid: {
//           display: false
//         },
//         ticks: {
//           color: 'rgba(255, 255, 255, 0.7)'
//         }
//       }
//     }
//   };

//   return (
//     <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl">
//       <CardContent className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h3 className="text-xl font-bold text-white mb-1">Orders Per Month</h3>
//             <p className="text-gray-400 text-sm">Monthly distribution</p>
//           </div>
//           <span className="text-sm font-medium px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
//             Monthly
//           </span>
//         </div>
//         <div className="h-72">
//           <Line data={chartData} options={chartOptions} />
//         </div>
//         <div className="mt-4 grid grid-cols-2 gap-4">
//           <div className="bg-gray-700/20 rounded-lg p-3 border border-gray-600/30">
//             <h4 className="text-sm font-medium text-gray-400 mb-1">Highest</h4>
//             <p className="text-lg font-semibold text-white">
//               {ordersData.labels[ordersData.data.indexOf(Math.max(...ordersData.data))]} - {Math.max(...ordersData.data)}
//             </p>
//           </div>
//           <div className="bg-gray-700/20 rounded-lg p-3 border border-gray-600/30">
//             <h4 className="text-sm font-medium text-gray-400 mb-1">Total</h4>
//             <p className="text-lg font-semibold text-white">
//               {ordersData.data.reduce((a, b) => a + b, 0)}
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }





import { Card, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function OrdersChart({ sellerOrders }) {
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

  const chartData = {
    labels: ordersData.labels,
    datasets: [
      {
        label: 'Orders Placed',
        data: ordersData.data,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // 🔥 This allows the chart to stretch to parent height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
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
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#cbd5e1',
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#cbd5e1'
        }
      }
    }
  };

  const highestMonthIndex = ordersData.data.indexOf(Math.max(...ordersData.data));
  const totalOrders = ordersData.data.reduce((a, b) => a + b, 0);

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 shadow-md hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-md rounded-2xl h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">🔥 Orders Per Month</h3>
            <p className="text-sm text-gray-400 p-2">Visualize monthly order trends</p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/30">
            Monthly
          </span>
        </div>

        {/* Chart section */}
        <div className="flex-grow relative">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Stats summary */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-sm font-medium text-gray-400 mb-1">⚡ Highest Month</h4>
            <p className="text-lg font-semibold text-white p-2">
              {ordersData.labels[highestMonthIndex]} – {ordersData.data[highestMonthIndex]} orders
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-sm font-medium text-gray-400 mb-1">📦 Total Orders</h4>
            <p className="text-lg font-semibold text-white p-2">
              {totalOrders}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
