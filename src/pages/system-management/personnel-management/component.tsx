import plusIcon from "@/assets/plus-icon.svg";
import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import {
  columns,
  mobileColumns,
} from "@/pages/system-management/personnel-management/data-table/columns";
import { DataTable } from "@/pages/system-management/personnel-management/data-table/data-table";
import {
  genEmployeesQuery,
  loader,
} from "@/pages/system-management/personnel-management/loader";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const isMobile = useIsMobile();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genEmployeesQuery(),
    initialData,
  });
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["delete-employees"],
    mutationFn: async () => {
      const employeeIds = Object.keys(rowSelection);
      await Promise.all(
        employeeIds.map((id) =>
          privateFetch(`/employees/${id}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setRowSelection({});
      toast.success("成功刪除員工");
    },
    onError: () => toast.error("刪除員工失敗"),
  });

  return (
    <MainLayout
      headerChildren={
        <>
          {Object.keys(rowSelection).length ? (
            <Modal
              dialogTriggerChildren={
                <IconWarningButton icon="trashCan">刪除</IconWarningButton>
              }
              onSubmit={mutateAsync}
              title="確定刪除選取員工?"
            />
          ) : null}

          <Link
            to={
              linksKV["system-management"].subLinks[
                "personnel-system-management"
              ].paths.new
            }
            className={cn(
              button(),
              Object.keys(rowSelection).length && "sm:hidden",
            )}
          >
            <img src={plusIcon} />
            新增人員
          </Link>

          <SearchInput
            className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      {({ height }) => {
        return isMobile ? (
          <ScrollArea style={{ height }}>
            <DataTable
              columns={mobileColumns}
              data={data}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            <Scrollbar className="hidden sm:block" orientation="horizontal" />
          </ScrollArea>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        );
      }}
    </MainLayout>
  );
}
