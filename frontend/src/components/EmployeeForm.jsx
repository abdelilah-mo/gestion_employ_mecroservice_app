import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  department_id: "",
  position_id: "",
};

function EmployeeForm({
  defaultValues,
  departments,
  error,
  loadingOptions,
  onSubmit,
  positions,
  submitLabel,
  submitting,
  success,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (defaultValues) {
      setForm({
        name: defaultValues.name || "",
        email: defaultValues.email || "",
        department_id: defaultValues.department_id ? String(defaultValues.department_id) : "",
        position_id: defaultValues.position_id ? String(defaultValues.position_id) : "",
      });
      return;
    }

    setForm(initialForm);
  }, [defaultValues]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: form.name,
      email: form.email,
      department_id: Number(form.department_id),
      position_id: Number(form.position_id),
    });
  }

  return (
    <div className="page-card p-4 p-lg-5">
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
              disabled={loadingOptions}
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
              disabled={loadingOptions}
              name="position_id"
              onChange={updateField}
              required
              value={form.position_id}
            >
              <option value="">Select a position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary px-4"
            disabled={loadingOptions || submitting}
            type="submit"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
