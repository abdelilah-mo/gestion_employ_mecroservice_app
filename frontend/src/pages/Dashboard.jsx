import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  extractCollection,
  getDepartments,
  getEmployees,
  getPositions,
  listUsers,
} from "../services/api";

function Dashboard({ user }) {
  const [counts, setCounts] = useState({
    employees: 0,
    departments: 0,
    positions: 0,
    users: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadDashboard();
  }, [isAdmin]);

  async function loadDashboard() {
    try {
      setError("");

      if (isAdmin) {
        const [employeesResponse, departmentsResponse, positionsResponse, usersResponse] =
          await Promise.all([
            getEmployees(),
            getDepartments(),
            getPositions(),
            listUsers(),
          ]);

        const employees = extractCollection(employeesResponse);

        setCounts({
          employees: employees.length,
          departments: extractCollection(departmentsResponse).length,
          positions: extractCollection(positionsResponse).length,
          users: extractCollection(usersResponse).length,
        });
        setRecentEmployees(employees.slice(0, 5));
        return;
      }

      const employeesResponse = await getEmployees();
      const employees = extractCollection(employeesResponse);

      setCounts({
        employees: employees.length,
        departments: 0,
        positions: 0,
        users: 0,
      });
      setRecentEmployees(employees.slice(0, 5));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="row g-4">
      {error ? (
        <div className="col-12">
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      ) : null}

      <div className="col-12">
        <div className="page-card p-4 p-lg-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
            <div>
              <p className="text-uppercase text-secondary fw-semibold small mb-2">
                Welcome back
              </p>
              <h3 className="h2 mb-2">{user?.name}</h3>
              <p className="text-secondary mb-0">
                {isAdmin
                  ? "You have full access to users, employees, departments, and positions."
                  : "You can view the employee directory and track organization updates."}
              </p>
            </div>

            {isAdmin ? (
              <div className="d-flex flex-wrap gap-2 align-self-start">
                <Link className="btn btn-primary" to="/employees/new">
                  Add Employee
                </Link>
                <Link className="btn btn-outline-primary" to="/users/new">
                  Add User
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="col-md-6 col-xl-3">
        <div className="metric-card p-4">
          <div className="metric-accent mb-3">E</div>
          <div className="text-secondary small mb-1">Employees</div>
          <div className="display-6 fw-bold mb-0">{counts.employees}</div>
        </div>
      </div>

      {isAdmin ? (
        <>
          <div className="col-md-6 col-xl-3">
            <div className="metric-card p-4">
              <div className="metric-accent mb-3">D</div>
              <div className="text-secondary small mb-1">Departments</div>
              <div className="display-6 fw-bold mb-0">{counts.departments}</div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="metric-card p-4">
              <div className="metric-accent mb-3">P</div>
              <div className="text-secondary small mb-1">Positions</div>
              <div className="display-6 fw-bold mb-0">{counts.positions}</div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="metric-card p-4">
              <div className="metric-accent mb-3">U</div>
              <div className="text-secondary small mb-1">Users</div>
              <div className="display-6 fw-bold mb-0">{counts.users}</div>
            </div>
          </div>
        </>
      ) : null}

      <div className="col-12">
        <div className="table-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="h4 mb-1">Recent employees</h3>
              <p className="text-secondary mb-0">A quick snapshot from the employee service.</p>
            </div>
            <Link className="btn btn-outline-secondary" to="/employees">
              View all
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department ID</th>
                  <th>Position ID</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.length === 0 ? (
                  <tr>
                    <td className="text-center py-5 text-secondary" colSpan="4">
                      No employees available yet.
                    </td>
                  </tr>
                ) : null}

                {recentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="fw-semibold">{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>#{employee.department_id}</td>
                    <td>#{employee.position_id}</td>
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

export default Dashboard;
