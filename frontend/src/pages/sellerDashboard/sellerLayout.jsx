import Sidebar from "@/components/sellerDashboard/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaSignOutAlt, FaBell } from "react-icons/fa";

const SellerLayout = () => {
  const [sellerData, setSellerData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Fetch seller data on component mount
  useEffect(() => {
    const fetchSellerData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/auth/seller/login");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/seller/api/v1/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSellerData(data.data);
        } else if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          navigate("/auth/seller/login");
        } else {
          throw new Error("Failed to fetch seller data");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setError("Unable to fetch seller data. Please try again later.");
      }
    };

    fetchSellerData();
  }, [navigate]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/seller/login");
  };

  if (error) return <div className="text-red-500">{error}</div>;
  // if (!sellerData) return <div className="flex items-center justify-center h-screen text-white bg-[#1E1E1E]">Loading...</div>;

  return (
    <div className="flex h-screen bg-gradient-to-b from-black via-[#0d0b1e] to-black text-white relative">
      <Sidebar />

      <div className="flex-grow flex flex-col"> {/* ✅ no overflow-hidden here */}
        {/* Header */}
        <header className="relative z-50 px-6 py-4 flex justify-between items-center border-b border-gray-700/60 bg-black/20 backdrop-blur-md shadow-sm">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-white tracking-wide">Seller Dashboard</h1>
            <div className="ml-4 text-sm text-gray-400">
              <span className="text-lg font-medium capitalize">{sellerData?.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:ring-2 hover:ring-purple-500 transition">
              <FaBell size={18} className="text-white" />
            </button>

            <div className="relative">
              <button
                ref={dropdownButtonRef}
                className="flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-md">
                  {sellerData?.name?.charAt(0).toUpperCase()}
                </div>
                <IoMdArrowDropdown className="text-white" />
              </button>

              {/* ✅ Dropdown is absolutely positioned within header */}
              {isDropdownOpen && (
                <div
                  ref={dropdownMenuRef}
                  className="absolute right-0 top-12 w-56 bg-black/80 backdrop-blur-lg rounded-lg border border-gray-700 shadow-xl z-[9999]"
                >
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-semibold text-green-500">{sellerData?.name}</h3>
                    <p className="text-xs text-gray-400">{sellerData?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full p-2 text-sm text-red-600 font-bold hover:text-white rounded-md hover:bg-red-600 transition"
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet context={{ sellerData }} />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;