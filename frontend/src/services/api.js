const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://127.0.0.1:8005/api";
const GATEWAY_API_URL = import.meta.env.VITE_GATEWAY_API_URL || "http://127.0.0.1:8000/api";

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
  const value = localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
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
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

function extractErrorMessage(payload) {
  if (payload?.message) {
    return payload.message;
  }

  if (payload?.error) {
    return payload.error;
  }

  if (payload?.errors && typeof payload.errors === "object") {
    const firstKey = Object.keys(payload.errors)[0];
    if (firstKey && Array.isArray(payload.errors[firstKey])) {
      return payload.errors[firstKey][0];
    }
  }

  if (typeof payload === "string") {
    return payload;
  }

  return "Request failed.";
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

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload));
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
    authenticated: false,
    body: payload,
    method: "POST",
  });
}

export async function listUsers() {
  return request(AUTH_API_URL, "/users");
}

export async function createUser(payload) {
  return request(AUTH_API_URL, "/users", {
    body: payload,
    method: "POST",
  });
}

export async function getEmployees() {
  return request(GATEWAY_API_URL, "/employees");
}

export async function getEmployee(employeeId) {
  return request(GATEWAY_API_URL, `/employees/${employeeId}`);
}

export async function createEmployee(payload) {
  return request(GATEWAY_API_URL, "/employees", {
    body: payload,
    method: "POST",
  });
}

export async function updateEmployee(employeeId, payload) {
  return request(GATEWAY_API_URL, `/employees/${employeeId}`, {
    body: payload,
    method: "PUT",
  });
}

export async function deleteEmployee(employeeId) {
  return request(GATEWAY_API_URL, `/employees/${employeeId}`, {
    method: "DELETE",
  });
}

export async function getDepartments() {
  return request(GATEWAY_API_URL, "/departments");
}

export async function getDepartment(departmentId) {
  return request(GATEWAY_API_URL, `/departments/${departmentId}`);
}

export async function createDepartment(payload) {
  return request(GATEWAY_API_URL, "/departments", {
    body: payload,
    method: "POST",
  });
}

export async function updateDepartment(departmentId, payload) {
  return request(GATEWAY_API_URL, `/departments/${departmentId}`, {
    body: payload,
    method: "PUT",
  });
}

export async function deleteDepartment(departmentId) {
  return request(GATEWAY_API_URL, `/departments/${departmentId}`, {
    method: "DELETE",
  });
}

export async function getPositions() {
  return request(GATEWAY_API_URL, "/positions");
}

export async function getPosition(positionId) {
  return request(GATEWAY_API_URL, `/positions/${positionId}`);
}

export async function createPosition(payload) {
  return request(GATEWAY_API_URL, "/positions", {
    body: payload,
    method: "POST",
  });
}

export async function updatePosition(positionId, payload) {
  return request(GATEWAY_API_URL, `/positions/${positionId}`, {
    body: payload,
    method: "PUT",
  });
}

export async function deletePosition(positionId) {
  return request(GATEWAY_API_URL, `/positions/${positionId}`, {
    method: "DELETE",
  });
}
