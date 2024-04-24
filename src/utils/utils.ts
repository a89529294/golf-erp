import { base_url } from "@/utils";

export function sleep(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function privateFetch(...args: Parameters<typeof fetch>) {
  const response = await fetch(`${base_url + args[0]}`, {
    credentials: "include",
    ...args[1],
  });

  if (!response.ok) throw new Error("response not ok");

  return response;
}
