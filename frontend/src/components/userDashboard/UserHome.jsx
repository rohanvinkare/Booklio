import { useOutletContext } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderData } from "@/store/user/order";

import ProfileCard from "@/components/userDashboard/ProfileCard";
import StatsSection from "@/components/userDashboard/StatsSection";
import RecentOrders from "@/components/userDashboard/RecentOrders";

// Lazy-load dialogs
const OrderDetailsDialog = lazy(() => import("@/components/userDashboard/OrderDetailsDialog"));
const AllOrdersDialog = lazy(() => import("@/components/userDashboard/AllOrdersDialog"));
const CancelOrderDialog = lazy(() => import("@/components/userDashboard/CancelOrderDialog"));

const UserHome = () => {
  const userData = useOutletContext();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.userOrder.value);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("No address provided. Add your address below.");
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
          const fetchedOrders = data.orderData[0]?.orders || [];
          dispatch(orderData(fetchedOrders));
          const firstOrderAddress = fetchedOrders[0]?.shippingAddress;
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

    if (userData.userId && orders.length === 0) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userData.userId, orders.length, dispatch]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
    if (showAllOrders) setShowAllOrders(false);
  };

  const handleCancelSuccess = (cancelledOrderId) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === cancelledOrderId
        ? { ...order, status: "cancelled" }
        : order
    );
    dispatch(orderData(updatedOrders));
    setSelectedOrder((prev) =>
      prev?.orderId === cancelledOrderId ? { ...prev, status: "cancelled" } : prev
    );
    setShowCancelConfirmation(false);
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-10 sm:px-6 md:px-10 bg-[#060606] text-white">
      <div className="max-w-screen-xl mx-auto space-y-8">
        {/* Grid Layout: Profile + Stats + Orders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Profile */}
          <ProfileCard userData={userData} address={address} />

          {/* Right: Stats + Recent Orders */}
          <div className="md:col-span-2 space-y-6">
            <StatsSection orders={orders} loading={loading} />
            <RecentOrders
              orders={orders}
              loading={loading}
              onOrderClick={handleOrderClick}
              onViewAll={() => setShowAllOrders(true)}
            />
          </div>
        </div>

        {/* Dialogs - wrapped in Suspense */}
        <Suspense fallback={null}>
          <OrderDetailsDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            order={selectedOrder}
            loading={loading}
            onCancel={() => setShowCancelConfirmation(true)}
          />
        </Suspense>

        <Suspense fallback={null}>
          <AllOrdersDialog
            isOpen={showAllOrders}
            onOpenChange={setShowAllOrders}
            orders={orders}
            loading={loading}
            onOrderClick={handleOrderClick}
          />
        </Suspense>

        <Suspense fallback={null}>
          <CancelOrderDialog
            isOpen={showCancelConfirmation}
            onOpenChange={setShowCancelConfirmation}
            orderId={selectedOrder?.orderId}
            onCancelSuccess={handleCancelSuccess}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default UserHome;
