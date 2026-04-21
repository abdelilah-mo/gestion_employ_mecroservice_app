import { NavLink } from "react-router-dom";

function Sidebar({ user }) {
  const isAdmin = user?.role === "admin";

  const menu = isAdmin
    ? [
        { label: "Dashboard", to: "/" },
        { label: "Employees", to: "/employees" },
        { label: "Departments", to: "/departments" },
        { label: "Positions", to: "/positions" },
        { label: "Users", to: "/users" },
      ]
    : [
        { label: "Dashboard", to: "/" },
        { label: "Employees", to: "/employees" },
      ];

  return (
    <aside className="app-sidebar px-3 px-lg-4 py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="brand-mark">EM</div>
        <div>
          <h1 className="h5 mb-1 text-white">Employee Manager</h1>
          <p className="small text-white-50 mb-0">
            {isAdmin ? "Admin workspace" : "Client workspace"}
          </p>
        </div>
      </div>

      <div className="rounded-4 p-3 mb-4 sidebar-profile">
        <p className="small text-uppercase text-white-50 mb-2">Signed in as</p>
        <div className="fw-semibold text-white">{user?.name || "Authenticated user"}</div>
        <div className="small text-white-50">{user?.email || "user@example.com"}</div>
      </div>

      <nav className="nav flex-column gap-2 sidebar-nav">
        {menu.map((item) => (
          <NavLink key={item.to} className="nav-link" end={item.to === "/"} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
