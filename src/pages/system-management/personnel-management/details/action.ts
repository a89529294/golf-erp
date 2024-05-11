import { linksKV } from "@/utils/links";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { ActionFunction, redirect } from "react-router-dom";
import { toast } from "sonner";

export const action: ActionFunction = async ({ request, params }) => {
  const employeeId = params.id!;
  const body = await request.json();

  const patchObject: Record<string, string> = {};

  // TODO need to handle the case when there was a storeId,
  // right now we are passing in storeId:null, but it doest work
  for (const k in body) {
    patchObject[k] = body[k];
  }

  const response = await privateFetch(`/employees/${employeeId}`, {
    method: "PATCH",
    body: JSON.stringify(patchObject),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error("更新員工失敗");
    const url = new URL(request.url);

    return redirect(`${url.pathname}/?error=true`);
  }

  toast.success("更新員工成功");
  queryClient.invalidateQueries({ queryKey: ["employees"] });
  queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });

  return redirect(
    linksKV["system-management"].subLinks["personnel-system-management"].paths
      .index,
  );
};
