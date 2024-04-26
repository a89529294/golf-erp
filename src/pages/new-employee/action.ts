import { linksKV } from "@/utils/links";
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
      storeId: body.storeId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error("新增員工失敗");
    return null;
  }

  toast.success("新增員工成功");

  return redirect(
    linksKV["data-management"].subLinks["personnel-data-management"].paths
      .index,
  );
};
