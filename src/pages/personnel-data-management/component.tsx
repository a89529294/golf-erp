import { SearchInput } from "@/components/search-input";
import { IconButton } from "@/components/ui/button";
import { MainLayout } from "@/layouts/main-layout";
import { columns } from "@/pages/personnel-data-management/data-table/columns";
import { DataTable } from "@/pages/personnel-data-management/data-table/data-table";
import {
  employeesQuery,
  loader,
} from "@/pages/personnel-data-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "react-router-dom";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...employeesQuery,
    initialData,
  });

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="plus">
            <Link
              to={
                linksKV["data-management"].subLinks["personnel-data-management"]
                  .paths.new
              }
            >
              新增人員
            </Link>
          </IconButton>
          <SearchInput />
        </>
      }
    >
      <DataTable columns={columns} data={data} />
    </MainLayout>
  );
}
