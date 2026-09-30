import { memo } from "react";

import { clampPage } from "~/utils/helpers";

type PaginationProps = {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
};

function visiblePages(page: number, pageCount: number): number[] {
  const candidates = [1, pageCount, page - 1, page, page + 1];
  return [...new Set(candidates)]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((left, right) => left - right);
}

export const Pagination = memo(function Pagination({
  page,
  pageCount,
  from,
  to,
  total,
  onPageChange,
}: PaginationProps) {
  const pages = visiblePages(page, pageCount);
  const summary =
    total === 0 ? "Showing 0 of 0" : `Showing ${from}–${to} of ${total}`;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700"
    >
      <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-600"
        >
          Previous
        </button>
        {pages.map((pageNumber, index) => {
          const previous = pages[index - 1];
          const showGap = previous !== undefined && pageNumber - previous > 1;
          return (
            <span key={pageNumber} className="flex items-center gap-2">
              {showGap ? <span className="text-gray-400">…</span> : null}
              <button
                type="button"
                aria-current={pageNumber === page ? "page" : undefined}
                onClick={() => onPageChange(pageNumber)}
                className={`cursor-pointer min-w-9 rounded-lg px-2 py-1.5 text-sm ${
                  pageNumber === page
                    ? "bg-blue-700 text-white"
                    : "border border-gray-300 dark:border-gray-600"
                }`}
              >
                {pageNumber}
              </button>
            </span>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-600"
        >
          Next
        </button>
        <label className="flex items-center gap-2 text-sm">
          <span>Go to</span>
          <input
            type="number"
            min={1}
            max={pageCount}
            value={page}
            aria-label="Jump to page"
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) {
                onPageChange(clampPage(next, pageCount));
              }
            }}
            className="w-16 rounded-lg border border-gray-300 bg-white px-2 py-1.5 dark:border-gray-600 dark:bg-gray-950"
          />
        </label>
      </div>
    </nav>
  );
});
