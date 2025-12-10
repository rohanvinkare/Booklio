import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {

  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,

  CartesianGrid,
  Area,
  AreaChart
} from "recharts";
import { FaChartBar, FaChartPie, FaMoneyBillWave, FaTimes, FaHourglassHalf, FaCheckCircle } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSales = () => {
  const [payCutData, setPayCutData] = useState({
    totalPendingPayCut: 0,
    totalCanceledPayCut: 0,
    totalCompletedPayCut: 0,
    pendingDetails: [],
    canceledDetails: [],
    completedDetails: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/paycut`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.data) {
          setPayCutData({
            totalPendingPayCut: data.data.totalPendingPayCut,
            totalCanceledPayCut: data.data.totalCanceledPayCut,
            totalCompletedPayCut: data.data.totalCompletedPayCut,
            pendingDetails:
              data.data.payCuts.find((item) => item._id === "pending")
                ?.details || [],
            canceledDetails:
              data.data.payCuts.find((item) => item._id === "canceled")
                ?.details || [],
            completedDetails:
              data.data.payCuts.find((item) => item._id === "completed")
                ?.details || [],
          });
        }

      })
      .catch((error) => console.error("Error fetching pay cut data:", error))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { name: "Pending", value: payCutData.totalPendingPayCut, color: "#FFCC80" },
    { name: "Canceled", value: payCutData.totalCanceledPayCut, color: "#EF5350" },
    { name: "Completed", value: payCutData.totalCompletedPayCut, color: "#66BB6A" },
  ];

  // Calculate total and percentages
  const totalPayCuts =
    payCutData.totalPendingPayCut +
    payCutData.totalCanceledPayCut +
    payCutData.totalCompletedPayCut;

  // Create data for trending chart (mockup data since we don't have time series)
  const trendData = [
    { name: "Jan", pending: 45, canceled: 12, completed: 65 },
    { name: "Feb", pending: 38, canceled: 15, completed: 72 },
    { name: "Mar", pending: 52, canceled: 8, completed: 80 },
    { name: "Apr", pending: 40, canceled: 10, completed: 90 },
    { name: "May", pending: payCutData.totalPendingPayCut, canceled: payCutData.totalCanceledPayCut, completed: payCutData.totalCompletedPayCut },
  ];

  const renderTable = (details) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pay Cut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seller</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {details.length > 0 ? (
              details.map((item) => (
                <tr key={item._id} className="hover:bg-gray-800 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">{item.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.payCut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.sellerDetails?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                        item.status === "canceled" ? "bg-red-500/10 text-red-400" :
                          "bg-green-500/10 text-green-400"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "pending":
        return renderTable(payCutData.pendingDetails);
      case "canceled":
        return renderTable(payCutData.canceledDetails);
      case "completed":
        return renderTable(payCutData.completedDetails);
      default:
        return renderTable(payCutData.pendingDetails);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 border border-gray-700 shadow-lg rounded-md">
          <p className="font-semibold text-white">{`${payload[0].name} : ${payload[0].value}`}</p>
          <p className="text-sm text-gray-400">{`${((payload[0].value / totalPayCuts) * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 bg-gray-800" />
          <Skeleton className="h-4 w-32 bg-gray-800" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
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
          {[1, 2].map((i) => (
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
    <div className="p-6 space-y-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Sales & Pay Cuts</h2>
        <div className="flex space-x-2">
          <span className="text-sm font-medium text-gray-400">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-200">
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending Pay Cuts</p>
                <h3 className="text-3xl font-bold text-white mt-1">{payCutData.totalPendingPayCut}</h3>
                <p className="text-sm mt-1 text-gray-400">Awaiting processing</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <FaHourglassHalf className="text-yellow-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-200">
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-400">Canceled Pay Cuts</p>
                <h3 className="text-3xl font-bold text-white mt-1">{payCutData.totalCanceledPayCut}</h3>
                <p className="text-sm mt-1 text-gray-400">Rejected transactions</p>
              </div>
              <div className="bg-red-500/10 p-3 rounded-full">
                <FaTimes className="text-red-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-200">
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed Pay Cuts</p>
                <h3 className="text-3xl font-bold text-white mt-1">{payCutData.totalCompletedPayCut}</h3>
                <p className="text-sm mt-1 text-gray-400">Successfully processed</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <FaCheckCircle className="text-green-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Pay Cuts Distribution</h3>
              <div className="bg-indigo-500/10 p-2 rounded-full">
                <FaChartPie className="text-indigo-400" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Monthly Trends</h3>
              <div className="bg-indigo-500/10 p-2 rounded-full">
                <FaChartBar className="text-indigo-400" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#F3F4F6' }} />
                <Area type="monotone" dataKey="completed" stroke="#66BB6A" fill="#66BB6A" fillOpacity={0.2} />
                <Area type="monotone" dataKey="pending" stroke="#FFCC80" fill="#FFCC80" fillOpacity={0.2} />
                <Area type="monotone" dataKey="canceled" stroke="#EF5350" fill="#EF5350" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Pay Cuts Details</h3>
            <div className="bg-indigo-500/10 p-2 rounded-full">
              <FaMoneyBillWave className="text-indigo-400" />
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`py-4 px-1 ${activeTab === "pending"
                    ? "border-b-2 border-yellow-400 text-yellow-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-600"
                    } font-medium text-sm transition-colors duration-200`}
                >
                  Pending ({payCutData.pendingDetails.length})
                </button>
                <button
                  onClick={() => setActiveTab("canceled")}
                  className={`py-4 px-1 ${activeTab === "canceled"
                    ? "border-b-2 border-red-400 text-red-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-600"
                    } font-medium text-sm transition-colors duration-200`}
                >
                  Canceled ({payCutData.canceledDetails.length})
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`py-4 px-1 ${activeTab === "completed"
                    ? "border-b-2 border-green-400 text-green-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-600"
                    } font-medium text-sm transition-colors duration-200`}
                >
                  Completed ({payCutData.completedDetails.length})
                </button>
              </nav>
            </div>
          </div>

          {getTabContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSales;
