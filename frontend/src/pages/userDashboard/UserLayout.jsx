import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/userDashboard/navbar"; // Adjust the path as needed
import { Footer } from "@/components/landingPage/Footer";

const UserLayout = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/api/v1/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar userData={userData} />
      <div className="flex-1 p-6">
        <Outlet context={userData} />
      </div>
    <Footer/>
    </div>
  );
};

export default UserLayout;
