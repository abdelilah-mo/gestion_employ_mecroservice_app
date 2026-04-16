const API_URL = "http://127.0.0.1:8000/api";

export function getToken() {
return localStorage.getItem("token");
}

export function getHeaders() {
return {
"Content-Type": "application/json",
Authorization: "Bearer " + getToken()
};
}

// AUTH
export async function login(email, password) {
const res = await fetch("http://127.0.0.1:8005/api/login", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email, password })
});

return res.json();
}

// EMPLOYEES
export async function getEmployees() {
const res = await fetch(API_URL + "/employees", {
headers: getHeaders()
});
return res.json();
}

export async function addEmployee(data) {
const res = await fetch(API_URL + "/employees", {
method: "POST",
headers: getHeaders(),
body: JSON.stringify(data)
});
return res.json();
}

export async function deleteEmployee(id) {
await fetch(API_URL + "/employees/" + id, {
method: "DELETE",
headers: getHeaders()
});
}

// DEPARTMENTS
export async function getDepartments() {
const res = await fetch(API_URL + "/departments", {
headers: getHeaders()
});
return res.json();
}

// POSITIONS
export async function getPositions() {
const res = await fetch(API_URL + "/positions", {
headers: getHeaders()
});
return res.json();
}
