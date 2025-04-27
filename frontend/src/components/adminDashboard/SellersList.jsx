import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // ShadCN card components
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { MdModeEditOutline } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
    return <div className="text-center p-8 text-xl">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {members.map((member, index) => {
        // Extract necessary fields from member
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

        // Generate a random background color for the avatar
        const backgroundColor = getRandomColor();

        // Get the first letter of the name
        const firstLetter = name?.charAt(0).toUpperCase() || "U";

        return (
          <Dialog
            open={selectedSeller === uniqueKey}
            key={uniqueKey}
            onOpenChange={(open) =>
              open ? setSelectedSeller(uniqueKey) : setSelectedSeller(null)
            }
          >
            <Card className="shadow-slate-500 rounded-xl overflow-hidden w-full md:w-72 bg-white hover:bg-slate-50 cursor-pointer">
              <DialogTrigger asChild>
                <div>
                  <CardHeader className="relative flex justify-center items-center p-4">
                    <Avatar
                      style={{ backgroundColor: backgroundColor }} // Apply the random background color
                      size="lg"
                      className="h-36 w-36 font-gloock flex items-center justify-center text-white text-6xl font-semibold"
                    >
                      {firstLetter}
                    </Avatar>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <h2 className="text-xl font-bold text-slate-800">{name}</h2>
                    <p className="text-sm font-semibold text-slate-600">
                      {capitalize(role)}
                    </p>
                    <p className="text-sm text-slate-600">{email}</p>
                    <span className="text-sm text-slate-600">
                      Mobile: <span className="text-slate-500">{mobile}</span>
                    </span>
                  </CardContent>
                </div>
              </DialogTrigger>
              <CardFooter className="bg-slate-300 p-0 flex justify-around items-center w-full h-12">
                <Button
                  className="hover:bg-red-600 hover:text-white transition active:bg-red-500 w-full group-hover:w-1/2 h-full"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dialog from closing when clicking delete button
                    confirmDelete(sellerId); // Show the confirmation toast
                  }}
                >
                  Delete <MdDeleteForever />
                </Button>
              </CardFooter>
            </Card>

            {/* Dialog to show Seller Details */}
            <DialogContent className="max-w-lg p-6 bg-white rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle>Seller Details</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="space-y-2">
                  <p>
                    <strong>Store:</strong> {storeName}
                  </p>
                  <p>
                    <strong>Description:</strong> {storeDescription}
                  </p>
                  <p>
                    <strong>UPI ID:</strong> {upiId}
                  </p>
                  <p>
                    <strong>GST Number:</strong> {gstNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {address?.street}, {address?.city}
                    , {address?.state}, {address?.country}, {address?.zipCode}
                  </p>
                  <div>
                    <strong>Social Media:</strong>
                    <ul className="space-y-1 mt-2">
                      <li>
                        <a
                          href={socialMediaLinks?.facebook}
                          target="_blank"
                          className="flex items-center text-blue-600 space-x-2"
                        >
                          <span>Facebook</span>
                          <FaFacebook />
                        </a>
                      </li>
                      <li>
                        <a
                          href={socialMediaLinks?.instagram}
                          target="_blank"
                          className="flex items-center text-pink-600 space-x-2"
                        >
                          <span>Instagram</span>
                          <FaInstagram />
                        </a>
                      </li>
                      <li>
                        <a
                          href={socialMediaLinks?.linkedin}
                          target="_blank"
                          className="flex items-center text-blue-800 space-x-2"
                        >
                          <span>LinkedIn</span>
                          <FaLinkedin />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </DialogDescription>
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  className="mr-4 rounded-xl bg-red-500 text-white"
                  onClick={() => setSelectedSeller(null)}
                >
                  Close <IoCloseCircle />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
};

export default SellersList;
