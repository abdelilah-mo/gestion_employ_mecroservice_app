import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "./TopNavbar";

function AppLayout({ user, onLogout }) {
  return (
    <div className="d-flex app-shell">
      <Sidebar user={user} />

      <div className="content-wrap p-3 p-lg-4">
        <TopNavbar user={user} onLogout={onLogout} />

        <main className="container-fluid px-0 mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
