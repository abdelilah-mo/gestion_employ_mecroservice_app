import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ token, isReady }) {
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-secondary mb-0">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
