import { useSelector, useDispatch } from "react-redux";
import { profileData } from "@/store/user/profile";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/userDashboard/navbar";
import { Footer } from "@/components/landingPage/Footer";

const UserLayout = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userProfile?.profile);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userData) return;

      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
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
      }
    };

    fetchUserData();
  }, [dispatch, userData]);

  return (
    <div
      className="flex flex-col min-h-screen text-white"
      style={{
        background: `radial-gradient(circle at center, rgba(13,11,30,0.7) 0%, rgba(0,0,0,0.9) 65%, #000000 100%)`,
      }}
    >
      {userData && <Navbar userData={userData} />}

      <div className="flex-1 p-6">
        <Outlet context={userData || {}} />
      </div>

      <Footer />
    </div>
  );
};

export default UserLayout;
