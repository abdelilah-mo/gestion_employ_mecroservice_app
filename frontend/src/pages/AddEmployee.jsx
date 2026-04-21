import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import {
  createEmployee,
  extractCollection,
  getDepartments,
  getEmployee,
  getPositions,
  updateEmployee,
} from "../services/api";

function AddEmployee() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const isEdit = Boolean(employeeId);

  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadFormData();
  }, [employeeId]);

  async function loadFormData() {
    try {
      setLoadingOptions(true);
      setError("");

      const requests = [getDepartments(), getPositions()];

      if (isEdit) {
        requests.push(getEmployee(employeeId));
      }

      const [departmentsResponse, positionsResponse, employeeResponse] = await Promise.all(
        requests
      );

      setDepartments(extractCollection(departmentsResponse));
      setPositions(extractCollection(positionsResponse));
      setEmployee(employeeResponse || null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingOptions(false);
    }
  }

  async function handleSubmit(payload) {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (isEdit) {
        await updateEmployee(employeeId, payload);
        setSuccess("Employee updated successfully.");
      } else {
        await createEmployee(payload);
        setSuccess("Employee created successfully.");
      }

      window.setTimeout(() => {
        navigate("/employees");
      }, 600);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="h4 mb-1">{isEdit ? "Edit Employee" : "Add Employee"}</h3>
          <p className="text-secondary mb-0">
            Fill in the employee details and connect them to a department and position.
          </p>
        </div>
        <Link className="btn btn-outline-secondary" to="/employees">
          Back to employees
        </Link>
      </div>

      <div className="col-12">
        <EmployeeForm
          defaultValues={employee}
          departments={departments}
          error={error}
          loadingOptions={loadingOptions}
          onSubmit={handleSubmit}
          positions={positions}
          submitLabel={isEdit ? "Update employee" : "Create employee"}
          submitting={submitting}
          success={success}
        />
      </div>
    </div>
  );
}

export default AddEmployee;
