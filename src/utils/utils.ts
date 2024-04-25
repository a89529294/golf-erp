import { base_url, localStorageUserKey } from "@/utils";
import { redirect } from "react-router-dom";

export function sleep(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function privateFetch(...args: Parameters<typeof fetch>) {
  const response = await fetch(`${base_url + args[0]}`, {
    credentials: "include",
    ...args[1],
  });
  console.log(response.status);

  return response;
}

export function redirectToLoginIf401(status: number) {
  if (status === 401) {
    localStorage.removeItem(localStorageUserKey);
    redirect("/login");
  }
}
