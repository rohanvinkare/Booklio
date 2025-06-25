import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, CheckCircle2, XCircle, Truck, IndianRupee } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";

const StatsSection = ({ orders, loading }) => {
  const statusTotals = orders.reduce((totals, order) => {
    const status = order.status.toLowerCase();
    if (!totals[status]) totals[status] = 0;
    totals[status] += order.price;
    return totals;
  }, {});

  const totalOrders = orders.length;
  const totalPending = statusTotals.pending || 0;
  const totalCompleted = statusTotals.completed || 0;
  const totalCancelled = statusTotals.cancelled || 0;
  const totalPlaced = statusTotals.placed || 0;

  return (
    <Card className="bg-[#060606] border-blue-950">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <Package className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {loading ? "..." : (
                  <NumberTicker
                    value={totalOrders}
                    className="whitespace-pre-wrap text-4xl font-medium tracking-tighter text-white"
                  />
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Clock className="w-10 h-10 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-1">
                {loading ? "..." : (
                  <>
                    <IndianRupee className="w-4 h-4 text-green-400 drop-shadow-[0_0_4px_#00ff88]" />
                    <NumberTicker
                      value={totalPending}
                      className="text-2xl font-medium tracking-tight text-white"
                    />
                  </>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-1">
                {loading ? "..." : (
                  <>
                    <IndianRupee className="w-4 h-4 text-green-400 drop-shadow-[0_0_4px_#00ff88]" />
                    <NumberTicker
                      value={totalCompleted}
                      className="text-2xl font-medium tracking-tight text-white"
                    />
                  </>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <XCircle className="w-10 h-10 text-red-500" />
            <div>
              <p className="text-sm text-gray-400">Cancelled</p>
              <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-1">
                {loading ? "..." : (
                  <>
                    <IndianRupee className="w-4 h-4 text-green-400 drop-shadow-[0_0_4px_#00ff88]" />
                    <NumberTicker
                      value={totalCancelled}
                      className="text-2xl font-medium tracking-tight text-white"
                    />
                  </>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Truck className="w-10 h-10 text-cyan-400" />
            <div>
              <p className="text-sm text-gray-400">Placed</p>
              <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-1">
                {loading ? "..." : (
                  <>
                    <IndianRupee className="w-4 h-4 text-green-400 drop-shadow-[0_0_4px_#00ff88]" />
                    <NumberTicker
                      value={totalPlaced}
                      className="text-2xl font-medium tracking-tight text-white"
                    />
                  </>
                )}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSection;