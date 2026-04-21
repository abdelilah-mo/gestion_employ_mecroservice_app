import { Link } from "react-router-dom";

function TopNavbar({ user, onLogout }) {
  const roleClass = user?.role === "admin" ? "badge-admin" : "badge-client";

  return (
    <nav className="navbar top-navbar px-4 py-3">
      <div className="container-fluid px-0">
        <div>
          <Link className="navbar-brand fw-bold text-dark mb-1" to="/">
            Employee Management System
          </Link>
          <div className="text-secondary small">
            Microservices frontend built with React, Vite and Bootstrap 5
          </div>
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
