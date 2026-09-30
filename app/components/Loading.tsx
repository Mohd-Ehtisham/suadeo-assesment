export function Loading({ label = "Loading records..." }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 px-4 py-8 text-gray-600 dark:text-gray-300">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-700 dark:border-gray-600"
      />
      <span>{label}</span>
    </div>
  );
}
