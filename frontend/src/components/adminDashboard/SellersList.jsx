import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // ShadCN card components
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { MdDeleteForever } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaBook, FaRupeeSign, FaChartLine, FaUser, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import toast from "react-hot-toast"; // Import React Hot Toast
import { useNavigate } from "react-router-dom";


// Helper function to generate random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const capitalize = (word) => {
  return word?.toUpperCase();
};

const SellersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const members = useSelector((state) => state.adminSellersData.value);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerStats, setSellerStats] = useState({});
  const [sellerOrders, setSellerOrders] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-seller-data/`
        );
        const data = await response.json();

        if (data.success && data.sellerData) {
          const allMembers = data.sellerData || [];
          dispatch(sellersData(allMembers)); // Dispatch member data to Redux
        } else {
          console.error("Unexpected API response structure or error");
          dispatch(sellersData([])); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        dispatch(sellersData([])); // Fallback to empty array
      }
    };

    fetchMembers();
  }, [dispatch]);

  // Fetch orders for all sellers
  const fetchAllSellerOrders = async () => {
    try {
      const ordersPromises = members.map(seller =>
        fetch(`${import.meta.env.VITE_BASE_URL}/order/seller-order-list/${seller.sellerId}`)
          .then(res => res.json())
          .then(data => ({
            sellerId: seller.sellerId,
            orders: data.success ? data.data[0]?.orders || [] : []
          }))
      );

      const ordersResults = await Promise.all(ordersPromises);
      const ordersMap = ordersResults.reduce((acc, { sellerId, orders }) => {
        acc[sellerId] = orders;
        return acc;
      }, {});
      setSellerOrders(ordersMap);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    }
  };

  // Calculate seller stats
  const calculateSellerStats = () => {
    const stats = {};
    Object.entries(sellerOrders).forEach(([sellerId, orders]) => {
      const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
      const totalProfit = totalRevenue * 0.95; // 95% of revenue goes to seller (5% platform fee)
      const booksSold = orders.reduce((sum, order) => sum + order.quantity, 0);

      stats[sellerId] = {
        totalRevenue,
        totalProfit,
        booksSold,
        orders: orders.length
      };
    });
    setSellerStats(stats);
  };

  useEffect(() => {
    if (members.length > 0) {
      fetchAllSellerOrders();
    }
  }, [members]);

  useEffect(() => {
    if (Object.keys(sellerOrders).length > 0) {
      calculateSellerStats();
    }
  }, [sellerOrders]);

  const handleDelete = async (sellerId) => {
    try {
      const token = localStorage.getItem("accessToken"); // Get the token from localStorage
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/api/v1/delete-seller`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sellerId }), // Send the sellerId in the request body
        }
      );

      const data = await response.json();
      if (data.success) {
        // If the deletion was successful, re-fetch the seller data
        dispatch(
          sellersData(members.filter((member) => member._id !== sellerId))
        );
        console.log("Seller deleted successfully");
        toast.success("Seller deleted successfully!"); // Show success toast
      } else if (data.type === "cors") {
        navigate('/auth/admin/login')
      }
      else {
        console.error("Error deleting seller:", data.message || data.error);
        toast.error("Failed to delete seller.");
      }
    } catch (error) {
      console.error("Error occurred during delete:", error);
      toast.error("An error occurred while deleting.");
    }
  };

  const confirmDelete = (sellerId) => {
    toast(
      (t) => (
        <div className="flex flex-col text-black rounded-lg">
          <span className="text-gray-800 font-semibold text-lg mb-3">
            Are you sure you want to delete this seller?
          </span>
          <div className="flex justify-between space-x-4">
            <Button
              onClick={() => {
                handleDelete(sellerId);
                toast.dismiss(t.id); // Dismiss the toast after delete
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-black rounded-md hover:bg-red-700 transition-colors"
            >
              Yes, Delete
            </Button>
            <Button
              onClick={() => toast.dismiss(t.id)} // Dismiss the toast if cancel
              className="flex-1 px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keeps the toast visible until action is taken
        position: "top-center",
      }
    );
  };

  if (!members || members.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl text-gray-400">📚</div>
          <h3 className="text-xl font-semibold text-gray-300">No Sellers Found</h3>
          <p className="text-gray-400">Add some sellers to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {members.map((member, index) => {
        const {
          name,
          email,
          role,
          sellerId,
          mobile,
          image,
          address,
          socialMediaLinks,
          storeName,
          storeDescription,
          upiId,
          gstNumber,
        } = member;
        const uniqueKey = member._id || index;
        const backgroundColor = getRandomColor();
        const firstLetter = name?.charAt(0).toUpperCase() || "U";

        return (
          <Dialog
            open={selectedSeller === uniqueKey}
            key={uniqueKey}
            onOpenChange={(open) => {
              if (open) {
                setSelectedSeller(uniqueKey);
              } else {
                setSelectedSeller(null);
              }
            }}
          >
            <Card className="bg-gray-800 border-gray-700 overflow-hidden w-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-700/50 hover:-translate-y-1">
              <DialogTrigger asChild>
                <div>
                  <CardHeader className="relative flex justify-center items-center p-4">
                    <Avatar
                      style={{ backgroundColor: backgroundColor }}
                      size="lg"
                      className="h-32 w-32 font-gloock flex items-center justify-center text-white text-5xl font-semibold ring-2 ring-gray-700"
                    >
                      {firstLetter}
                    </Avatar>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <h2 className="text-xl font-bold text-gray-100">{name}</h2>
                    <p className="text-sm font-semibold text-gray-300">
                      {capitalize(role)}
                    </p>
                    <p className="text-sm text-gray-400">{email}</p>
                    <span className="text-sm text-gray-400">
                      Mobile: <span className="text-gray-300">{mobile}</span>
                    </span>
                  </CardContent>
                </div>
              </DialogTrigger>
              <CardFooter className="bg-gray-700 p-0 flex justify-around items-center w-full h-12">
                <Button
                  className="hover:bg-red-600 hover:text-white transition-all duration-300 active:bg-red-500 w-full h-full text-gray-300 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(sellerId);
                  }}
                >
                  Delete <MdDeleteForever className="ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Dialog to show Seller Details */}
            <DialogContent className="max-w-4xl p-0 bg-gray-800 border-gray-700 rounded-xl shadow-lg h-[90vh] flex flex-col">
              {/* Main Content Area */}
              <div className="flex-1 min-h-0 flex flex-col">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Avatar and Stats */}
                      <div className="space-y-4">
                        {/* Avatar and Store Info */}
                        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                          <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3">
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
                              <Avatar
                                style={{ backgroundColor: backgroundColor }}
                                size="lg"
                                className="h-24 w-24 font-gloock flex items-center justify-center text-white text-3xl font-semibold ring-4 ring-gray-800 shadow-xl relative z-10"
                              >
                                {firstLetter}
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 ring-2 ring-gray-800 z-20">
                                <FaChartLine className="h-3 w-3 text-white" />
                              </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-100 mb-1">{storeName || "Unnamed Store"}</h2>
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {capitalize(role)}
                            </span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <FaBook className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Books Sold</p>
                                <p className="text-gray-100 font-medium text-lg">
                                  {sellerStats[sellerId]?.booksSold || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <FaRupeeSign className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Revenue</p>
                                <p className="text-gray-100 font-medium text-lg">
                                  ₹{sellerStats[sellerId]?.totalProfit?.toLocaleString() || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Social Media */}
                        {socialMediaLinks && (
                          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-gray-400 mb-3">Social Media</p>
                              <div className="flex space-x-4">
                                {socialMediaLinks.facebook && (
                                  <a
                                    href={socialMediaLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 transform hover:scale-110"
                                  >
                                    <FaFacebook className="h-6 w-6" />
                                  </a>
                                )}
                                {socialMediaLinks.instagram && (
                                  <a
                                    href={socialMediaLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-400 hover:text-pink-300 transition-colors duration-200 transform hover:scale-110"
                                  >
                                    <FaInstagram className="h-6 w-6" />
                                  </a>
                                )}
                                {socialMediaLinks.linkedin && (
                                  <a
                                    href={socialMediaLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 transform hover:scale-110"
                                  >
                                    <FaLinkedin className="h-6 w-6" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Details */}
                      <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <FaUser className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Seller Name</p>
                                <p className="text-gray-100 font-medium">{name}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <FaEnvelope className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-gray-100 font-medium">{email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <FaRupeeSign className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">UPI ID</p>
                                <p className="text-gray-100 font-medium">{upiId || "Not available"}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <FaBook className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">GST Number</p>
                                <p className="text-gray-100 font-medium">{gstNumber || "Not available"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Store Description */}
                        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                              <FaChartLine className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="text-gray-200 font-semibold mb-2">Store Description</h3>
                              <p className="text-gray-400 leading-relaxed">{storeDescription || "No description available."}</p>
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        {address && (
                          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <FaMapMarkerAlt className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <h3 className="text-gray-200 font-semibold mb-2">Address</h3>
                                <p className="text-gray-100 leading-relaxed">
                                  {address.street}, {address.city}, {address.state}, {address.country}, {address.zipCode}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800 p-4">
                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setSelectedSeller(null)}
                      className="px-5 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors rounded-xl"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(sellerId);
                        setSelectedSeller(null);
                      }}
                      className="px-5 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-xl"
                    >
                      Delete Seller
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
};

export default SellersList;
