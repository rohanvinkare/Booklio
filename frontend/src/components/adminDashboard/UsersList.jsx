import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersData } from "@/store/adminSlice/usersData";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { MdModeEditOutline } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast"; // Import toast library

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
  const members = useSelector((state) => state.adminUsersData.value); // Fetch members from Redux store

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-user-data/`);
      const data = await response.json();

      if (data.success && data.userData) {
        const allMembers = data.userData || [];
        dispatch(usersData(allMembers)); // Dispatch member data to Redux
      } else {
        console.error("Unexpected API response structure or error");
        dispatch(usersData([])); // Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      dispatch(usersData([])); // Fallback to empty array
    }
  };

  useEffect(() => {

    fetchMembers();
  }, [dispatch]);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken"); // Get the token from localStorage
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
          body: JSON.stringify({ userId }), // Send the userId in the request body
        }
      );


      const data = await response.json();
      if (data.success) {
        // If the deletion was successful, update the Redux store
        dispatch(usersData(members.filter((member) => member._id !== userId)));
        console.log("User deleted successfully");
        toast.success("User deleted successfully!"); // Show success toast
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
        <div className="flex flex-col p-4  rounded-lg shadow-lg border border-red-300">
          <span className="text-gray-800 font-semibold text-lg mb-3">
            Are you sure you want to delete this user?
          </span>
          <div className="flex justify-between space-x-4">
            <Button
              onClick={() => {
                handleDelete(userId);
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
      {members.map((member) => {
        const { name, email, role, mobile, image, userId } = member;
        const firstLetter = name?.charAt(0).toUpperCase() || "U";
        const backgroundColor = getRandomColor();

        return (
          <Card
            key={userId}
            className="transition-transform duration-300 transform shadow-slate-500 rounded-xl overflow-hidden w-full md:w-72 bg-white hover:bg-slate-50"
          >
            <CardHeader className="relative flex justify-center items-center p-4">
              <Avatar
                src={image}
                alt={image}
                style={{ backgroundColor: backgroundColor }}
                size="lg"
                className="h-36 w-36 font-gloock flex items-center justify-center text-white text-6xl font-semibold"
              >
                {firstLetter}
              </Avatar>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-bold text-slate-800">{name}</h2>
              <p className="text-sm font-semibold text-slate-600">{capitalize(role)}</p>
              <p className="text-sm text-slate-600">{email}</p>
              <span className="text-sm text-slate-600">
                Mobile: <span className="text-slate-500">{mobile}</span>
              </span>
            </CardContent>
            <CardFooter className="bg-slate-300 p-0 flex justify-around items-center w-full h-12">
              {/* <Button
                className="hover:bg-blue-600 hover:text-white transition active:bg-blue-500 w-full group-hover:w-1/2 h-full"
              >
                Edit <MdModeEditOutline />
              </Button> */}
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent unexpected behavior
                  confirmDelete(userId); // Show confirmation dialog
                }}
                className="hover:bg-red-600 hover:text-white transition active:bg-red-500 w-full group-hover:w-1/2 h-full"
              >
                Delete <MdDeleteForever />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default UsersList;
