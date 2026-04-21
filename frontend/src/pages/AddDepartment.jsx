import { useEffect, useState } from "react";
import { createDepartment, extractCollection, getDepartments } from "../services/api";

function AddDepartment() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      setLoading(true);
      setError("");
      const response = await getDepartments();
      setDepartments(extractCollection(response));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createDepartment({ name });
      setName("");
      setSuccess("Department created successfully.");
      await loadDepartments();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="page-card p-4 p-lg-5 h-100">
          <h2 className="h3 mb-2">Add Department</h2>
          <p className="text-secondary mb-4">
            Departments feed the employee creation form and dashboard filters.
          </p>

          {error ? <div className="alert alert-danger">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Department name</label>
              <input
                className="form-control"
                onChange={(event) => setName(event.target.value)}
                placeholder="Human Resources"
                required
                value={name}
              />
            </div>

            <button className="btn btn-primary" disabled={saving} type="submit">
              {saving ? "Saving..." : "Create department"}
            </button>
          </form>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="table-card p-4 h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h4 mb-0">Department list</h3>
            <span className="badge rounded-pill badge-soft px-3 py-2">
              {departments.length} departments
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="text-center py-5 text-secondary" colSpan="2">
                      Loading departments...
                    </td>
                  </tr>
                ) : null}

                {!loading && departments.length === 0 ? (
                  <tr>
                    <td className="text-center py-5 text-secondary" colSpan="2">
                      No departments found.
                    </td>
                  </tr>
                ) : null}

                {departments.map((department) => (
                  <tr key={department.id}>
                    <td>#{department.id}</td>
                    <td className="fw-semibold">{department.name}</td>
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

export default AddDepartment;
