import { redirect } from "react-router";

import { destroySession } from "~/lib/session";
import type { Route } from "./+types/logout";

export async function action(_args: Route.ActionArgs) {
  const cookie = await destroySession();

  throw redirect("/login", {
    headers: { "Set-Cookie": cookie },
  });
}

export async function loader() {
  throw redirect("/");
}
