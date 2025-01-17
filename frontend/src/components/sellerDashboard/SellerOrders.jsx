import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { sellerData } = useOutletContext();
  const sellerId = sellerData?.sellerId;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/order/seller-order-list/${sellerId}`
        );
        if (
          response.data.success &&
          Array.isArray(response.data.data[0]?.orders)
        ) {
          setOrders(response.data.data[0].orders);
        } else {
          setError("No Orders Available");
        }
      } catch (err) {
        setError("Error fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) fetchOrders();
  }, [sellerId]);

  if (loading)
    return <div className="text-center p-6 text-lg">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (orders.length === 0)
    return <div className="text-center">No orders available.</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Order List</h2>
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="py-4 px-6 text-left">Order ID</TableHead>
            <TableHead className="py-4 px-6 text-left">ISBN</TableHead>
            <TableHead className="py-4 px-6 text-left">Price (₹)</TableHead>
            <TableHead className="py-4 px-6 text-left">Status</TableHead>
            <TableHead className="py-4 px-6 text-left">Customer</TableHead>
            <TableHead className="py-4 px-6 text-left">
              Shipping Address
            </TableHead>
            <TableHead className="py-4 px-6 text-left">Order Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.orderId}
              className="hover:bg-gray-50 transition-colors cursor-pointer rounded-lg"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell className="py-3 px-6">{order.orderId}</TableCell>
              <TableCell className="py-3 px-6">{order.isbn}</TableCell>
              <TableCell className="py-3 px-6 font-semibold">
                {order.price}
              </TableCell>
              <TableCell
              className="py-3 px-6 text-green-500 font-semibold"
                // className={`py-3 px-6 capitalize ${
                //   order.status === "completed"
                //     ? "text-green-600"
                //     : "text-yellow-600"
                // }`}
              >
                {/* {order.status} */}
                Placed
              </TableCell>
              <TableCell className="py-3 px-6">
                <div className="font-medium">{order.user.name}</div>
                <div className="text-sm text-gray-500">{order.user.mobile}</div>
              </TableCell>
              <TableCell className="py-3 px-6 text-gray-700">
                {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}, {order.shippingAddress.zipCode}
              </TableCell>
              <TableCell className="py-3 px-6">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Enhanced Popup Dialog */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-lg p-8 rounded-lg shadow-xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold mb-4 text-gray-900">
                Order Details
              </DialogTitle>
              <DialogDescription className="text-gray-600 mb-6">
                Details for Order ID: <strong>{selectedOrder.orderId}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-gray-800">
              <p>
                <strong className="text-gray-600">ISBN:</strong>{" "}
                {selectedOrder.isbn}
              </p>
              <p>
                <strong className="text-gray-600">Price:</strong>{" "}
                <span className="text-lg font-semibold">
                  ₹{selectedOrder.price}
                </span>
              </p>
              <p>
                <strong className="text-gray-600">Status:</strong>{" "}
                <span
                  className="text-green-500 font-semibold"
                >Placed
                </span>
                {/* <span
                  className={`capitalize ${
                    selectedOrder.status === "completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {selectedOrder.status}
                </span> */}
              </p>
              <p>
                <strong className="text-gray-600">Customer:</strong>{" "}
                {selectedOrder.user.name}
              </p>
              <p>
                <strong className="text-gray-600">Mobile:</strong>{" "}
                {selectedOrder.user.mobile}
              </p>
              <p>
                <strong className="text-gray-600">Shipping Address:</strong>
                <br />
                {selectedOrder.shippingAddress.street},{" "}
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state},{" "}
                {selectedOrder.shippingAddress.zipCode}
              </p>
              <p>
                <strong className="text-gray-600">Order Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SellerOrders;
