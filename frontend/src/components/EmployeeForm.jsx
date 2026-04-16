import { useEffect, useState } from "react";
import { addEmployee, getDepartments, getPositions } from "../services/api";

export default function EmployeeForm({ refresh }) {
const [form, setForm] = useState({
name: "",
email: "",
department_id: "",
position_id: ""
});

const [departments, setDepartments] = useState([]);
const [positions, setPositions] = useState([]);

useEffect(() => {
loadData();
}, []);

async function loadData() {
const dep = await getDepartments();
const pos = await getPositions();

setDepartments(Array.isArray(dep.data) ? dep.data : dep);
setPositions(Array.isArray(pos.data) ? pos.data : pos);
console.log(dep);
console.log(pos);

}

async function handleSubmit() {
await addEmployee(form);
refresh();
}

return ( <div> <h3>Add Employee</h3>

  <input placeholder="Name"
    onChange={(e) => setForm({ ...form, name: e.target.value })} />

  <input placeholder="Email"
    onChange={(e) => setForm({ ...form, email: e.target.value })} />

  <select onChange={(e) => setForm({ ...form, department_id: e.target.value })}>
    <option>Department</option>
    {departments.map(d => (
      <option key={d.id} value={d.id}>{d.name}</option>
    ))}
  </select>

  <select onChange={(e) => setForm({ ...form, position_id: e.target.value })}>
    <option>Position</option>
    {positions.map(p => (
      <option key={p.id} value={p.id}>{p.name}</option>
    ))}
  </select>

  <button onClick={handleSubmit}>Add</button>
</div>

);
}
