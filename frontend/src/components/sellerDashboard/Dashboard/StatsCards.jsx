import { Card, CardContent } from "@/components/ui/card";

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Title and Value */}
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>

              {/* Icon */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
              >
                <span className="text-xl text-white">{stat.icon}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
