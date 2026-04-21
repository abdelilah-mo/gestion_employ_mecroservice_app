import { Link, useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";

function AddEmployee() {
  const navigate = useNavigate();

  function handleSuccess() {
    window.setTimeout(() => {
      navigate("/employees");
    }, 700);
  }

  return (
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h3 mb-1">Add Employee</h2>
          <p className="text-secondary mb-0">Create a new employee profile.</p>
        </div>
        <Link className="btn btn-outline-secondary" to="/employees">
          Back to employees
        </Link>
      </div>

      <div className="col-12">
        <EmployeeForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default AddEmployee;
