import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser(form);
      onLoginSuccess(response.token);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-panel row g-0">
        <div className="col-lg-5 login-aside p-4 p-lg-5">
          <span className="badge rounded-pill text-bg-light mb-4">Employee platform</span>
          <h1 className="display-6 fw-bold mb-3">Manage people across your microservices.</h1>
          <p className="text-white-50 fs-6 mb-4">
            Sign in with your auth service account to access employees, users,
            departments, and positions based on your role.
          </p>

          <div className="rounded-4 p-4" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="mb-3">
              <div className="fw-semibold">Admin role</div>
              <div className="small text-white-50">
                Full access to employee, user, department, and position management.
              </div>
            </div>
            <div>
              <div className="fw-semibold">Client role</div>
              <div className="small text-white-50">
                Read-only access to dashboard and employee data.
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7 bg-white p-4 p-lg-5">
          <div className="mx-auto" style={{ maxWidth: "500px" }}>
            <p className="text-uppercase text-secondary fw-semibold mb-2">Welcome back</p>
            <h2 className="h1 mb-3">Login</h2>
            <p className="text-secondary mb-4">
              Your token is saved in local storage and used automatically on protected requests.
            </p>

            {error ? <div className="alert alert-danger">{error}</div> : null}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  className="form-control form-control-lg"
                  name="email"
                  onChange={updateField}
                  placeholder="admin@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  className="form-control form-control-lg"
                  name="password"
                  onChange={updateField}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={form.password}
                />
              </div>

              <button className="btn btn-primary btn-lg w-100" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
