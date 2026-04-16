import { deleteEmployee } from "../services/api";

export default function EmployeeTable({ employees, refresh }) {
async function handleDelete(id) {
await deleteEmployee(id);
refresh();
}

return ( <table border="1" cellPadding="10"> <thead> <tr> <th>ID</th> <th>Name</th> <th>Email</th> <th>Action</th> </tr> </thead>

  <tbody>
    {employees.map((e) => (
      <tr key={e.id}>
        <td>{e.id}</td>
        <td>{e.name}</td>
        <td>{e.email}</td>
        <td>
          <button onClick={() => handleDelete(e.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

);
}
