function EmployeeTable({
  employees,
  departments,
  positions,
  onDelete,
  canDelete,
  loading,
}) {
  const departmentMap = Object.fromEntries(
    departments.map((department) => [department.id, department.name])
  );
  const positionMap = Object.fromEntries(
    positions.map((position) => [position.id, position.title || position.name])
  );

  async function handleDelete(employeeId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!shouldDelete) {
      return;
    }

    await onDelete(employeeId);
  }

  return (
    <div className="table-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 mb-1">Employees</h2>
          <p className="text-secondary mb-0">Live data from the employee service.</p>
        </div>
        <span className="badge rounded-pill badge-soft px-3 py-2">
          {employees.length} records
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              {canDelete ? <th className="text-end">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {!loading && employees.length === 0 ? (
              <tr>
                <td className="text-center py-5 text-secondary" colSpan={canDelete ? 6 : 5}>
                  No employees found.
                </td>
              </tr>
            ) : null}

            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>#{employee.id}</td>
                <td className="fw-semibold">{employee.name}</td>
                <td>{employee.email}</td>
                <td>{departmentMap[employee.department_id] || "Unknown"}</td>
                <td>{positionMap[employee.position_id] || "Unknown"}</td>
                {canDelete ? (
                  <td className="text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(employee.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}

            {loading ? (
              <tr>
                <td className="text-center py-5 text-secondary" colSpan={canDelete ? 6 : 5}>
                  Loading employees...
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
