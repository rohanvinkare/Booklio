import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RevenueChart = ({ data, options }) => {
  return (
    <Card className="bg-transparent border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-sky-400">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default RevenueChart;