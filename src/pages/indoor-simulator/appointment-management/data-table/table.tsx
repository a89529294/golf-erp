import {
  ColumnDef,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "@/types-and-schemas/appointment";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useImperativeHandle, useState } from "react";

import { Row } from "@/pages/indoor-simulator/appointment-management/data-table/row";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  return (row.getValue(columnId) as string)
    .toLowerCase()
    .includes(value.toLowerCase());
};

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentDataRef: React.MutableRefObject<{
    exportDataAsXlsx: (storeName?: string, data?: TData[]) => void;
  }>;
  page?: number;
  setPage?: (page: number) => void;
  totalPages?: number;
  onSortChange?: (sortField: string, sortOrder: string) => void;
  height: number;
}

export function DataTable<TData extends Appointment, TValue>({
  columns,
  data,
  currentDataRef,
  page,
  setPage,
  totalPages,
  onSortChange,
  height,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startTime", desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    getRowId: (originalRow) => originalRow.id,
    onSortingChange: (updater) => {
      // Handle the sorting state update
      const nextState =
        typeof updater === "function" ? updater(sorting) : updater;

      setSorting(nextState);
      console.log(nextState);

      // Trigger server-side sorting if a handler is provided
      if (onSortChange && nextState.length > 0) {
        const sortField = nextState[0].id;
        const sortOrder = nextState[0].desc ? "DESC" : "ASC";
        onSortChange(sortField, sortOrder);
      } else if (onSortChange && nextState.length === 0) {
        // Clear sorting
        onSortChange("", "");
      }
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  useImperativeHandle(currentDataRef, () => {
    return {
      exportDataAsXlsx: (storeName?: string, allAppointments?: TData[]) => {
        const dataRows =
          allAppointments ?? table.getRowModel().rows.map((r) => r.original);
        const data = dataRows.map((original) => {
          const originAmount =
            original.originAmount ??
            original.amount + (original.usedCoupon?.[0]?.amount ?? 0);
          const percentOff = (
            ((originAmount - original.amount) / originAmount) *
            100
          ).toFixed(2);

          return {
            訂單編號: original.id,
            名稱: original.appUser?.chName,
            電話: original.appUser?.phone,
            開始時間: original.startTime,
            結束時間: original.endTime,
            付款方式: original.order?.paymentMethod ?? "",
            狀態: original.status,
            原訂單金額: originAmount,
            折數: percentOff,
            優惠券名稱: original.usedCoupon?.[0]?.name,
            優惠券金額: original.usedCoupon?.[0]?.amount,
            折扣: originAmount - original.amount,
            實際付款金額: original.amount,
            發票號碼: original.order?.invoice?.invoiceNumber,
          };
        });

        if (data.length === 0) {
          alert("沒有資料可匯出");
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        // Calculate the maximum width for each column
        const columnWidths = (
          Object.keys(data[0]) as (keyof (typeof data)[0])[]
        ).map((key) => {
          const maxLength = Math.max(
            String(key).length * 2, // header length
            ...data.map((row) => {
              return row[key] ? (row[key]?.toString().length ?? 0) : 0;
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
    <div className="relative flex-1 flex-col border border-t-0 border-line-gray">
      <div className="relative " style={{ height: height - 150 }}>
        <div className="absolute inset-0">
          <ScrollArea className="h-full">
            <Table
              outerDivClassName="w-auto "
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
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, i) => {
                    return <Row key={i} row={row} />;
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
        </div>
      </div>

      {!!page && setPage && !!totalPages && (
        <DataTablePagination
          currentPage={page}
          totalPages={totalPages}
          setPage={setPage}
          paginationStyle={{ bottom: 20 }}
        />
      )}
    </div>
  );
}
