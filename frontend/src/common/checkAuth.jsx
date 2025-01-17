import { Navigate, useLocation } from "react-router-dom";

const restrictedRoutes = {
  admin: ["/shop", "/seller"],
  user: ["/admin", "/seller"],
  seller: ["/admin", "/shop"],
};

function CheckAuth({ allowedRoles, children }) {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // If no token or role is found, redirect to login
  if (!token && !role) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const currentPath = location.pathname;

  // Check if the user's role is restricted from the current path
  if (restrictedRoutes[role]?.some((restrictedRoute) => currentPath.startsWith(restrictedRoute))) {
    return <Navigate to="/unauth-page" replace state={{ from: location }} />;
  }

  // Check if the user's role is allowed to access the component
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauth-page" replace state={{ from: location }} />;
  }

  // Render children if all checks pass
  return <>{children}</>;
}

export default CheckAuth;
