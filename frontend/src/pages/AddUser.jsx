import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "client",
};

function AddUser() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notice, setNotice] = useState("");
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
      setSuccess("");
      setNotice("");

      const response = await registerUser(form);
      setForm(initialForm);
      setSuccess("User created successfully.");

      if (response?.user?.role && response.user.role !== form.role) {
        setNotice(
          `The auth API saved this user as "${response.user.role}". If you expect admin creation, the backend still needs role handling.`
        );
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h3 mb-1">Add User</h2>
          <p className="text-secondary mb-0">Register a new user in the auth service.</p>
        </div>
        <Link className="btn btn-outline-secondary" to="/users">
          View users
        </Link>
      </div>

      <div className="col-12">
        <div className="page-card p-4 p-lg-5">
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}
          {notice ? <div className="alert alert-warning">{notice}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="name"
                  onChange={updateField}
                  placeholder="Enter full name"
                  required
                  value={form.name}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  name="email"
                  onChange={updateField}
                  placeholder="user@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  minLength="8"
                  name="password"
                  onChange={updateField}
                  placeholder="At least 8 characters"
                  required
                  type="password"
                  value={form.password}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
                  onChange={updateField}
                  value={form.role}
                >
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-primary px-4" disabled={loading} type="submit">
                {loading ? "Creating..." : "Create user"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
