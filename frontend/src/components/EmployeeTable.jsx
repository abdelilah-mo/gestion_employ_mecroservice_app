import { Link } from "react-router-dom";

function EmployeeTable({
  canManage,
  departments,
  employees,
  loading,
  onDelete,
  positions,
}) {
  const departmentMap = {};
  const positionMap = {};

  departments.forEach((department) => {
    departmentMap[department.id] = department.name;
  });

  positions.forEach((position) => {
    positionMap[position.id] = position.title;
  });

  async function handleDelete(employeeId) {
    const confirmed = window.confirm("Delete this employee?");

    if (!confirmed) {
      return;
    }

    await onDelete(employeeId);
  }

  return (
    <div className="table-card p-4">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              {canManage ? <th className="text-end">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="text-center py-5 text-secondary" colSpan={canManage ? 6 : 5}>
                  Loading employees...
                </td>
              </tr>
            ) : null}

            {!loading && employees.length === 0 ? (
              <tr>
                <td className="text-center py-5 text-secondary" colSpan={canManage ? 6 : 5}>
                  No employees found.
                </td>
              </tr>
            ) : null}

            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>#{employee.id}</td>
                <td className="fw-semibold">{employee.name}</td>
                <td>{employee.email}</td>
                <td>{departmentMap[employee.department_id] || `#${employee.department_id}`}</td>
                <td>{positionMap[employee.position_id] || `#${employee.position_id}`}</td>
                {canManage ? (
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <Link
                        className="btn btn-outline-primary btn-sm"
                        to={`/employees/${employee.id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(employee.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
