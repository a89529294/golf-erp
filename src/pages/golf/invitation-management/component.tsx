import plusIcon from "@/assets/plus-icon.svg";
import { IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationsQuery, loader } from "./loader";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function Component() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...invitationsQuery,
    initialData,
  });
  if (!user?.isAdmin) {
    data.data = data.data.filter((v) =>
      user?.allowedStores.golf.map((g) => g.id).includes(v.store.id),
    );
  }
  const { mutate: deleteInvitations, isPending } = useMutation({
    mutationKey: ["delete-invitations"],
    mutationFn: async (ids: string[]) => {
      const promises: Promise<Response>[] = [];

      ids.forEach((id) =>
        promises.push(
          privateFetch(`/store/golf/invite/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      await Promise.all(promises);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["invitations"],
      });
      toast.success("刪除邀約成功");
      setRowSelection({});
    },
    onError() {
      toast.error("刪除邀約失敗");
    },
  });

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            to={linksKV.golf.subLinks["invitation-management"].paths.new}
            className={button()}
          >
            <img src={plusIcon} />
            新增預約
          </Link>
          {Object.keys(rowSelection).length > 0 && (
            <IconWarningButton
              icon="trashCan"
              onClick={() => deleteInvitations(Object.keys(rowSelection))}
              disabled={isPending}
            >
              刪除
            </IconWarningButton>
          )}
        </>
      }
    >
      <DataTable
        columns={columns}
        data={data.data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </MainLayout>
  );
}
