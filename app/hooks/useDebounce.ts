import { useEffect, useState } from "react";

/**
 * Debounce a value by the given delay (ms).
 * Returns the latest value only after `delay` ms of inactivity.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
