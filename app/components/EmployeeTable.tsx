import { memo, useCallback, useEffect, useRef, useState, type UIEvent } from "react";

import type { Employee } from "~/types/employee";
import { employeeName } from "~/utils/helpers";

const ROW_HEIGHT = 56;
const VIEWPORT_HEIGHT = 380;
const OVERSCAN = 3;
const COLUMN_COUNT = 7;

type EmployeeTableProps = {
  employees: Employee[];
  emptyLabel: string;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
};

export const EmployeeTable = memo(function EmployeeTable({
  employees,
  emptyLabel,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
    setScrollTop(0);
  }, [employees]);

  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const next = event.currentTarget.scrollTop;
    setScrollTop((current) =>
      Math.floor(current / ROW_HEIGHT) === Math.floor(next / ROW_HEIGHT) ? current : next,
    );
  }, []);

  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const end = Math.min(
    employees.length,
    Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + OVERSCAN,
  );
  const visible = employees.slice(start, end);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700" style={{ minHeight: VIEWPORT_HEIGHT }}>
      <div
        ref={scrollerRef}
        className="overflow-auto"
        style={{ maxHeight: VIEWPORT_HEIGHT }}
        onScroll={onScroll}
      >
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">Employee records</caption>
          <colgroup>
            <col className="w-[60px]" />
            <col className="w-[15%]" />
            <col className="w-[25%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[10%]" />
            <col className="w-[120px]" />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">ID</th>
              <th scope="col" className="px-4 py-3 font-medium">Name</th>
              <th scope="col" className="px-4 py-3 font-medium">Email</th>
              <th scope="col" className="px-4 py-3 font-medium">Department</th>
              <th scope="col" className="px-4 py-3 font-medium">Role</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="px-4 text-center text-gray-500" style={{ height: VIEWPORT_HEIGHT - 44 }}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              <>
                {start > 0 ? (
                  <tr aria-hidden="true">
                    <td colSpan={COLUMN_COUNT} style={{ height: start * ROW_HEIGHT, padding: 0 }} />
                  </tr>
                ) : null}
                {visible.map((employee) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
                {end < employees.length ? (
                  <tr aria-hidden="true">
                    <td
                      colSpan={COLUMN_COUNT}
                      style={{ height: (employees.length - end) * ROW_HEIGHT, padding: 0 }}
                    />
                  </tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const EmployeeRow = memo(function EmployeeRow({
  employee,
  onEdit,
  onDelete,
}: {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}) {
  const edit = useCallback(() => onEdit(employee), [employee, onEdit]);
  const remove = useCallback(() => onDelete(employee), [employee, onDelete]);
  const active = employee.status === "Active";

  return (
    <tr className="h-14 border-t border-gray-200 dark:border-gray-800">
      <td className="truncate px-4">{employee.id}</td>
      <td className="truncate px-4 font-medium">{employeeName(employee)}</td>
      <td className="truncate px-4">{employee.email}</td>
      <td className="truncate px-4">{employee.department}</td>
      <td className="truncate px-4">{employee.role}</td>
      <td className="px-4">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            active
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
              : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {employee.status}
        </span>
      </td>
      <td className="px-4">
        <div className="flex gap-2">
          <button type="button" onClick={edit} className="cursor-pointer text-sm font-medium text-blue-700 hover:underline">
            Edit
          </button>
          <button type="button" onClick={remove} className="cursor-pointer text-sm font-medium text-red-700 hover:underline">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
});
