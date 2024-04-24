import { columns } from "@/components/personnel-data-management-table/columns";
import { DataTable } from "@/components/personnel-data-management-table/data-table";
import { SearchInput } from "@/components/search-input";
import { IconButton } from "@/components/ui/button";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { personnel } from "@/utils/temp-data";
import { Link } from "react-router-dom";

export default function PersonnelDataManagement() {
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
      <DataTable columns={columns} data={personnel} />
    </MainLayout>
  );
}
