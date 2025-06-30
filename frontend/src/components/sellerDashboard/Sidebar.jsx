import { NavLink, Link } from "react-router-dom";
import { FaHome, FaBook, FaUser, FaSignOutAlt, FaPlusCircle } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import GradientText from "@/components/ui/GradientText";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <FaHome size={18} />, path: "/seller" },
    { name: "Add Book", icon: <FaPlusCircle size={18} />, path: "/seller/add-book" },
    { name: "Books", icon: <FaBook size={18} />, path: "/seller/books" },
    { name: "Orders", icon: <IoReceiptOutline size={18} />, path: "/seller/orders" },
  ];

  return (
    <aside className="w-56 bg-transparent text-white h-screen flex flex-col">
      <div className="p-6">
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

      </div>

      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 mx-2 text-sm font-medium rounded-lg transition ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-300 hover:bg-[#5a5a5a]"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/seller/account"
          className={({ isActive }) =>
            `flex items-center px-5 py-3 text-sm font-medium rounded-lg transition backdrop-blur-md ${isActive
              ? "bg-gradient-to-r from-[#0070F3] to-[#7928CA] text-white shadow-[0_0_12px_rgba(121,40,202,0.4)]"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <FaUser size={18} className="mr-3" />
          <span>Profile</span>
        </NavLink>

        <button
          className="flex items-center w-full px-5 py-3 mt-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-600/30 hover:text-white transition backdrop-blur-md"
          onClick={() => {
            localStorage.removeItem("accessToken");
            window.location.href = "/auth/seller/login";
          }}
        >
          <FaSignOutAlt size={18} className="mr-3" />
          <span>Log Out</span>
        </button>
      </div>



    </aside>
  );
};

export default Sidebar;