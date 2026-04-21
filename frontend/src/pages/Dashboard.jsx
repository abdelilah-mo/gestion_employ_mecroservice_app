import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import EmployeeTable from "../components/EmployeeTable";
import AddEmployee from "./AddEmployee";
import AddUser from "./AddUser";
import { getEmployees } from "../services/api";

export default function Dashboard({ logout }) {
const [page, setPage] = useState("dashboard");
const [employees, setEmployees] = useState([]);

async function loadEmployees() {
const data = await getEmployees();
setEmployees(data.data || []);
}

useEffect(() => {
loadEmployees();
}, []);

return (
<div style={{ display: "flex" }}> <Sidebar setPage={setPage} />

  <div style={{ padding: 20, flex: 1 }}>
    <button onClick={logout}>Logout</button>

    {page === "dashboard" && (
      <EmployeeTable employees={employees} refresh={loadEmployees} />
    )}

    {page === "addEmployee" && (
      <AddEmployee refresh={loadEmployees} />
    )}

    {page === "addUser" && <AddUser />}
  </div>
</div>

);
}
