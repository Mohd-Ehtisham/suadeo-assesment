import { apiRequest } from "~/services/apiConfig";
import type { Employee, EmployeeDraft, EmployeeStatus } from "~/types/employee";

const BASE_URL = `${process.env.API_BASE_URL}/employee`;

type RemoteEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  status: string;
};

function normalizeStatus(raw: string): EmployeeStatus {
  const lower = raw.trim().toLowerCase();
  if (lower === "active") return "Active";
  if (lower === "inactive") return "Inactive";
  return "Active";
}

function toEmployee(raw: RemoteEmployee): Employee {
  return {
    id: String(raw.id),
    firstName: raw.firstName?.trim() || "Unknown",
    lastName: raw.lastName?.trim() || "",
    email: raw.email?.trim() || "",
    department: raw.department?.trim() || "Unassigned",
    role: raw.role?.trim() || "Unassigned",
    status: normalizeStatus(raw.status),
  };
}

/** GET /employee */
export async function getEmployees(): Promise<Employee[]> {
  const data = await apiRequest<RemoteEmployee[]>(BASE_URL);

  if (!Array.isArray(data)) {
    throw new Error("Unable to load employee records.");
  }

  return data.map(toEmployee);
}

/** GET /employee/:id */
export async function getEmployee(id: string): Promise<Employee> {
  const data = await apiRequest<RemoteEmployee>(`${BASE_URL}/${encodeURIComponent(id)}`);
  return toEmployee(data);
}

/** POST /employee */
export async function createEmployee(draft: EmployeeDraft): Promise<Employee> {
  const data = await apiRequest<RemoteEmployee>(BASE_URL, {
    method: "POST",
    body: JSON.stringify(draft),
  });
  return toEmployee(data);
}

/** PUT /employee/:id */
export async function updateEmployee(
  id: string,
  draft: EmployeeDraft,
): Promise<Employee> {
  const data = await apiRequest<RemoteEmployee>(
    `${BASE_URL}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(draft),
    },
  );
  return toEmployee(data);
}

/** DELETE /employee/:id */
export async function deleteEmployee(id: string): Promise<void> {
  await apiRequest<RemoteEmployee>(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
