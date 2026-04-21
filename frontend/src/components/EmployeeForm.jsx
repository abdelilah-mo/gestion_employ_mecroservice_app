import { useEffect, useState } from "react";
import { createEmployee, extractCollection, getDepartments, getPositions } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  department_id: "",
  position_id: "",
};

function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        setLoading(true);
        setError("");

        const [departmentResponse, positionResponse] = await Promise.all([
          getDepartments(),
          getPositions(),
        ]);

        if (!isMounted) {
          return;
        }

        setDepartments(extractCollection(departmentResponse));
        setPositions(extractCollection(positionResponse));
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

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
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        department_id: Number(form.department_id),
        position_id: Number(form.position_id),
      };

      const employee = await createEmployee(payload);

      setForm(initialForm);
      setSuccess("Employee created successfully.");

      if (onSuccess) {
        onSuccess(employee);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-card p-4 p-lg-5">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="h4 mb-2">Add employee</h2>
          <p className="text-secondary mb-0">
            Create a new employee and attach a department and position.
          </p>
        </div>
        <span className="badge rounded-pill badge-soft px-3 py-2">
          Bootstrap form
        </span>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

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
              placeholder="employee@example.com"
              required
              type="email"
              value={form.email}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              disabled={loading}
              name="department_id"
              onChange={updateField}
              required
              value={form.department_id}
            >
              <option value="">Select a department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Position</label>
            <select
              className="form-select"
              disabled={loading}
              name="position_id"
              onChange={updateField}
              required
              value={form.position_id}
            >
              <option value="">Select a position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title || position.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary px-4" disabled={submitting} type="submit">
            {submitting ? "Saving..." : "Create employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
