import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const BookSalesChart = ({ bookStats }) => {
  return (
    <Card className="bg-transparent border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Book Sales Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Bar
          data={{
            labels: bookStats.map(book => book.title),
            datasets: [
              {
                label: "Copies Sold",
                data: bookStats.map(book => book.copiesSold),
                backgroundColor: "rgba(74, 144, 226, 0.6)",
                borderColor: "#4A90E2",
                borderWidth: 1,
              },
              {
                label: "Revenue (₹)",
                data: bookStats.map(book => book.totalRevenue),
                backgroundColor: "rgba(255, 107, 74, 0.6)",
                borderColor: "#FF6B4A",
                borderWidth: 1,
              }
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#ffffff",
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#ffffff",
                  maxRotation: 45,
                  minRotation: 45
                },
                grid: { color: "rgba(255, 255, 255, 0.1)" },
              },
              y: {
                ticks: { color: "#ffffff", },
                grid: { color: "rgba(255, 255, 255, 0.1)" },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BookSalesChart;