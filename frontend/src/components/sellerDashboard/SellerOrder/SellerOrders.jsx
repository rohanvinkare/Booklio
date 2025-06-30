import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "../../../store/sellerSlice";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const SellerOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { sellerData } = useOutletContext();
  const sellerId = sellerData?.sellerId;
  const dispatch = useDispatch();
  const { sellerOrders = [], loading, error } = useSelector(
    (state) => state.seller
  );

  useEffect(() => {
    if (sellerId && (!sellerOrders || sellerOrders.length === 0)) {
      dispatch(fetchSellerOrders(sellerId));
    }
  }, [sellerId, dispatch, sellerOrders]);


  const filteredOrders = sellerOrders.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      searchField === "all" || searchField === ""
        ? order.orderId.toLowerCase().includes(lowerSearch) ||
        order?.bookInfo?.title?.volumeInfo?.title?.toLowerCase().includes(lowerSearch) ||
        order?.user?.name?.toLowerCase().includes(lowerSearch)
        : searchField === "orderId"
          ? order.orderId.toLowerCase().includes(lowerSearch)
          : searchField === "title"
            ? order?.bookInfo?.volumeInfo?.title?.toLowerCase().includes(lowerSearch)
            : searchField === "customer"
              ? order?.user?.name?.toLowerCase().includes(lowerSearch)
              : false;



    const matchesStatus =
      statusFilter === "all" || statusFilter === ""
        ? true
        : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center p-6 text-lg">Loading orders...</div>;
  if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  if (!sellerOrders?.length)
    return <div className="text-center">No orders available.</div>;




  const getStatusBadge = (status) => {
    const baseClass =
      "px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block shadow-sm border";

    switch (status) {
      case "completed":
        return `${baseClass} bg-green-500/20 text-green-300 border-green-400/30`;
      case "cancelled":
        return `${baseClass} bg-red-500/20 text-red-300 border-red-400/30`;
      case "shipped":
        return `${baseClass} bg-blue-500/20 text-blue-300 border-blue-400/30`;
      case "pending":
        return `${baseClass} bg-yellow-500/20 text-yellow-300 border-yellow-400/30`;
      case "placed":
        return `${baseClass} bg-purple-500/20 text-purple-300 border-purple-400/30`;
      default:
        return `${baseClass} bg-gray-500/20 text-gray-300 border-gray-400/30`;
    }
  };


  return (
    <div className="p-6 bg-transparent rounded-lg shadow-md space-y-4">
      {/* Filter + Search Row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#1a1a1a] text-white placeholder:text-gray-400"
        />

        <div className="flex gap-4">
          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className="w-[160px] bg-[#1a1a1a] text-white">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] text-white">
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="orderId">Order ID</SelectItem>
              <SelectItem value="title">Book Title</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-[#1a1a1a] text-white">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] text-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-transparent font-bold text-white">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-yellow-400">Book Title</TableHead>
            <TableHead className="py-4 px-6 text-left text-green-400">Order ID</TableHead>
            <TableHead className="py-4 px-6 text-left text-violet-400">Customer</TableHead>
            <TableHead className="py-4 px-6 text-left text-orange-600">Quantity</TableHead>
            <TableHead className="py-4 px-6 text-left text-red-500">Price</TableHead>
            <TableHead className="py-4 px-6 text-left text-sky-500">Status</TableHead>
            <TableHead className="py-4 px-6 text-left text-lime-500">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow
              key={order.orderId}
              className="hover:bg-gray-600 transition-colors cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell className="py-3 px-6 font-semibold">
                {order?.bookInfo?.title?.volumeInfo?.title || "N/A"}
              </TableCell>
              <TableCell className="py-3 px-6">{order.orderId}</TableCell>
              <TableCell className="py-3 px-6">
                <div className="font-medium">{order.user.name}</div>
                <div className="text-sm text-white">{order.user.mobile}</div>
              </TableCell>
              <TableCell className="py-3 px-6">{order.quantity}</TableCell>
              <TableCell className="py-3 px-6 text-green-400 font-semibold">₹{order.price}</TableCell>
              <TableCell className="py-3 px-6">
                <span className={getStatusBadge(order.status)}>
                  {order.status}
                </span>
              </TableCell>

              <TableCell className="py-3 px-6">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent
            className="max-w-3xl bg-gradient-to-br from-black via-[#0d0b1e] to-black text-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-[#2a2a3f]"
          >
            <DialogHeader className="mb-6 border-b border-[#1f1c2e] pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10 text-[#38bdf8]" viewBox="0 0 26 26" fill="none">
                    <path d="M1 26V13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13C25 19.6274 19.6274 25 13 25H12" stroke="currentColor" strokeWidth="2" />
                    <path d="M5 26V13.16C5 8.65336 8.58172 5 13 5C17.4183 5 21 8.65336 21 13.16C21 17.6666 17.4183 21.32 13 21.32H12" stroke="currentColor" strokeWidth="2" />
                    <circle cx="13" cy="13.0214" r="5" fill="currentColor" />
                  </svg>
                  <div>
                    <h1 className="text-lg font-bold text-[#38bdf8]">Booklio</h1>
                    <p className="text-xs text-neutral-400">Your trusted book store</p>
                  </div>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <h2 className="text-xl font-bold text-lime-200">Invoice</h2>
                  <p className="text-sm text-neutral-400">
                    Order ID: <span className="font-semibold text-white break-all">{selectedOrder.orderId}</span>
                  </p>
                  <p className="text-sm text-white font-semibold">
                    Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="grid sm:grid-cols-2 gap-6 text-sm sm:text-base">
              {/* Shipping and Customer Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">Shipping Address</h3>
                  <p className="text-neutral-300 leading-6">
                    {selectedOrder.shippingAddress.street},<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Customer Details</h3>
                  <p className="text-neutral-300">
                    {selectedOrder.user.name}<br />
                    <span className="text-sm text-neutral-400">{selectedOrder.user.mobile}</span>
                  </p>
                </div>
              </div>

              {/* Book & Order Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">Book Ordered</h3>
                  <p className="text-yellow-300">{selectedOrder?.bookInfo?.title?.volumeInfo?.title || "N/A"}</p>
                  <p className="text-neutral-400 text-sm">ISBN: {selectedOrder.isbn}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p><strong className="text-purple-400">Quantity:</strong> x{selectedOrder.quantity}</p>
                  <p><strong className="text-orange-400">Price per book:</strong> ₹{(selectedOrder.price / selectedOrder.quantity).toFixed(2)}</p>
                  <p><strong className="text-green-400">Total Paid:</strong> ₹{selectedOrder.price}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#1f1c2e] pt-4 text-center sm:text-left">
              <h4 className="text-md sm:text-lg font-semibold text-white">Thank you for your order!</h4>
              <p className="text-sm text-neutral-400">Need help? Reach us at:</p>
              <p className="text-sm font-medium text-[#38bdf8]">support@booklio.in</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default SellerOrders;
