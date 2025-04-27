import Sidebar from "@/components/adminDashboard/Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaSignOutAlt, FaUserCircle, FaRegEnvelope, FaUserShield } from "react-icons/fa";

const AdminLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/management/api/v1/management/logout-member`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          window.location.href = "/auth/admin/login";
        } else {
          console.error("Logout failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    } else {
      console.log("No access token found");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-unbounded font-bold text-indigo-600">Booklio</h1>
            <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">Admin</span>
          </div>
          
          <div className="flex items-center space-x-4 relative">
            {/* Notifications icon could go here */}
            
            {/* Profile Button with better styling */}
            <button
              ref={dropdownButtonRef}
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                R
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:inline">Rohan</span>
              <IoMdArrowDropdown className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownMenuRef}
                className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                style={{
                  top: "100%",
                }}
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-medium">
                      R
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Rohan Vinkare</h3>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">Admin</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUserCircle className="mr-2 text-gray-500" />
                      <span>Rohan Vinkare</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaRegEnvelope className="mr-2 text-gray-500" />
                      <span>rohanvinkare2022@gmail.com</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUserShield className="mr-2 text-gray-500" />
                      <span>Administrator</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center p-3 text-sm text-left rounded-md transition-colors hover:bg-red-50 text-gray-700 hover:text-red-700"
                  >
                    <FaSignOutAlt className="mr-3 text-gray-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow p-8 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;