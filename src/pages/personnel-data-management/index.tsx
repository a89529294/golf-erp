import { SearchInput } from "@/components/search-input";
import { IconButton } from "@/components/ui/button";
import { MainLayout } from "@/layouts/main-layout";
import { columns } from "@/pages/personnel-data-management/data-table/columns";
import { DataTable } from "@/pages/personnel-data-management/data-table/data-table";
import { loader } from "@/pages/personnel-data-management/loader";
import { linksKV } from "@/utils/links";
import { Link, useLoaderData } from "react-router-dom";

export default function PersonnelDataManagement() {
  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;

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
