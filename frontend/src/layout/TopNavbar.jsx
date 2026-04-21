import { useLocation } from "react-router-dom";

const titles = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of your employee management microservices.",
  },
  "/employees": {
    title: "Employees",
    subtitle: "View, create, update, and delete employee records.",
  },
  "/departments": {
    title: "Departments",
    subtitle: "Manage the departments used by employee records.",
  },
  "/positions": {
    title: "Positions",
    subtitle: "Manage the positions used by employee records.",
  },
  "/users": {
    title: "Users",
    subtitle: "Admin-only access to authentication service users.",
  },
  "/users/new": {
    title: "Add User",
    subtitle: "Create a new admin or client account.",
  },
};

function getPageInfo(pathname) {
  if (pathname.startsWith("/employees/new") || pathname.includes("/edit")) {
    return {
      title: "Employee Form",
      subtitle: "Create or update an employee profile.",
    };
  }

  return titles[pathname] || titles["/"];
}

function TopNavbar({ user, onLogout }) {
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);
  const roleClass = user?.role === "admin" ? "badge-admin" : "badge-client";

  return (
    <nav className="navbar top-navbar px-4 py-3">
      <div className="container-fluid px-0 align-items-start">
        <div>
          <p className="text-uppercase text-secondary fw-semibold small mb-2">
            Employee management system
          </p>
          <h2 className="h3 mb-1">{pageInfo.title}</h2>
          <div className="text-secondary small">{pageInfo.subtitle}</div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-md-block">
            <div className="fw-semibold">{user?.name}</div>
            <div className="small text-secondary">{user?.email}</div>
          </div>

          <span className={`badge rounded-pill ${roleClass} px-3 py-2`}>
            {user?.role || "user"}
          </span>

          <button className="btn btn-outline-dark" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;
