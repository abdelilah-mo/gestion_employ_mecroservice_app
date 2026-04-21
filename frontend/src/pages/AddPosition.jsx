import { useEffect, useState } from "react";
import { createPosition, extractCollection, getPositions } from "../services/api";

function AddPosition() {
  const [form, setForm] = useState({
    title: "",
    base_salary: "",
  });
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPositions();
  }, []);

  async function loadPositions() {
    try {
      setLoading(true);
      setError("");
      const response = await getPositions();
      setPositions(extractCollection(response));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

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
      setSaving(true);
      setError("");
      setSuccess("");

      await createPosition({
        title: form.title,
        base_salary: Number(form.base_salary),
      });

      setForm({
        title: "",
        base_salary: "",
      });
      setSuccess("Position created successfully.");
      await loadPositions();
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
          <h2 className="h3 mb-2">Add Position</h2>
          <p className="text-secondary mb-4">
            Positions require a title and base salary because the backend validates both.
          </p>

          {error ? <div className="alert alert-danger">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                name="title"
                onChange={updateField}
                placeholder="Software Engineer"
                required
                value={form.title}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Base salary</label>
              <input
                className="form-control"
                min="0"
                name="base_salary"
                onChange={updateField}
                placeholder="4500"
                required
                step="0.01"
                type="number"
                value={form.base_salary}
              />
            </div>

            <button className="btn btn-primary" disabled={saving} type="submit">
              {saving ? "Saving..." : "Create position"}
            </button>
          </form>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="table-card p-4 h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h4 mb-0">Position list</h3>
            <span className="badge rounded-pill badge-soft px-3 py-2">
              {positions.length} positions
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Base salary</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="text-center py-5 text-secondary" colSpan="3">
                      Loading positions...
                    </td>
                  </tr>
                ) : null}

                {!loading && positions.length === 0 ? (
                  <tr>
                    <td className="text-center py-5 text-secondary" colSpan="3">
                      No positions found.
                    </td>
                  </tr>
                ) : null}

                {positions.map((position) => (
                  <tr key={position.id}>
                    <td>#{position.id}</td>
                    <td className="fw-semibold">{position.title || position.name}</td>
                    <td>{position.base_salary ?? "-"}</td>
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

export default AddPosition;
