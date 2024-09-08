import { MainLayout } from "@/layouts/main-layout";
import { coachesQuery, loader } from "@/pages/coach-management/loader";
import { DataTable } from "@/pages/coach-management/data-table/data-table";
import { columns } from "@/pages/coach-management/data-table/columns";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export function Component() {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: coaches } = useQuery({
    ...coachesQuery,
    initialData,
  });

  return (
    <MainLayout>
      {({ height }) => {
        return (
          <div className="flex w-full flex-col border border-t-0 border-line-gray bg-light-gray px-1">
            <DataTable
              columns={columns}
              data={coaches}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        );
      }}
    </MainLayout>
  );
}
