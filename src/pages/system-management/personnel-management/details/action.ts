import { linksKV } from "@/utils/links";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { ActionFunction, redirect } from "react-router-dom";
import { toast } from "sonner";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();

  const response = await privateFetch("/employees", {
    method: "POST",
    body: JSON.stringify({
      idNumber: body.idNumber,
      chName: body.name,
      telphone: body.phoneno,
      ...(body.storeId ? { storeId: body.storeId } : {}),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error("新增員工失敗");
    const url = new URL(request.url);

    return redirect(`${url.pathname}/?error=true`);
  }

  toast.success("新增員工成功");
  queryClient.invalidateQueries({ queryKey: ["employees"] });

  return redirect(
    linksKV["system-management"].subLinks["personnel-system-management"].paths
      .index,
  );
};
