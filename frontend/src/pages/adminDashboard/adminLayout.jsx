import Sidebar from "@/components/adminDashboard/Sidebar";
import { Outlet,Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaSignOutAlt, FaUserCircle, FaRegEnvelope, FaUserShield, FaBell } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import GradientText from "@/components/ui/GradientText";

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

    if (!accessToken) {
      console.error("No access token found");
      window.location.href = "/auth/admin/login";
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/management/api/v1/management/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear all auth-related data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        // Close dropdown
        setIsDropdownOpen(false);

        // Redirect to login page
        window.location.href = "/auth/admin/login";
      } else {
        console.error("Logout failed:", data.message || "Unknown error");
        // Still clear local storage and redirect even if API call fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/auth/admin/login";
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Clear local storage and redirect even if there's an error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/auth/admin/login";
    }
  };

  return (
    // <div className="flex min-h-screen bg-gray-900">
      <div className="flex h-screen bg-gray-900 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:ml-64">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg px-8 py-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center space-x-2">

            {/* <h1 className="text-3xl font-unbounded font-bold text-indigo-400">Booklio</h1> */}

            <Link to="/">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={10}
                showBorder={false}
                className="font-unbounded text-4xl font-semibold"
              >
                Booklio
              </GradientText>
            </Link>


            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              Admin
            </Badge>
          </div>

          <div className="flex items-center space-x-4 relative">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700">
              <FaBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Button */}
            <button
              ref={dropdownButtonRef}
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">
                R
              </div>
              <span className="text-sm font-medium text-gray-200 hidden md:inline">Rohan</span>
              <IoMdArrowDropdown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownMenuRef}
                className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-10 overflow-hidden"
                style={{
                  top: "100%",
                }}
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-medium shadow-lg">
                      R
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Rohan Vinkare</h3>
                      <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mt-1">
                        Administrator
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-center text-sm text-gray-300 bg-gray-700/50 p-3 rounded-lg">
                      <FaUserCircle className="mr-3 text-indigo-400 h-4 w-4" />
                      <span>Rohan Vinkare</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300 bg-gray-700/50 p-3 rounded-lg">
                      <FaRegEnvelope className="mr-3 text-indigo-400 h-4 w-4" />
                      <span>rohanvinkare2022@gmail.com</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300 bg-gray-700/50 p-3 rounded-lg">
                      <FaUserShield className="mr-3 text-indigo-400 h-4 w-4" />
                      <span>Administrator</span>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center p-3 text-sm text-left rounded-lg transition-colors hover:bg-red-500/10 text-gray-300 hover:text-red-400 group"
                  >
                    <FaSignOutAlt className="mr-3 text-gray-500 group-hover:text-red-400 h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* <main className="flex-grow p-8 bg-gray-900 overflow-y-auto"> */}
        <main className="flex-grow p-8 bg-gray-900 overflow-y-auto h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;