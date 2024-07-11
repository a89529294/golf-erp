import plusIcon from "@/assets/plus-icon.svg";
import { SearchInput } from "@/components/search-input";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { DataTable } from "./data-table/data-table.tsx";
import { columns, mobileColumns } from "./data-table/columns.tsx";
import { loader, membersQuery } from "@/pages/member-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import useMediaQuery from "@/hooks/use-media-query.ts";

export function Component() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  console.log(isMobile);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...membersQuery,
    initialData,
  });

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            className={button()}
            to={linksKV["member-management"].paths["new"]}
          >
            <img src={plusIcon} />
            新增會員
          </Link>

          <SearchInput
            className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      <div className="w-full border border-line-gray bg-light-gray p-1 pt-0">
        <DataTable
          columns={isMobile ? mobileColumns : columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </MainLayout>
  );
}
