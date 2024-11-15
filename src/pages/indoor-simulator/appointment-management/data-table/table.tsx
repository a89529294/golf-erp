import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction, useImperativeHandle, useState } from "react";
import { Appointment } from "@/types-and-schemas/appointment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DataTablePagination } from "@/pages/member-management/members/data-table/data-table-pagination";
import { Spinner } from "@/components/ui/spinner";

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  return (row.getValue(columnId) as string)
    .toLowerCase()
    .includes(value.toLowerCase());
};

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentDataRef: React.MutableRefObject<{ exportDataAsXlsx: () => void }>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  isLoading: boolean;
}

export function DataTable<TData extends Appointment, TValue>({
  columns,
  data,
  page,
  setPage,
  totalPages,
  currentDataRef,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    getRowId: (originalRow) => originalRow.id,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  useImperativeHandle(currentDataRef, () => {
    return {
      exportDataAsXlsx: (storeName?: string) => {
        const data = table.getRowModel().rows.map((r) => {
          const originAmount =
            r.original.originAmount ??
            r.original.amount + (r.original.usedCoupon?.[0]?.amount ?? 0);
          const percentOff = (
            ((originAmount - r.original.amount) / originAmount) *
            100
          ).toFixed(2);

          return {
            訂單編號: r.original.id,
            名稱: r.original.appUser?.chName,
            電話: r.original.appUser?.phone,
            開始時間: r.original.startTime,
            結束時間: r.original.endTime,
            付款方式: r.original.order?.paymentMethod ?? "現金",
            狀態: r.original.status,
            原訂單金額: originAmount,
            折數: percentOff,
            優惠券名稱: r.original.usedCoupon?.[0]?.name,
            優惠券金額: r.original.usedCoupon?.[0]?.amount,
            折扣: originAmount - r.original.amount,
            實際付款金額: r.original.amount,
          };
        });
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Calculate the maximum width for each column
        const columnWidths = (
          Object.keys(data[0]) as (keyof (typeof data)[0])[]
        ).map((key) => {
          const maxLength = Math.max(
            key.length * 2, // header length
            ...data.map((row) => {
              return row[key] ? row[key]?.toString().length ?? 0 : 0;
            }), // max length of each cell in the column
          );
          return { wch: maxLength + 2 }; // add padding for better readability
        });

        worksheet["!cols"] = columnWidths; // Set column widths in the worksheet

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, `${storeName}-預約記錄.xlsx`);
      },
    };
  });

  return (
    <div className="relative flex-1 border border-t-0 border-line-gray">
      <div className="absolute inset-0 ">
        <ScrollArea className="absolute bottom-14">
          <Table
            outerDivClassName="w-auto"
            className="w-auto min-w-full border-separate border-spacing-0"
          >
            <TableHeader className="[&_tr]:border-b-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="sticky top-0 bg-light-gray "
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="border-t border-line-gray"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className={isLoading ? "absolute inset-0 top-12" : ""}>
              {isLoading ? (
                <TableRow className="absolute inset-0">
                  <TableCell
                    colSpan={6}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => {
                  const originAmount =
                    row.original.originAmount ??
                    row.original.amount +
                      (row.original.usedCoupon?.[0]?.amount ?? 0);
                  const percentOff = (
                    ((originAmount - row.original.amount) / originAmount) *
                    100
                  ).toFixed(2);

                  return (
                    <>
                      <TableRow
                        key={row.id + "1"}
                        data-state={row.getIsSelected() && "selected"}
                        className="hl-next-tr group bg-white"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            // className="border-b border-line-gray"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow
                        key={row.id + "2"}
                        data-state={row.getIsSelected() && "selected"}
                        className="group bg-white"
                      >
                        <TableCell
                          colSpan={6}
                          className="border-b border-line-gray pt-0"
                        >
                          <div className="flex gap-2.5">
                            <div className="flex  gap-7 rounded border border-line-gray bg-black/5 px-3 py-2.5">
                              <div className="w-24">
                                <p className="text-sm font-medium text-secondary-dark">
                                  付款方式
                                </p>
                                <p className="text-secondary-purple ">
                                  {row.original.order?.paymentMethod ?? "現金"}
                                </p>
                              </div>
                              <div className="w-14">
                                <p className="text-sm font-medium text-secondary-dark">
                                  狀態
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.status}
                                </p>
                              </div>
                            </div>

                            <div className="flex  gap-7 rounded border border-line-gray bg-black/5 px-3 py-2.5">
                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  原訂單金額
                                </p>
                                <p className="text-secondary-purple">
                                  {originAmount}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  折數%
                                </p>
                                <p className="text-secondary-purple">
                                  {percentOff}
                                </p>
                              </div>

                              <div className="w-36 ">
                                <p className="text-sm font-medium text-secondary-dark">
                                  優惠券名稱
                                </p>
                                <p className="truncate text-secondary-purple">
                                  {row.original.usedCoupon?.[0]?.name}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  優惠券金額
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.usedCoupon?.[0]?.amount}
                                </p>
                              </div>

                              <div className="w-10">
                                <p className="text-sm font-medium text-secondary-dark">
                                  折扣
                                </p>
                                <p className="text-secondary-purple">
                                  {originAmount - row.original.amount}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  實際付款金額
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.amount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    查無資料
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Scrollbar orientation="horizontal" />
        </ScrollArea>
        <DataTablePagination
          currentPage={page}
          setPage={setPage}
          totalPages={totalPages}
          paginationStyle={{
            position: "absolute",
            bottom: 8,
          }}
        />
      </div>
    </div>
  );
}
