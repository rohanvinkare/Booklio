import { useSelector, useDispatch } from "react-redux";
import { profileData } from "@/store/user/profile";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/userDashboard/navbar";
import { Footer } from "@/components/landingPage/Footer";

const UserLayout = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userProfile?.profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userData) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (result.success) {
          dispatch(profileData(result.data));
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#060606] text-white">
      {userData && <Navbar userData={userData} />}
      <div className="flex-1 p-6">
        <Outlet context={userData || {}} />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
