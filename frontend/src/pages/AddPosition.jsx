import { useEffect, useState } from "react";
import {
  createPosition,
  deletePosition,
  extractCollection,
  getPositions,
  updatePosition,
} from "../services/api";

function AddPosition() {
  const [title, setTitle] = useState("");
  const [editingPositionId, setEditingPositionId] = useState(null);
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingPositionId) {
        await updatePosition(editingPositionId, { title });
        setSuccess("Position updated successfully.");
      } else {
        await createPosition({ title });
        setSuccess("Position created successfully.");
      }

      setTitle("");
      setEditingPositionId(null);
      await loadPositions();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(positionId) {
    const confirmed = window.confirm("Delete this position?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deletePosition(positionId);

      if (editingPositionId === positionId) {
        setEditingPositionId(null);
        setTitle("");
      }

      setSuccess("Position deleted successfully.");
      await loadPositions();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function startEdit(position) {
    setEditingPositionId(position.id);
    setTitle(position.title);
    setSuccess("");
    setError("");
  }

  function resetForm() {
    setEditingPositionId(null);
    setTitle("");
    setSuccess("");
    setError("");
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="page-card p-4 p-lg-5 h-100">
          <h3 className="h4 mb-2">{editingPositionId ? "Edit Position" : "Add Position"}</h3>
          <p className="text-secondary mb-4">
            Positions appear in the employee form dropdown.
          </p>

          {error ? <div className="alert alert-danger">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Position title</label>
              <input
                className="form-control"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Software Engineer"
                required
                value={title}
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving} type="submit">
                {saving
                  ? "Saving..."
                  : editingPositionId
                    ? "Update position"
                    : "Create position"}
              </button>

              {editingPositionId ? (
                <button className="btn btn-outline-secondary" onClick={resetForm} type="button">
                  Cancel
                </button>
              ) : null}
            </div>
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
                  <th className="text-end">Actions</th>
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
                    <td className="fw-semibold">{position.title}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => startEdit(position)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(position.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
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

export default AddPosition;
