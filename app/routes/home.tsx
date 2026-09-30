import { HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "react-router";

import { EmployeeLoadError, EmployeeRecords } from "~/components/EmployeeRecords";
import { employeesQuery } from "~/hooks/useEmployees";
import { prefetch } from "~/lib/query-client";
import { isAuthenticated } from "~/lib/session";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "Employee records" },
    {
      name: "description",
      content: "Search, filter, and manage employee records.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (!(await isAuthenticated(request))) {
    throw redirect("/login");
  }

  try {
    const dehydratedState = await prefetch((queryClient) =>
      queryClient.query({ ...employeesQuery(), staleTime: "static" }),
    );

    return { dehydratedState };
  } catch {
    return { dehydratedState: null };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  if (!loaderData.dehydratedState) {
    return <EmployeeLoadError />;
  }

  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <EmployeeRecords />
    </HydrationBoundary>
  );
}
