import {
  dehydrate,
  QueryClient,
  type DehydratedState,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

export async function prefetch(
  load: (queryClient: QueryClient) => Promise<unknown>,
): Promise<DehydratedState> {
  const queryClient = getQueryClient();
  await load(queryClient);
  return dehydrate(queryClient);
}
