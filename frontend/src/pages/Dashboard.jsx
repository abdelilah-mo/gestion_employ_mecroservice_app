import { useEffect, useState } from "react";
import { getEmployees } from "../services/api";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";

export default function Dashboard({ logout }) {
const [employees, setEmployees] = useState([]);

async function loadEmployees() {
const data = await getEmployees();
setEmployees(data.data || data);
}

useEffect(() => {
loadEmployees();
}, []);

return (
<div style={{ padding: 20 }}> <h2>Dashboard</h2>

  <button onClick={logout}>Logout</button>

  <EmployeeForm refresh={loadEmployees} />

  <br />

  <EmployeeTable employees={employees} refresh={loadEmployees} />
</div>

);
}
