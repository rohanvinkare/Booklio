import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const GenreChart = ({ genreCounts }) => {
    return (
        <Card className="bg-transparent border-none shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-sky-400">Genre Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                <Bar
                    data={{
                        labels: Object.keys(genreCounts),
                        datasets: [
                            {
                                label: "Books by Genre",
                                data: Object.values(genreCounts),
                                backgroundColor: "rgba(255, 107, 74, 0.6)",
                                borderColor: "#FF6B4A",
                                borderWidth: 1,
                            },
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
                                ticks: { color: "#ffffff" },
                                grid: { color: "rgba(255, 255, 255, 0.1)" },
                            },
                            y: {
                                ticks: { color: "#ffffff" },
                                grid: { color: "rgba(255, 255, 255, 0.1)" },
                            },
                        },
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default GenreChart;