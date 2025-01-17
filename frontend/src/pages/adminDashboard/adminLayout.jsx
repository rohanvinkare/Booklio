import Sidebar from "@/components/adminDashboard/Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io"; // Import an icon for the dropdown indicator
import { FaSignOutAlt } from "react-icons/fa";

const AdminLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state
  const dropdownButtonRef = useRef(null); // Ref for the profile button
  const dropdownMenuRef = useRef(null); // Ref for the dropdown menu
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility

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

    // Add event listener
    document.addEventListener("click", handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken"); // Get access token from localStorage

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md px-10 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-grotesque font-semibold">Booklio</h1>
          <div className="flex items-center space-x-4 relative">
            {/* Profile Button */}
            <button
              ref={dropdownButtonRef} // Attach the ref to the button
              className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
              onClick={toggleDropdown}
            >
              R
              <IoMdArrowDropdown />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownMenuRef} // Attach the ref to the dropdown menu
                className="absolute right-0 -mt-2 w-80 bg-blue-50 shadow-lg rounded-lg border border-gray-200 z-10"
                style={{
                  top: dropdownButtonRef.current?.getBoundingClientRect().bottom + window.scrollY,
                }}
              >
                <div className="p-4">
                  <h3 className="font-semibold text-lg">Admin Account</h3>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Name:</span> Rohan Vinkare</p>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Email:</span> rohanvinkare2022@gmail.com</p>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Role:</span> Admin</p>
                </div>
                <div className="border-t hover:bg-red-600 border-gray-700">
                  <a
                    onClick={handleLogout} // Call handleLogout on button click
                    className="flex justify-center cursor-pointer items-center p-2 text-sm font-medium rounded-xl hover:text-white transition"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="ml-3">Logout</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
