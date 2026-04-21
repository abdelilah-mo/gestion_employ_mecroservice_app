const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://127.0.0.1:8005/api";
const EMPLOYEE_API_URL =
  import.meta.env.VITE_EMPLOYEE_API_URL || "http://127.0.0.1:8000/api";
const DEPARTMENT_API_URL =
  import.meta.env.VITE_DEPARTMENT_API_URL || "http://127.0.0.1:8000/api";
const POSITION_API_URL =
  import.meta.env.VITE_POSITION_API_URL || "http://127.0.0.1:8000/api";
const USERS_API_URL = import.meta.env.VITE_USERS_API_URL || AUTH_API_URL;

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function extractCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.users)) {
    return payload.users;
  }

  return [];
}

function buildUrl(baseUrl, path) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalizedPath, normalizedBase).toString();
}

function getHeaders(authenticated, extraHeaders) {
  const headers = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (authenticated) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  return headers;
}

async function request(baseUrl, path, options = {}) {
  const {
    authenticated = true,
    body,
    headers = {},
    method = "GET",
  } = options;

  const response = await fetch(buildUrl(baseUrl, path), {
    method,
    headers: getHeaders(authenticated, headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const responseType = response.headers.get("content-type") || "";
  const payload = responseType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      (typeof payload === "string" ? payload : "Request failed.");

    throw new Error(message);
  }

  return payload;
}

export async function loginUser(credentials) {
  return request(AUTH_API_URL, "/login", {
    authenticated: false,
    body: credentials,
    method: "POST",
  });
}

export async function fetchCurrentUser() {
  const user = await request(AUTH_API_URL, "/user");
  setStoredUser(user);
  return user;
}

export async function registerUser(payload) {
  return request(AUTH_API_URL, "/register", {
    body: payload,
    method: "POST",
  });
}

export async function listUsers() {
  return request(USERS_API_URL, "/users");
}

export async function getEmployees() {
  return request(EMPLOYEE_API_URL, "/employees");
}

export async function createEmployee(payload) {
  return request(EMPLOYEE_API_URL, "/employees", {
    body: payload,
    method: "POST",
  });
}

export async function deleteEmployee(employeeId) {
  return request(EMPLOYEE_API_URL, `/employees/${employeeId}`, {
    method: "DELETE",
  });
}

export async function getDepartments() {
  return request(DEPARTMENT_API_URL, "/departments");
}

export async function createDepartment(payload) {
  return request(DEPARTMENT_API_URL, "/departments", {
    body: payload,
    method: "POST",
  });
}

export async function getPositions() {
  return request(POSITION_API_URL, "/positions");
}

export async function createPosition(payload) {
  return request(POSITION_API_URL, "/positions", {
    body: payload,
    method: "POST",
  });
}
