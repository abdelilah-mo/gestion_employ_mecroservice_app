import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractCollection, listUsers } from "../services/api";

function UsersList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      setWarning("");

      const response = await listUsers();
      setUsers(extractCollection(response));
    } catch (requestError) {
      setWarning(
        `${requestError.message} Falling back to the currently authenticated user because the auth service does not expose a list endpoint yet.`
      );
      setUsers(currentUser ? [currentUser] : []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h3 mb-1">Users</h2>
          <p className="text-secondary mb-0">User records from the authentication service.</p>
        </div>
        <Link className="btn btn-primary" to="/users/new">
          Add User
        </Link>
      </div>

      <div className="col-12">
        {error ? <div className="alert alert-danger">{error}</div> : null}
        {warning ? <div className="alert alert-warning">{warning}</div> : null}

        <div className="table-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="text-center py-5 text-secondary" colSpan="3">
                      Loading users...
                    </td>
                  </tr>
                ) : null}

                {!loading && users.length === 0 ? (
                  <tr>
                    <td className="text-center py-5 text-secondary" colSpan="3">
                      No users found.
                    </td>
                  </tr>
                ) : null}

                {users.map((user) => (
                  <tr key={user.id || user.email}>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          user.role === "admin" ? "badge-admin" : "badge-client"
                        } px-3 py-2`}
                      >
                        {user.role || "client"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;
