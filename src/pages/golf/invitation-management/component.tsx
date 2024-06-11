import plusIcon from "@/assets/plus-icon.svg";
import { IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import { invitationsQuery, loader } from "./loader";

// const data = [
//   {
//     id: "1",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "2",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "3",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "4",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "5",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "6",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "7",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "8",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "9",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
//   {
//     id: "10",
//     title: "找球咖標題找球咖標題找球咖標題",
//     date: "2024/05/22",
//     time: "06:25",
//     site: "台中國際高爾夫球俱樂部",
//     fee: 2800,
//     headcont: 1,
//   },
// ];

export function Component() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...invitationsQuery,
    initialData,
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
            <IconWarningButton icon="trashCan">刪除</IconWarningButton>
          )}
        </>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </MainLayout>
  );
}
