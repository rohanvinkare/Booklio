import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, ChevronRight, Loader, Clock } from "lucide-react";

const RecentOrders = ({ orders, loading, onOrderClick, onViewAll }) => {
    const recentOrders = orders.slice(-3);

    return (
        <Card className="bg-[#060606] border-blue-950 mt-6">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                    <Button
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        onClick={onViewAll}
                    >
                        View All <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader className="animate-spin text-gray-400" size={32} />
                    </div>
                ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <motion.div
                                key={order.orderId}
                                initial={{ opacity: 0, translateY: 10 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card
                                    className="bg-[#060606] border-gray-600 hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={() => onOrderClick(order)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-blue-500/10 p-3 rounded-full">
                                                    <Package className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-white font-semibold">
                                                            {order.seller.storeName}
                                                        </h4>
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full font-semibold capitalize
                                ${order.status === "completed"
                                                                    ? "bg-green-500/10 text-green-400"
                                                                    : order.status === "pending"
                                                                        ? "bg-yellow-500/10 text-yellow-400"
                                                                        : order.status === "cancelled"
                                                                            ? "bg-red-500/10 text-red-400"
                                                                            : order.status === "placed"
                                                                                ? "bg-blue-500/10 text-blue-400"
                                                                                : "bg-gray-500/10 text-gray-300"
                                                                }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-emerald-400/90 mt-1 font-medium">
                                                        <span className="text-gray-300">Book Title:</span>{" "}
                                                        {order.bookInfo?.data?.volumeInfo?.title || "N/A"}
                                                    </p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        Delivered to: {order.shippingAddress?.city}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-end justify-between sm:flex-col sm:items-end gap-2">
                                                <p className="text-green-500 font-semibold">₹{order.price}</p>
                                                <p className="text-sm text-gray-400">
                                                    <Clock className="w-4 h-4 inline mr-1 text-white/80" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No orders found</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentOrders;