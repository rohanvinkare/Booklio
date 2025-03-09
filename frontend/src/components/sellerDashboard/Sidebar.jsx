import { NavLink } from "react-router-dom";
import { FaHome, FaBook } from "react-icons/fa";
// import { MdManageAccounts } from "react-icons/md";
// import { PiUsersFill } from "react-icons/pi";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/seller" },
    { name: "Books", icon: <FaBook />, path: "/seller/books" },
    { name: "AddBook", icon: <FaBook />, path: "/seller/addbook" },
    { name: "Orders", icon: <FaBook />, path: "/seller/orders" },
    { name: "Account", icon: <FaBook />, path: "/seller/account" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 bg-gray-800 text-white h-screen shadow-lg">
      <div className="p-6 text-xl font-bold">Seller Dashboard</div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end // Use 'end' to match the exact path for root level paths
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${isActive
                    ? "bg-gray-700 text-white shadow-md"
                    : "hover:bg-gray-600 hover:text-gray-200"
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;