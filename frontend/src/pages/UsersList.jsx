import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractCollection, listUsers } from "../services/api";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const response = await listUsers();
      setUsers(extractCollection(response));
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
          <h3 className="h4 mb-1">Users</h3>
          <p className="text-secondary mb-0">User records from the auth service.</p>
        </div>
        <Link className="btn btn-primary" to="/users/new">
          Add User
        </Link>
      </div>

      <div className="col-12">
        {error ? <div className="alert alert-danger">{error}</div> : null}

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
                  <tr key={user.id}>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          user.role === "admin" ? "badge-admin" : "badge-client"
                        } px-3 py-2`}
                      >
                        {user.role}
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
