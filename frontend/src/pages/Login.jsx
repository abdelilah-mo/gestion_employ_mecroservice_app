import { useState } from "react";
import { login } from "../services/api";

export default function Login({ setToken }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

async function handleLogin() {
const data = await login(email, password);

if (data.token) {
  localStorage.setItem("token", data.token);
  setToken(data.token);
} else {
  alert("Login failed");
}

}

return (
<div style={{ padding: 20 }}> <h2>Login</h2>

  <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
  <br /><br />

  <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
  <br /><br />

  <button onClick={handleLogin}>Login</button>
</div>

);
}
