import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";
import { FaChartBar, FaChartPie, FaMoneyBillWave, FaTimes, FaHourglassHalf, FaCheckCircle } from "react-icons/fa";

const AdminSales = () => {
  const [payCutData, setPayCutData] = useState({
    totalPendingPayCut: 0,
    totalCanceledPayCut: 0,
    totalCompletedPayCut: 0,
    pendingDetails: [],
    canceledDetails: [],
    completedDetails: [],
  });

  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
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
      .catch((error) => console.error("Error fetching pay cut data:", error));
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Cut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {details.length > 0 ? (
              details.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.payCut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.sellerDetails?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        item.status === "canceled" ? "bg-red-100 text-red-800" :
                          "bg-green-100 text-green-800"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No data available</td>
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
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{`${payload[0].name} : ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">{`${((payload[0].value / totalPayCuts) * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sales & Pay Cuts</h2>
        <div className="flex space-x-2">
          <span className="text-sm font-medium text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Pay Cuts</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{payCutData.totalPendingPayCut}</h3>
                <p className="text-sm mt-1 text-gray-600">Awaiting processing</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaHourglassHalf className="text-yellow-500 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-red-400 to-red-500 h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Canceled Pay Cuts</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{payCutData.totalCanceledPayCut}</h3>
                <p className="text-sm mt-1 text-gray-600">Rejected transactions</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaTimes className="text-red-500 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-green-400 to-green-500 h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Pay Cuts</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{payCutData.totalCompletedPayCut}</h3>
                <p className="text-sm mt-1 text-gray-600">Successfully processed</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Pay Cuts Distribution</h3>
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaChartPie className="text-indigo-600" />
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
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Monthly Trends</h3>
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaChartBar className="text-indigo-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip />
                <Area type="monotone" dataKey="completed" stroke="#66BB6A" fill="#66BB6A" fillOpacity={0.3} />
                <Area type="monotone" dataKey="pending" stroke="#FFCC80" fill="#FFCC80" fillOpacity={0.3} />
                <Area type="monotone" dataKey="canceled" stroke="#EF5350" fill="#EF5350" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Pay Cuts Details</h3>
            <div className="bg-indigo-100 p-2 rounded-full">
              <FaMoneyBillWave className="text-indigo-600" />
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`py-4 px-1 ${activeTab === "pending"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } font-medium text-sm`}
                >
                  Pending ({payCutData.pendingDetails.length})
                </button>
                <button
                  onClick={() => setActiveTab("canceled")}
                  className={`py-4 px-1 ${activeTab === "canceled"
                    ? "border-b-2 border-red-500 text-red-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } font-medium text-sm`}
                >
                  Canceled ({payCutData.canceledDetails.length})
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`py-4 px-1 ${activeTab === "completed"
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } font-medium text-sm`}
                >
                  Completed ({payCutData.completedDetails.length})
                </button>
              </nav>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

export default AdminSales;
