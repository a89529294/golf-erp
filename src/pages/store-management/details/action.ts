import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { ActionFunction, redirect } from "react-router-dom";
import { toast } from "sonner";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const { storeId, ...rest } = body;

  const response = await privateFetch(`/store/${storeId}`, {
    method: "PATCH",
    body: JSON.stringify(rest),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const url = new URL(request.url);
  if (!response.ok) {
    toast.error("更新廠商失敗");
    return redirect(`${url.pathname}?error=true`);
  }

  toast.success("更新廠商成功");
  queryClient.invalidateQueries({ queryKey: ["stores"] });

  return redirect(`${url.pathname}?error=false`);
};
