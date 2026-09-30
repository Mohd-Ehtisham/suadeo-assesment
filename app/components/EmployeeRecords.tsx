import { lazy, Suspense, useCallback, useState } from "react";
import { Form } from "react-router";

import { useEmployees } from "~/hooks/useEmployees";
import type { Employee, EmployeeDraft } from "~/types/employee";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { EmployeeTable } from "./EmployeeTable";
import { FilterPanel } from "./FilterPanel";
import { Loading } from "./Loading";
import { Pagination } from "./Pagination";
import { SearchBar } from "./SearchBar";

const EmployeeForm = lazy(() =>
  import("./EmployeeForm").then((module) => ({ default: module.EmployeeForm })),
);

const primaryButton =
  "cursor-pointer rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50";
const secondaryButton =
  "cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 disabled:opacity-50";
const dangerButton =
  "cursor-pointer rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50";

type EditorState =
  | { mode: "create" }
  | { mode: "edit"; employee: Employee }
  | null;

export function EmployeeLoadError() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Employee records</h1>
      <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
        Unable to load employee records. Check your connection and try again.
      </p>
      <button type="button" className={`${primaryButton} mt-4`} onClick={() => window.location.reload()}>
        Try again
      </button>
    </main>
  );
}

export function EmployeeRecords() {
  const records = useEmployees();
  const [editor, setEditor] = useState<EditorState>(null);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = useCallback(() => setEditor({ mode: "create" }), []);
  const closeEditor = useCallback(() => setEditor(null), []);
  const closeDelete = useCallback(() => setPendingDelete(null), []);
  const onEdit = useCallback((employee: Employee) => {
    setEditor({ mode: "edit", employee });
  }, []);

  const onSubmit = useCallback(
    async (draft: EmployeeDraft) => {
      setSaving(true);
      try {
        if (editor?.mode === "edit") {
          await records.updateEmployee({ id: editor.employee.id, draft });
        } else {
          await records.addEmployee(draft);
        }
        setEditor(null);
        setNotice(null);
      } catch {
        setNotice("Failed to save record. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [editor, records],
  );

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await records.removeEmployee(pendingDelete.id);
      setPendingDelete(null);
      setNotice(null);
    } catch {
      setNotice("Failed to delete record. Please try again.");
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, records]);

  const exportRecords = useCallback(
    async (format: "csv" | "json") => {
      if (records.filtered.length === 0) {
        setNotice("Nothing to export for the current search and filters.");
        return;
      }

      const exporter = await import("~/utils/exportUtils");
      if (format === "csv") {
        exporter.downloadTextFile(
          "employees.csv",
          exporter.employeesToCsv(records.filtered),
          "text/csv;charset=utf-8",
        );
      } else {
        exporter.downloadTextFile(
          "employees.json",
          exporter.employeesToJson(records.filtered),
          "application/json",
        );
      }
      setNotice(null);
    },
    [records.filtered],
  );

  const emptyLabel =
    records.employees.length === 0
      ? "No employee records yet. Add a record to get started."
      : "No records match your search and filters.";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Employee records</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Search, filter, and manage employee records.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={secondaryButton} onClick={() => void exportRecords("csv")}>
            Export CSV
          </button>
          <button type="button" className={secondaryButton} onClick={() => void exportRecords("json")}>
            Export JSON
          </button>
          <button type="button" className={primaryButton} onClick={openCreate}>
            Add employee
          </button>
          <Form method="post" action="/logout">
            <button type="submit" className={`${secondaryButton} text-red-600 dark:text-red-400`}>
              Logout
            </button>
          </Form>
        </div>
      </header>

      {notice ? (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {notice}
        </p>
      ) : null}

      {records.isPending ? (
        <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
          <Loading />
        </div>
      ) : records.isError ? (
        <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 dark:border-red-900 dark:bg-red-950">
          <p role="alert" className="text-red-800 dark:text-red-100">
            Unable to load employee records. Check your connection and try again.
          </p>
        </div>
      ) : (
        <>
          <SearchBar value={records.searchInput} onChange={records.onSearchChange} />
          <FilterPanel
            departments={records.departments}
            selected={records.selectedDepartments}
            onToggle={records.toggleDepartment}
            onClear={records.clearDepartments}
          />
          <EmployeeTable
            employees={records.pageItems}
            emptyLabel={emptyLabel}
            onEdit={onEdit}
            onDelete={setPendingDelete}
          />
          <Pagination
            page={records.page}
            pageCount={records.pageCount}
            from={records.from}
            to={records.to}
            total={records.total}
            onPageChange={records.goToPage}
          />
        </>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={editor !== null} onOpenChange={(open) => !open && !saving && closeEditor()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editor?.mode === "edit" ? "Edit employee" : "Add employee"}
            </DialogTitle>
            <DialogDescription>
              {editor?.mode === "edit"
                ? "Update the employee details below."
                : "Fill in the details to add a new employee record."}
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<Loading label="Loading form..." />}>
            <EmployeeForm
              key={editor?.mode === "edit" ? editor.employee.id : "create"}
              initial={editor?.mode === "edit" ? editor.employee : undefined}
              submitLabel={
                saving
                  ? "Saving..."
                  : editor?.mode === "edit"
                    ? "Save changes"
                    : "Add record"
              }
              disabled={saving}
              onSubmit={onSubmit}
              onCancel={closeEditor}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && !deleting && closeDelete()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete employee</DialogTitle>
            <DialogDescription>
              Delete {pendingDelete?.firstName} {pendingDelete?.lastName}? This
              removes the record permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button" className={secondaryButton} onClick={closeDelete} disabled={deleting}>
              Cancel
            </button>
            <button type="button" className={dangerButton} onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
