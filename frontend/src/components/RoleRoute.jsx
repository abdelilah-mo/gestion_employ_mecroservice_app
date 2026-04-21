import { Navigate, Outlet } from "react-router-dom";

function RoleRoute({ user, allowedRoles }) {
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
