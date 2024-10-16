import plusIcon from "@/assets/plus-icon.svg";
import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { columns } from "@/pages/system-management/personnel-management/data-table/columns";
import { DataTable } from "@/pages/system-management/personnel-management/data-table/data-table";
import {
  genEmployeesQuery,
  loader,
} from "@/pages/system-management/personnel-management/loader";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  // const headerRowRef = useRef<HTMLTableRowElement>(null);
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

  // useWindowSizeChange(() => {
  //   if (headerRowRef.current)
  //     setHeaderRowHeight(headerRowRef.current.clientHeight);
  // });

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
            // className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      {/* {({ height }) => {
        return isMobile ? (
          <DataTable
            columns={mobileColumns}
            data={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            style={{ height }}
          />
        ) : (
          <div className="w-full pt-0 border border-t-0 border-line-gray bg-light-gray">
            <div className="sticky top-[90px] z-10 w-full border-b border-line-gray" />
            <div
              className="sticky z-10 w-full border-b border-line-gray"
              style={{
                top: `calc(90px + ${headerRowHeight}px)`,
              }}
            />
            <DataTable
              columns={columns}
              data={data}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              headerRowRef={headerRowRef}
            />
          </div>
        );
      }} */}
      <div className="absolute inset-0 bottom-2.5  border border-t-0 border-line-gray">
        <ScrollArea className="h-full w-full ">
          <DataTable
            columns={columns}
            data={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
