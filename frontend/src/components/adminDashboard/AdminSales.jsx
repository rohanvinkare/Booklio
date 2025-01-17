import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card"; // Shadcn Card component
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Correct import for Recharts

const AdminSales = () => {
  const [payCutData, setPayCutData] = useState({
    totalPendingPayCut: 0,
    totalCanceledPayCut: 0,
    totalCompletedPayCut: 0,
    pendingDetails: [],
    canceledDetails: [],
    completedDetails: [],
  });

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
    { name: "Pending", value: payCutData.totalPendingPayCut },
    { name: "Canceled", value: payCutData.totalCanceledPayCut },
    { name: "Completed", value: payCutData.totalCompletedPayCut },
  ];

  const renderTable = (details) => {
    return (
      <table className="min-w-full border-collapse table-auto mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border text-left">Order ID</th>
            <th className="px-4 py-2 border text-left">Pay Cut</th>
            <th className="px-4 py-2 border text-left">Seller</th>
            <th className="px-4 py-2 border text-left">Status</th>
            <th className="px-4 py-2 border text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="px-4 py-2">{item.orderId}</td>
              <td className="px-4 py-2">{item.payCut}</td>
              <td className="px-4 py-2">
                {item.sellerDetails?.name || "Unknown"}
              </td>
              <td className="px-4 py-2">{item.status}</td>
              <td className="px-4 py-2">
                {new Date(item.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Numerical Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-700">
            Total Pending Pay Cuts
          </h3>
          <p className="text-2xl mt-2 text-gray-900">
            {payCutData.totalPendingPayCut}
          </p>
        </Card>

        <Card className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-700">
            Total Canceled Pay Cuts
          </h3>
          <p className="text-2xl mt-2 text-gray-900">
            {payCutData.totalCanceledPayCut}
          </p>
        </Card>

        <Card className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-700">
            Total Completed Pay Cuts
          </h3>
          <p className="text-2xl mt-2 text-gray-900">
            {payCutData.totalCompletedPayCut}
          </p>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Pay Cuts Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#4b5563" />
            <YAxis stroke="#4b5563" />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Pending Pay Cuts
        </h3>
        {renderTable(payCutData.pendingDetails)}

        <h3 className="text-xl font-bold mt-8 mb-4 text-gray-700">
          Canceled Pay Cuts
        </h3>
        {renderTable(payCutData.canceledDetails)}

        <h3 className="text-xl font-bold mt-8 mb-4 text-gray-700">
          Completed Pay Cuts
        </h3>
        {renderTable(payCutData.completedDetails)}
      </div>
    </div>
  );
};

export default AdminSales;
