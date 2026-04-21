import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AppLayout from "./layout/AppLayout";
import Employees from "./pages/Employees";
import AddDepartment from "./pages/AddDepartment";
import AddEmployee from "./pages/AddEmployee";
import AddPosition from "./pages/AddPosition";
import AddUser from "./pages/AddUser";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersList from "./pages/UsersList";
import {
  clearSession,
  fetchCurrentUser,
  getStoredUser,
  getToken,
  setToken,
} from "./services/api";

function App() {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateUser() {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setAuthReady(true);
        }
        return;
      }

      if (isMounted) {
        setAuthReady(false);
      }

      try {
        const currentUser = await fetchCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
          setTokenState(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthReady(true);
        }
      }
    }

    hydrateUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  function handleLogin(nextToken) {
    setToken(nextToken);
    setTokenState(nextToken);
  }

  function handleLogout() {
    clearSession();
    setTokenState(null);
    setUser(null);
    setAuthReady(true);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLogin} />
        }
      />

      <Route element={<ProtectedRoute token={token} isReady={authReady} />}>
        <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="/employees" element={<Employees user={user} />} />

          <Route element={<RoleRoute user={user} allowedRoles={["admin"]} />}>
            <Route path="/employees/new" element={<AddEmployee />} />
            <Route path="/employees/:employeeId/edit" element={<AddEmployee />} />
            <Route path="/departments" element={<AddDepartment />} />
            <Route path="/positions" element={<AddPosition />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/new" element={<AddUser />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate replace to={token ? "/" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
