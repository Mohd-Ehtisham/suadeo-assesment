import type { Employee } from "~/types/employee";

import { employeeName } from "./helpers";

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

function neutralizeCsvCell(value: string): string {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value;
  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export function employeesToCsv(employees: Employee[]): string {
  const header = ["ID", "Name", "Email", "Department", "Role", "Status"];
  const lines = employees.map((employee) =>
    [
      String(employee.id),
      employeeName(employee),
      employee.email,
      employee.department,
      employee.role,
      employee.status,
    ]
      .map(neutralizeCsvCell)
      .join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

export function employeesToJson(employees: Employee[]): string {
  return JSON.stringify(employees, null, 2);
}

export function downloadTextFile(filename: string, contents: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
