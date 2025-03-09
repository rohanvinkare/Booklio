import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { managementsData } from "@/store/adminSlice/managementData";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"; // ShadCN card components
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { MdModeEditOutline } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

// Helper function to generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const capitalize = (word) => {
  return word?.toUpperCase();
};

const ManagementList = () => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.adminManagementsData.value);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-member-data/`);
        const data = await response.json();

        if (data.success && data.memberData) {
          const allMembers = data.memberData || [];
          dispatch(managementsData(allMembers)); // Dispatch member data to Redux
        } else {
          console.error("Unexpected API response structure or error");
          dispatch(managementsData([])); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        dispatch(managementsData([])); // Fallback to empty array
      }
    };

    fetchMembers();
  }, [dispatch]);

  if (!members || members.length === 0) {
    return <div className="text-center p-8 text-xl">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {members.map((member) => {
        // Extract necessary fields from member
        const { name, email, role, mobile } = member;
        const uniqueKey = member._id;

        // Generate a random background color for the avatar
        const backgroundColor = getRandomColor();

        // Get the first letter of the name
        const firstLetter = name?.charAt(0).toUpperCase() || 'U';

        return (
          <Card
            key={uniqueKey}
            className="transition-transform duration-300 transform shadow-slate-500 rounded-xl overflow-hidden w-full md:w-72 bg-white hover:bg-slate-50"
          >
            <CardHeader className="relative flex justify-center items-center p-4">
              <Avatar
                style={{ backgroundColor: backgroundColor }} // Apply the random background color
                size="lg"
                className="h-36 w-36 font-gloock flex items-center justify-center text-white text-6xl font-semibold"
              >
                {firstLetter} {/* Display the first letter of the name */}
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

            {/* {role === "admin" ? <p> </p>:
            <CardFooter className="bg-slate-300 p-0 flex justify-around items-center w-full h-12">
              <Button
                className="hover:bg-blue-600 hover:text-white transition active:bg-blue-500 w-full group-hover:w-1/2 h-full">
                Edit <MdModeEditOutline />
              </Button>
              <Button
                className="hover:bg-red-600 hover:text-white transition active:bg-red-500 w-full group-hover:w-1/2 h-full">
                Delete <MdDeleteForever />
              </Button>
            </CardFooter>
            } */}
          </Card>
        );
      })}
    </div>
  );
};

export default ManagementList;
