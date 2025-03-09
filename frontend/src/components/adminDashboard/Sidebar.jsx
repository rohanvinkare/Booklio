import { NavLink } from "react-router-dom";
import { FaHome, FaBook, FaStore, FaSignOutAlt } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { PiUsersFill } from "react-icons/pi";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/admin" },
    { name: "Sales", icon: <FaStore />, path: "/admin/sales" },
    { name: "Books", icon: <FaBook />, path: "/admin/books" },
    { name: "Sellers", icon: <FaStore />, path: "/admin/sellers" },
    { name: "Management", icon: <MdManageAccounts />, path: "/admin/management" },
    { name: "Users", icon: <PiUsersFill />, path: "/admin/users" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 bg-gray-800 text-white h-screen shadow-lg"> 
      <div className="p-6 text-xl font-bold">Admin Dashboard</div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                    isActive
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
