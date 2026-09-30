import { useNavigation } from "react-router";

export function NavigationLoader() {
  const navigation = useNavigation();
  const active = navigation.state !== "idle";

  if (!active) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-50 h-1 bg-blue-200"
    >
      <div className="h-full w-1/3 animate-pulse bg-blue-700" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
