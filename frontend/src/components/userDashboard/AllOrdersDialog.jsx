import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Package, Loader, Clock } from "lucide-react";

const AllOrdersDialog = ({ isOpen, onOpenChange, orders, loading, onOrderClick }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.orderId.includes(searchTerm) ||
                order.bookInfo?.data?.volumeInfo?.title?.toLowerCase()?.includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto bg-[#060606] text-white border-blue-950 p-0 rounded-xl">
                <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">

                    {/* Dialog Header */}
                    <DialogHeader className="px-0 mb-4">
                        <DialogTitle className="text-2xl font-bold">All Orders</DialogTitle>
                    </DialogHeader>

                    {/* 🔒 Sticky Search & Filter */}
                    <div className="sticky top-0 z-10 bg-black border-b border-blue-950 pb-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="w-full sm:w-1/2">
                                <input
                                    type="text"
                                    className="w-full py-2 px-4 bg-[#0a0a0a] border border-blue-950 rounded-lg text-sm text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Search by title or order ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="w-full sm:w-auto bg-black">
                                <select
                                    className="py-2 px-4 bg-black border border-blue-950 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none  transition"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="placed">Placed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto w-full border border-blue-950 rounded-xl shadow-2xs">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader className="animate-spin text-gray-400" size={32} />
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            <table className="min-w-full divide-y divide-blue-950 text-sm">
                                <thead className="bg-[#0a0a0a] text-left">
                                    <tr>
                                        <th className="px-4 py-3 text-gray-400 uppercase font-semibold">Order Details</th>
                                        <th className="px-4 py-3 text-gray-400 uppercase font-semibold hidden sm:table-cell">Seller Info</th>
                                        <th className="px-4 py-3 text-gray-400 uppercase font-semibold hidden md:table-cell">Shipping</th>
                                        <th className="px-4 py-3 text-gray-400 uppercase font-semibold hidden md:table-cell">Date</th>
                                        <th className="px-4 py-3 text-gray-400 uppercase font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-950">
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order.orderId}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="hover:bg-blue-950/20 cursor-pointer"
                                            onClick={() => onOrderClick(order)}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-x-3">
                                                    <div className="bg-blue-500/10 p-2 rounded-full">
                                                        <Package className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">
                                                            {order.bookInfo?.data?.volumeInfo?.title || "N/A"}
                                                        </div>
                                                        <div className="text-gray-400 text-xs">#{order.orderId}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 hidden sm:table-cell">
                                                <div className="space-y-1">
                                                    <div className="font-semibold">{order.seller.storeName}</div>
                                                    <div className="text-gray-400 text-xs">{order.seller.name}</div>
                                                    <div className="text-gray-400 text-xs">{order.seller.mobile}</div>
                                                </div>
                                            </td>

                                            <td className="p-4 hidden md:table-cell">
                                                <div className="text-gray-400 text-sm">
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                                                </div>
                                                <div className="text-gray-400 text-xs">{order.shippingAddress?.pincode}</div>
                                            </td>

                                            <td className="p-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full
                            ${order.status === "completed"
                                                            ? "bg-green-500/10 text-green-400"
                                                            : order.status === "pending"
                                                                ? "bg-yellow-500/10 text-yellow-400"
                                                                : order.status === "cancelled"
                                                                    ? "bg-red-500/10 text-red-400"
                                                                    : "bg-blue-500/10 text-blue-400"
                                                        }`}
                                                >
                                                    {order.status}
                                                </div>
                                                <div className="text-white font-semibold text-sm mt-1">₹{order.price}</div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-center text-gray-400">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No orders found</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AllOrdersDialog;
