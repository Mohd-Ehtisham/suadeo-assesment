import { memo } from "react";

type FilterPanelProps = {
  departments: string[];
  selected: string[];
  onToggle: (department: string) => void;
  onClear: () => void;
};

export const FilterPanel = memo(function FilterPanel({
  departments,
  selected,
  onToggle,
  onClear,
}: FilterPanelProps) {
  return (
    <fieldset className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <legend className="px-1 text-sm font-medium">Departments</legend>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        {selected.length === 0
          ? "All departments are included."
          : `${selected.length} selected. Search and department filters both apply.`}
      </p>
      {departments.length === 0 ? (
        <p className="text-sm text-gray-500">No departments available.</p>
      ) : (
        <div className="flex max-h-36 flex-wrap gap-2 overflow-auto">
          {departments.map((department) => {
            const checked = selected.includes(department);
            return (
              <label
                key={department}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-sm ${
                  checked
                    ? "border-blue-700 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-100"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(department)}
                  className="accent-blue-700"
                />
                {department}
              </label>
            );
          })}
        </div>
      )}
      {selected.length > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer mt-3 text-sm font-medium text-blue-700 hover:underline"
        >
          Clear departments
        </button>
      ) : null}
    </fieldset>
  );
});
