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
  if (!sellerData) return <div className="flex items-center justify-center h-screen text-white bg-[#1E1E1E]">Loading...</div>;

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      <Sidebar />

      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-[#232323] px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center">
            <h1 className="text-2xl font-medium text-white">Seller Dashboard</h1>
            <div className="flex items-center text-sm text-gray-400 ml-4">
              <span className="mx-1 text-lg capitalize">{sellerData.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <FaBell size={18} />
            </button>
            
            <div className="relative">
              <button
                ref={dropdownButtonRef}
                className="flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-sm font-medium">{sellerData.name.charAt(0).toUpperCase()}</span>
                </div>
                <IoMdArrowDropdown />
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownMenuRef}
                  className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-lg border border-gray-700 z-20"
                >
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="font-medium">{sellerData.name}</h3>
                    <p className="text-xs text-gray-400">{sellerData.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full p-2 text-sm rounded-md hover:bg-red-700 transition"
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

        <main className="flex-grow p-6 overflow-y-auto bg-[#1E1E1E]">
          <Outlet context={{ sellerData }} />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;