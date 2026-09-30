import type { Employee } from "~/types/employee";

export const PAGE_SIZE = 6;

export function employeeName(employee: Pick<Employee, "firstName" | "lastName">): string {
  return `${employee.firstName} ${employee.lastName}`;
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export function pageCountFor(total: number, pageSize = PAGE_SIZE): number {
  if (total <= 0) {
    return 1;
  }
  return Math.ceil(total / pageSize);
}

export function clampPage(page: number, pageCount: number): number {
  if (!Number.isFinite(page)) {
    return 1;
  }
  return Math.min(Math.max(1, Math.floor(page)), pageCount);
}
