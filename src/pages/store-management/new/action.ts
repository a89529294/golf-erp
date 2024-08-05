import { linksKV } from "@/utils/links";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { ActionFunction, redirect } from "react-router-dom";
import { toast } from "sonner";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();

  const response = await privateFetch("/store", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error("新增廠商失敗");
    const url = new URL(request.url);

    return redirect(`${url.pathname}/?error=true`);
  }

  toast.success("新增廠商成功");
  queryClient.invalidateQueries({ queryKey: ["stores"] });

  return redirect(linksKV["store-management"].paths.index);
};
