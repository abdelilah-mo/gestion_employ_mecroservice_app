import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
const [token, setToken] = useState(localStorage.getItem("token"));

function logout() {
localStorage.removeItem("token");
setToken(null);
}

if (!token) {
return <Login setToken={setToken} />;
}

return <Dashboard logout={logout} />;
}

export default App;
