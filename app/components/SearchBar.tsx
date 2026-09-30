import { memo } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = memo(function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium">Search</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, email, or role"
        autoComplete="off"
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 dark:border-gray-600 dark:bg-gray-950"
      />
    </label>
  );
});
