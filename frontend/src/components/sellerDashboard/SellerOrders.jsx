import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "../../store/sellerSlice";
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
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { sellerData } = useOutletContext();
  const sellerId = sellerData?.sellerId;

  const dispatch = useDispatch();

  // Get orders from Redux
  const { sellerOrders, loading, error } = useSelector((state) => state.seller);

  console.log(sellerOrders, "sellerOrders")

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerOrders(sellerId));
    }
  }, [sellerId, dispatch]);

  if (loading)
    return <div className="text-center p-6 text-lg">Loading orders...</div>;
  if (!sellerOrders || sellerOrders.length === 0)
    return <div className="text-center">No orders available.</div>;

  return (
    <div className="p-6 bg-[#232323] rounded-lg shadow-md">
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-700">
          <TableRow>
            <TableHead className="py-4 px-6 text-left">Order ID</TableHead>
            <TableHead className="py-4 px-6 text-left">ISBN</TableHead>
            <TableHead className="py-4 px-6 text-left">Total Price</TableHead>
            <TableHead className="py-4 px-6 text-left">Quantity</TableHead>
            <TableHead className="py-4 px-6 text-left">Status</TableHead>
            <TableHead className="py-4 px-6 text-left">Customer</TableHead>
            <TableHead className="py-4 px-6 text-left">Shipping Address</TableHead>
            <TableHead className="py-4 px-6 text-left">Order Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellerOrders.map((order) => (
            <TableRow
              key={order.orderId}
              className="hover:bg-gray-600 transition-colors cursor-pointer rounded-lg"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell className="py-3 px-6">{order.orderId}</TableCell>
              <TableCell className="py-3 px-6">{order.isbn}</TableCell>
              <TableCell className="py-3 px-6 font-semibold">
                ₹ {order.price}
              </TableCell>
              <TableCell className="py-3 px-6 font-semibold">
                {order.quantity}
              </TableCell>
              <TableCell className={`py-3 px-6 text-${order.status == "pending" ? "orange" : order.status == "shipped" ? "purple" : order.status == "delivered" ? "blue" : order.status == "cancelled" ? "red" : order.status == "completed" ? "green" : ""}-500 font-semibold`}>
                {order.status}
              </TableCell>
              <TableCell className="py-3 px-6">
                <div className="font-medium">{order.user.name}</div>
                <div className="text-sm text-white">{order.user.mobile}</div>
              </TableCell>
              <TableCell className="py-3 px-6 text-white">
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

      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-lg p-8 rounded-lg shadow-xl bg-[#232323] text-white">
            <DialogHeader>
              <div className="absolute z-10 -top-1 -left-2 bg-blue-500 text-white text-sm font-bold py-1 px-4 shadow-md before:z-5 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:border-l-8 before:border-l-transparent before:border-t-8 before:border-t-blue-700">
                {selectedOrder.status}
              </div>
              <DialogTitle className="text-3xl font-bold mb-4">
                Order Details
              </DialogTitle>
              <p>
                <strong className="text-gray-100 text-sm">Details for Order ID:</strong>{" "}
                {selectedOrder.orderId}
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong className="text-gray-100">ISBN:</strong>{" "}
                {selectedOrder.isbn}
              </p>
              <p>
                <strong className="text-gray-100">Book:</strong>{" "}
                {selectedOrder.bookInfo.data.volumeInfo.title || "N/A"}
              </p>
              <p>
                <strong className="text-gray-100">Customer:</strong>{" "}
                {selectedOrder.user.name}
              </p>
              <p>
                <strong className="text-gray-100">Mobile:</strong>{" "}
                {selectedOrder.user.mobile}
              </p>
              <p>
                <strong className="text-orange-500">Price of one book:</strong>{" "}
                <span className="text-orange-500 font-semibold">
                  ₹ {(selectedOrder.price) / selectedOrder.quantity}
                </span>
              </p>
              <p>
                <strong className="text-purple-400">Quantity:</strong>{" "}
                <span className="text-purple-400 font-semibold">
                  x{selectedOrder.quantity}
                </span>
              </p>
              <p>
                <strong className="text-green-500">Payable Amount:</strong>{" "}
                <span className="text-green-500 font-semibold">
                  ₹ {selectedOrder.price}
                </span>
              </p>
              <p>
                <strong className="text-gray-100">Shipping Address:</strong>
                <br />
                {selectedOrder.shippingAddress.street},{" "}
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state},{" "}
                {selectedOrder.shippingAddress.zipCode}
              </p>
              <p>
                <strong className="text-gray-100">Order Date:</strong>{" "}
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
