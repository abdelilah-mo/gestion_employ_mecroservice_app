import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployeeTable from "../components/EmployeeTable";
import {
  deleteEmployee,
  extractCollection,
  getDepartments,
  getEmployees,
  getPositions,
} from "../services/api";

function Employees({ user }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [employeesResponse, departmentsResponse, positionsResponse] = await Promise.all([
        getEmployees(),
        getDepartments(),
        getPositions(),
      ]);

      setEmployees(extractCollection(employeesResponse));
      setDepartments(extractCollection(departmentsResponse));
      setPositions(extractCollection(positionsResponse));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(employeeId) {
    try {
      setError("");
      await deleteEmployee(employeeId);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="h4 mb-1">Employee Directory</h3>
          <p className="text-secondary mb-0">
            {isAdmin
              ? "Manage employee records from the employee microservice."
              : "Browse employee records available to your account."}
          </p>
        </div>

        {isAdmin ? (
          <Link className="btn btn-primary" to="/employees/new">
            Add Employee
          </Link>
        ) : null}
      </div>

      <div className="col-12">
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <EmployeeTable
          canManage={isAdmin}
          departments={departments}
          employees={employees}
          loading={loading}
          onDelete={handleDelete}
          positions={positions}
        />
      </div>
    </div>
  );
}

export default Employees;
