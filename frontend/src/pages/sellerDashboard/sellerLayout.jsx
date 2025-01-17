import Sidebar from "@/components/sellerDashboard/Sidebar";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";

const capitalize = (word) => {
  return word?.toUpperCase();
};

const SellerLayout = () => {
  const [sellerData, setSellerData] = useState(null); // State to store seller data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null); // State to handle errors
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Fetch seller data on component mount
  useEffect(() => {
    const fetchSellerData = async () => {
      const token = localStorage.getItem("accessToken"); // Get the token from local storage
      if (!token) {
        navigate("/auth/seller/login"); // Redirect if no token found
        return;
      }

      try {
        const response = await fetch(
          "http://192.168.114.202:3000/seller/api/v1/profile",
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
          setSellerData(data.data); // Save fetched data in state
        } else if (response.status === 401) {
          // Unauthorized, invalid token
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          navigate("/auth/seller/login"); // Redirect to login
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
    navigate("/auth/seller/login"); // Redirect to login page
  };

  if (error) return <div className="text-red-500">{error}</div>; // Display error message
  if (!sellerData) return <div>Loading...</div>; // Show loading state until data is fetched

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-grow flex flex-col">
        <header className="bg-white shadow-md px-10 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-grotesque font-semibold">Booklio</h1>
          <div className="flex items-center space-x-4 relative">
            {/* Profile Button */}
            <button
              ref={dropdownButtonRef}
              className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
              onClick={toggleDropdown}
            >
              {sellerData.name.charAt(0).toUpperCase()}
              <IoMdArrowDropdown />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownMenuRef}
                className="absolute z-20 right-0 -mt-2 w-60 bg-blue-50 shadow-lg rounded-lg border border-gray-200"
                style={{
                  top: dropdownButtonRef.current?.getBoundingClientRect().bottom + window.scrollY,
                }}
              >
                {/* Profile Info */}
                <div className="p-4">
                  <h3 className="font-grotesque font-semibold text-2xl">{capitalize(sellerData.name)}</h3>
                  <p className="text-sm text-slate-800"><span className="font-bold">Store:</span> {capitalize(sellerData.storeName)}</p>
                  <p className="text-sm text-slate-800"><span className="font-bold">Email:</span> {sellerData.email}</p>
                  <p className="text-sm text-slate-800">
                    <span className="font-bold"><span className="font-bold">Role:</span></span> {sellerData.role.charAt(0).toUpperCase() + sellerData.role.slice(1)}
                  </p>

                </div>

                {/* Logout Button */}
                <div className="border-t hover:bg-red-600 border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex justify-center items-center p-2 text-sm font-medium rounded-xl hover:text-white transition"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span onClick={handleLogout} className="ml-3">Logout</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </header>

        <main className="flex-grow p-6 bg-gray-100 overflow-y-auto">
          <Outlet context={{ sellerData }} />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;