export const EMPLOYEE_STATUSES = ["Active", "Inactive"] as const;

export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Finance",
  "Sales",
  "Operations",
] as const;

export const ROLES = [
  "Software Engineer",
  "Manager",
  "Analyst",
  "Designer",
] as const;

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  status: EmployeeStatus;
};

export type EmployeeDraft = Omit<Employee, "id">;
