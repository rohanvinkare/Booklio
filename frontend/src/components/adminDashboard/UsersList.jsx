import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { MdDeleteForever } from "react-icons/md";
import { FaEnvelope, FaPhone, FaUserCircle, FaCalendarAlt, FaMapMarkerAlt, FaBook, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import toast from "react-hot-toast";

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

const UsersList = () => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.adminUsersData.value);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-user-data/`);
      const data = await response.json();

      if (data.success && data.userData) {
        const allMembers = data.userData || [];
        dispatch(usersData(allMembers));
      } else {
        console.error("Unexpected API response structure or error");
        dispatch(usersData([]));
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      dispatch(usersData([]));
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [dispatch]);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/api/v1/delete-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        dispatch(usersData(members.filter((member) => member._id !== userId)));
        console.log("User deleted successfully");
        toast.success("User deleted successfully!");
        fetchMembers();
      } else {
        console.error("Error deleting user:", data.message || data.error);
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error occurred during delete:", error);
      toast.error("An error occurred while deleting.");
    }
  };

  const confirmDelete = (userId) => {
    toast(
      (t) => (
        <div className="flex flex-col rounded-lg bg-gray-800 p-4">
          <span className="text-gray-100 font-semibold text-lg mb-3">
            Are you sure you want to delete this user?
          </span>
          <div className="flex justify-between space-x-4">
            <Button
              onClick={() => {
                handleDelete(userId);
                toast.dismiss(t.id);
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Yes, Delete
            </Button>
            <Button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  if (!members || members.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl text-gray-400">👥</div>
          <h3 className="text-xl font-semibold text-gray-300">No Users Found</h3>
          <p className="text-gray-400">Add some users to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {members.map((member) => {
          const { name, email, role, mobile, image, userId } = member;
          const firstLetter = name?.charAt(0).toUpperCase() || "U";
          const backgroundColor = getRandomColor();

          return (
            <Card
              key={userId}
              className="group transition-transform duration-300 transform shadow-lg rounded-xl overflow-hidden w-full md:w-72 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:shadow-gray-700/50 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleUserClick(member)}
            >
              <CardHeader className="relative flex justify-center items-center p-4">
                <Avatar
                  src={image}
                  alt={image}
                  style={{ backgroundColor: backgroundColor }}
                  size="lg"
                  className="h-36 w-36 font-gloock flex items-center justify-center text-white text-6xl font-semibold ring-2 ring-gray-700"
                >
                  {firstLetter}
                </Avatar>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <h2 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors duration-200">{name}</h2>
                <div className="flex items-center text-sm text-gray-300">
                  <FaUserCircle className="h-4 w-4 mr-2 text-indigo-400" />
                  <span>{capitalize(role)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FaEnvelope className="h-4 w-4 mr-2 text-indigo-400" />
                  <span className="line-clamp-1">{email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FaPhone className="h-4 w-4 mr-2 text-indigo-400" />
                  <span>{mobile}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-700 p-0 flex justify-around items-center w-full h-12">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(userId);
                  }}
                  className="hover:bg-red-600 hover:text-white transition-all duration-300 active:bg-red-500 w-full h-full text-gray-300 hover:text-white"
                >
                  Delete <MdDeleteForever className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 p-0 overflow-hidden rounded-xl h-[85vh] flex flex-col">
          {selectedUser && (
            <div className="flex flex-col h-full">
              {/* Header with gradient background */}
              <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={selectedUser.image}
                      alt={selectedUser.image}
                      style={{ backgroundColor: getRandomColor() }}
                      size="lg"
                      className="h-16 w-16 font-gloock flex items-center justify-center text-white text-2xl font-semibold ring-4 ring-gray-800 shadow-xl"
                    >
                      {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                      <span className="inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                        {capitalize(selectedUser.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaBook className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Books Read</p>
                          <p className="text-sm text-gray-100 font-medium">{selectedUser.booksRead || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaShoppingCart className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Orders</p>
                          <p className="text-sm text-gray-100 font-medium">{selectedUser.orders?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaEnvelope className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm text-gray-100 font-medium truncate">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaPhone className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-sm text-gray-100 font-medium">{selectedUser.mobile}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaCalendarAlt className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Joined Date</p>
                          <p className="text-sm text-gray-100 font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaUserCircle className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Account Status</p>
                          <p className="text-sm text-gray-100 font-medium">{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  {selectedUser.address && (
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                      <h3 className="text-sm font-semibold text-gray-300 mb-3">Address Information</h3>
                      <div className="flex items-start space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaMapMarkerAlt className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Full Address</p>
                          <p className="text-sm text-gray-100 font-medium break-words">
                            {selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.state}, {selectedUser.address.country}, {selectedUser.address.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Information */}
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Activity</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaHeart className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Wishlist Items</p>
                          <p className="text-sm text-gray-100 font-medium">{selectedUser.wishlist?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                          <FaStar className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Reviews</p>
                          <p className="text-sm text-gray-100 font-medium">{selectedUser.reviews?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-700 bg-gray-800 flex-shrink-0">
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors rounded-lg text-sm"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      confirmDelete(selectedUser.userId);
                      setIsDialogOpen(false);
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg text-sm"
                  >
                    Delete User
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersList;
