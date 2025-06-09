import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ShieldX,
  Edit,
  CreditCard,
  Clock,
  ChevronRight,
  Loader
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-hot-toast";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { FlipText } from "@/components/magicui/flip-text";

const UserHome = () => {
  const userData = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(
    "No address provided. Add your address below."
  );
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/order/user-order-list/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setOrders(data.orderData[0]?.orders || []);
          const firstOrderAddress = data.orderData[0]?.orders[0]?.shippingAddress;
          if (firstOrderAddress) {
            setAddress(
              `${firstOrderAddress.street}, ${firstOrderAddress.city}, ${firstOrderAddress.state}, ${firstOrderAddress.country} - ${firstOrderAddress.zipCode}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData.userId) {
      fetchOrders();
    }
  }, [userData.userId]);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);

  const recentOrders = orders.slice(0, 3); // Get last 3 orders

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
    // Close the all orders dialog if it's open
    if (showAllOrders) {
      setShowAllOrders(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/order/api/v1/cancel-order/${selectedOrder?.orderId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Cancel order response:", data);

      if (response.ok && data.success) {
        toast.success("Order cancelled successfully!");

        // Update the order's status rather than removing it
        const updatedOrders = orders.map(order =>
          order.orderId === selectedOrder.orderId
            ? { ...order, status: "cancelled" }
            : order
        );

        setOrders(updatedOrders);
        setSelectedOrder({ ...selectedOrder, status: "cancelled" });
        setShowCancelConfirmation(false);
      } else {
        console.error("Error response:", data);
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="relative">
            <Card className="md:col-span-1 bg-[#060606]/80 border-blue-950/60 h-full">
              <CardContent className="p-6 m-3">

                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 border-4 border-blue-500 shadow-lg">
                    <AvatarImage src={userData.image} alt={userData.name} />
                    <AvatarFallback className="bg-blue-500 text-xl">
                      {userData.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-2xl font-bold text-white"> {userData.name}</h2>
                  <div className="mt-2 flex items-center">
                    {userData.is_verified ? (
                      <ShieldCheck className="w-5 h-5 text-green-400 mr-2" />
                    ) : (
                      <ShieldX className="w-5 h-5 text-red-400 mr-2" />
                    )}
                    <span className={`text-sm ${userData.is_verified ? "text-green-400" : "text-red-400"}`}>
                      {userData.is_verified ? "Verified Account" : "Not Verified"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-sm"> {userData.email}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-sm">{userData.mobile}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="text-sm">{address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <BorderBeam
              size={120}
              duration={8}
              colorFrom="#40ffaa"
              colorTo="#4079ff"
              className="rounded-xl"
            />
          </div>


          {/* Stats Cards */}
          <div className="md:col-span-2">
            <Card className="bg-[#060606] border-blue-950">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <Package className="w-12 h-12 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-400">Total Orders</p>
                      <h3 className="text-3xl font-bold text-white mt-1">
                        {loading ? "..." : (
                          <>
                            <NumberTicker
                              value={totalOrders}
                              className="whitespace-pre-wrap text-4xl font-medium tracking-tighter text-black dark:text-white"
                            />
                          </>
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CreditCard className="w-12 h-12 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-400">Total Spent</p>
                      <h3 className="text-3xl font-bold text-white mt-1">
                        {/* {loading ? "..." : `₹${totalSpent}`} */}
                        {loading ? "..." :
                          <>
                            <NumberTicker
                              value={totalSpent}
                              prefix="₹ "
                              className="whitespace-pre-wrap text-4xl font-medium tracking-tighter text-black dark:text-white"
                            />
                          </>
                        }
                      </h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders Section */}
            <Card className="bg-[#060606] border-blue-950 mt-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                  <Button
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    onClick={() => setShowAllOrders(true)}
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
                          onClick={() => handleOrderClick(order)}
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
                                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === "completed"
                                      ? "bg-green-500/10 text-green-400"
                                      : order.status === "cancelled"
                                        ? "bg-red-500/10 text-red-400"
                                        : "bg-blue-500/10 text-blue-400"
                                      }`}>
                                      {order.status === "pending" ? "Placed" : order.status}
                                    </span>
                                  </div>
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
          </div>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]  bg-[#060606] text-white border-blue-950">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2">
                Order Details
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Order ID: {selectedOrder?.orderId}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="text-white font-medium">Order Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${selectedOrder?.status === "completed"
                    ? "bg-green-500/10 text-green-400"
                    : selectedOrder?.status === "cancelled"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-blue-500/10 text-blue-400"
                    }`}>
                    {selectedOrder?.status === "pending" ? "Placed" : selectedOrder?.status}
                  </span>
                </div>

                {/* Book Details */}
                <div className="p-4 bg-[#060606] border-blue-950 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Book Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Title</p>
                      <p className="text-white">{selectedOrder?.bookInfo?.data?.volumeInfo?.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Author</p>
                      <p className="text-white">{selectedOrder?.bookInfo?.data?.volumeInfo?.authors}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">ISBN</p>
                      <p className="text-white">{selectedOrder?.isbn}</p>
                    </div>

                    <div className="flex flex-col items-start space-y-2">
                      <p className="text-gray-400">Quantity</p>
                      <div className="flex items-center space-x-2">
                        <img src="icons/stock.png" alt="Stock" className="w-7 h-7" />
                        <p className="text-green-500 text-xl font-bold">{selectedOrder?.quantity}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Shipping Details */}
                <div className="p-4 bg-[#060606] border-blue-950 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Shipping Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Street</p>
                      <p className="text-white">{selectedOrder?.shippingAddress?.street}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">City</p>
                      <p className="text-white">{selectedOrder?.shippingAddress?.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">State</p>
                      <p className="text-white">{selectedOrder?.shippingAddress?.state}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Country</p>
                      <p className="text-white">{selectedOrder?.shippingAddress?.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Zip Code</p>
                      <p className="text-white">{selectedOrder?.shippingAddress?.zipCode}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="p-4 bg-[#060606] rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex flex-col items-start space-y-1">
                      <p className="text-gray-400">Total Amount</p>
                      <div className="flex items-center space-x-2">
                        <img src="icons/rs.png" alt="rs" className="w-7 h-7" />
                        <p className="text-green-500 font-mono text-lg">₹{selectedOrder?.price}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400">Payment Status</p>
                      <p className="text-[#00ff88] ">Completed</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Order Date</p>
                      <p className="text-white">
                        {selectedOrder?.createdAt && new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedOrder?.status === "pending" && (
                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setShowCancelConfirmation(true)}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Cancel Order"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* All Orders Dialog */}
        <Dialog open={showAllOrders} onOpenChange={setShowAllOrders}>
          <DialogContent className="max-w-4xl max-h-[80vh] bg-[#060606] text-white border-blue-950">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">All Orders</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[60vh] pr-4 space-y-4 scrollbar-thin scrollbar-thumb-white scrollbar-track-black scrollbar-thumb-rounded-full scrollbar-track-rounded-full">

              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader className="animate-spin text-gray-400" size={32} />
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <motion.div
                    key={order.orderId}
                    initial={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      className="bg-[#060606] border-blue-950 hover:bg-gray-700/80 transition-colors cursor-pointer"
                      onClick={() => handleOrderClick(order)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-500/10 p-3 rounded-full">
                              <Package className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <h4 className="text-white font-semibold">
                                  {order.seller.storeName}
                                </h4>
                                <span className={`text-sm px-2 py-1 rounded-full ${order.status === "completed"
                                  ? "bg-green-500/10 text-green-400"
                                  : order.status === "cancelled"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-blue-500/10 text-blue-400"
                                  }`}>
                                  {order.status === "pending" ? "Placed" : order.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                Delivered to: {order.shippingAddress?.city}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-end justify-between sm:flex-col sm:items-end gap-2">
                            <p className="text-white font-semibold">₹{order.price}</p>
                            <p className="text-sm text-gray-400">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}
            </div>


          </DialogContent>
        </Dialog>


        {/* Cancel Order Confirmation Dialog */}
        <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
          <DialogContent className="max-w-md bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-2">
                Cancel Order
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to cancel this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-700"
                onClick={() => setShowCancelConfirmation(false)}
                disabled={loading}
              >
                No, Keep Order
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCancelOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Yes, Cancel Order"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserHome;