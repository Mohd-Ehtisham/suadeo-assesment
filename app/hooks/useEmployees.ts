import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useDebounce } from "~/hooks/useDebounce";

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee as updateEmployeeApi,
} from "~/services/employeeApi";
import type { Employee, EmployeeDraft } from "~/types/employee";
import {
  clampPage,
  employeeName,
  PAGE_SIZE,
  pageCountFor,
  uniqueSorted,
} from "~/utils/helpers";

export function employeesQuery() {
  return queryOptions({
    queryKey: ["employees"],
    queryFn: () => getEmployees(),
    staleTime: Infinity,
  });
}

export function useEmployees() {
  const queryClient = useQueryClient();
  const query = useQuery(employeesQuery());

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 300);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // Reset to page 1 when debounced search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const employees = query.data ?? [];

  const departments = useMemo(
    () => uniqueSorted(employees.map((e) => e.department)),
    [employees],
  );

  // --- Derived filtered list ---
  const filtered = useMemo(() => {
    const queryText = search.toLowerCase();

    return employees.filter((employee) => {
      const matchesDepartment =
        selectedDepartments.length === 0 ||
        selectedDepartments.includes(employee.department);

      if (!matchesDepartment) return false;
      if (!queryText) return true;

      const name = employeeName(employee).toLowerCase();
      return (
        name.includes(queryText) ||
        employee.email.toLowerCase().includes(queryText) ||
        employee.role.toLowerCase().includes(queryText)
      );
    });
  }, [employees, search, selectedDepartments]);

  // --- Pagination ---
  const pageCount = pageCountFor(filtered.length);
  const currentPage = clampPage(page, pageCount);
  const startIndex = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const pageItems = useMemo(
    () => filtered.slice(startIndex, startIndex + PAGE_SIZE),
    [filtered, startIndex],
  );

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  // --- Mutations ---
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
    [queryClient],
  );

  const addMutation = useMutation({
    mutationFn: (draft: EmployeeDraft) => createEmployee(draft),
    onSuccess: (created) => {
      queryClient.setQueryData<Employee[]>(["employees"], (old) =>
        old ? [created, ...old] : [created],
      );
      setPage(1);
    },
    onSettled: () => void invalidate(),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: EmployeeDraft }) =>
      updateEmployeeApi(id, draft),
    onSuccess: (updated) => {
      queryClient.setQueryData<Employee[]>(["employees"], (old) =>
        old
          ? old.map((e) => (e.id === updated.id ? updated : e))
          : [updated],
      );
    },
    onSettled: () => void invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onMutate: (id) => {
      queryClient.setQueryData<Employee[]>(["employees"], (old) =>
        old ? old.filter((e) => e.id !== id) : [],
      );
    },
    onSettled: () => void invalidate(),
  });

  // --- Callbacks ---
  const onSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const toggleDepartment = useCallback((department: string) => {
    setSelectedDepartments((current) =>
      current.includes(department)
        ? current.filter((d) => d !== department)
        : [...current, department],
    );
    setPage(1);
  }, []);

  const clearDepartments = useCallback(() => {
    setSelectedDepartments([]);
    setPage(1);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return {
    isPending: query.isPending,
    isError: query.isError,
    employees,
    filtered,
    pageItems,
    departments,
    selectedDepartments,
    searchInput,
    page: currentPage,
    pageCount,
    from: filtered.length === 0 ? 0 : startIndex + 1,
    to: startIndex + pageItems.length,
    total: filtered.length,
    onSearchChange,
    toggleDepartment,
    clearDepartments,
    goToPage,
    addEmployee: addMutation.mutateAsync,
    updateEmployee: editMutation.mutateAsync,
    removeEmployee: deleteMutation.mutateAsync,
    isSaving: addMutation.isPending || editMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
