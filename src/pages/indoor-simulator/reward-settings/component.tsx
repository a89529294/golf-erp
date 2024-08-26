import { loader } from ".";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils.ts";
import { pointSettingSchema } from "@/pages/driving-range/reward-settings/loader.ts";
import { MainLayout } from "@/layouts/main-layout.tsx";
import { StoreSelect } from "@/components/category/store-select.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { UnderscoredInput } from "@/components/underscored-input.tsx";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { queryClient } from "@/utils/query-client.ts";
import { IconButton } from "@/components/ui/button.tsx";
import { DataTable } from "@/components/coupon-management/data-table/data-table.tsx";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  Coupon,
  couponsSchema,
} from "@/pages/driving-range/coupon-management/loader.ts";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Tablet } from "@/components/tablet.tsx";
import { ArrowUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner.tsx";

const category = "simulator";
const navigateTo = "/indoor-simulator/reward-settings";

type DataType = {
  amoutToPointNeed: number;
};

const columnHelper = createColumnHelper<Coupon>();

function genColumns(isSelecting: boolean) {
  return [
    {
      id: "select",
      cell: ({ row }) => (
        <div className="grid h-full place-items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            disabled={!isSelecting || !row.original.isActive}
          />
        </div>
      ),
      size: undefined,
    },
    columnHelper.accessor((row) => (row.isActive ? "有效" : "無效"), {
      id: "isActive",
      header: "",
      cell: (props) => {
        return (
          <div className="flex justify-center ">
            <Tablet
              active={props.cell.row.original.isActive}
              value={props.getValue()}
              activeCn="border-line-green text-line-green"
              inactiveCn="border-word-gray-dark text-word-gray-dark"
            />
          </div>
        );
      },
      size: undefined,
    }),
    columnHelper.accessor("number", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            編號
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => props.getValue(),
      size: undefined,
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            標題
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => props.getValue(),
      size: 30,
    }),

    columnHelper.accessor("expiration", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            使用期限
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => (
        <span className="whitespace-nowrap">{props.getValue()}</span>
      ),
      size: undefined,
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            金額
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => props.getValue(),
      size: undefined,
    }),
  ] as ColumnDef<Coupon>[];
}

export function Component() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");

  const form = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const columns = useMemo(() => genColumns(isEditing), [isEditing]);

  const { data: pointSetting } = useQuery({
    queryKey: ["point-setting", storeId],
    queryFn: async () => {
      // filter by storeId
      const data = await privateFetch(
        `/store/${storeId}/simulator/point-setting`,
      ).then((r) => r.json());
      return pointSettingSchema.parse(data);
    },
    enabled: !!storeId,
  });

  const { data: couponsData, isLoading } = useQuery({
    queryKey: ["coupons", storeId],
    queryFn: async () => {
      // filter by storeId
      const data = await privateFetch(
        `/coupon?populate=store&pageSize=999&filter[store.id]=${storeId}`,
      ).then((r) => r.json());
      const parsedData = couponsSchema.parse(data);
      return parsedData.data;
    },
    enabled: !!storeId,
  });

  function setFormValues(coupons: typeof couponsData, values?: DataType) {
    if (values) {
      form.setValue("amoutToPointNeed", values.amoutToPointNeed);
    } else {
      form.reset();
    }

    const customerViewableCoupons: Record<string, boolean> = {};
    coupons?.forEach((coupon) => {
      if (coupon.isCustomerView) {
        customerViewableCoupons[coupon.id] = true;
      }
    });

    setRowSelection(customerViewableCoupons);
  }

  // refresh form data
  useEffect(() => {
    console.log("Update data...");
    form.reset();
    setFormValues(couponsData, pointSetting);
  }, [form, couponsData, pointSetting]);

  function startEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setFormValues(couponsData, pointSetting);
  }

  const { mutate, isPending } = useMutation<
    void,
    Error,
    Record<string, number>
  >({
    mutationKey: ["update-appuser-discounts"],
    mutationFn: async () => {
      if (!couponsData?.length) {
        throw new Error("Not coupons data exists");
      }

      // find out changed coupons
      const changedCoupons: Array<{ id: string; selected: boolean }> = [];
      couponsData.forEach((coupon) => {
        if (coupon.isCustomerView && !(coupon.id in rowSelection)) {
          changedCoupons.push({ id: coupon.id, selected: false });
        } else if (!coupon.isCustomerView && coupon.id in rowSelection) {
          changedCoupons.push({ id: coupon.id, selected: true });
        }
      });

      console.log({
        form: form.getValues(),
        rowSelection,
        coupons: couponsData,
      });
      console.log({ changedCoupons });

      const responsePromises: Array<ReturnType<typeof privateFetch>> = [];

      // edit point-setting if needed
      const newAmoutToPointNeed = form.getValues().amoutToPointNeed;

      if (!newAmoutToPointNeed) {
        throw new Error(
          `AmoutToPointNeed must be a number value and larger than 0. Received: '${!newAmoutToPointNeed}'`,
        );
      }

      if (newAmoutToPointNeed !== pointSetting?.amoutToPointNeed) {
        responsePromises.push(
          privateFetch(`/store/${storeId}/simulator/point-setting`, {
            method: "PATCH",
            body: JSON.stringify({
              amoutToPointNeed: newAmoutToPointNeed,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }),
        );
      }

      // edit coupons if needed
      changedCoupons.forEach((change) => {
        responsePromises.push(
          privateFetch(`/coupon/${change.id}`, {
            method: "PATCH",
            body: JSON.stringify({ isCustomerView: change.selected }),
            headers: {
              "Content-Type": "application/json",
            },
          }),
        );
      });

      // await all responses
      await Promise.all(responsePromises);
    },
    onSuccess() {
      toast.success("累積點數設定更新成功");
      setIsEditing(false);

      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["coupons", storeId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["point-setting", storeId],
        }),
      ]);
    },
    onError() {
      toast.error("累積點數設定更新失敗");
    },
  });

  function onSubmit() {
    mutate({
      ...form.getValues(),
    });
  }

  return (
    <MainLayout
      headerChildren={
        <>
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateTo}
          />
          {isEditing ? (
            <>
              <IconButton
                icon="save"
                type="button"
                onClick={cancelEdit}
                form="discount-form"
                disabled={isPending}
              >
                返回
              </IconButton>

              <IconButton
                icon="save"
                type="submit"
                form="discount-form"
                disabled={isPending}
              >
                儲存
              </IconButton>
            </>
          ) : (
            <IconButton
              icon="pencil"
              type="button"
              form="discount-form"
              onClick={startEdit}
              disabled={isPending}
            >
              編輯
            </IconButton>
          )}
        </>
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          累積點數設定
        </h1>
        <Form {...form}>
          <form
            id="discount-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-10 self-center px-20 sm:px-4"
          >
            <section className="space-y-6 border border-line-gray bg-white px-12 py-6 sm:px-2 sm:py-4">
              <div className="flex w-full flex-col gap-10 bg-white p-4">
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="amoutToPointNeed"
                    defaultValue={0}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormLabel className="w-1/8">單一消費滿</FormLabel>
                        <FormControl>
                          <UnderscoredInput
                            placeholder={`請輸入金額`}
                            className="h-7 w-1/5 p-0 pb-1"
                            disabled={!isEditing}
                            {...field}
                            type="number"
                            min={1}
                            onChange={(e) => {
                              field.onChange(e);
                              form.clearErrors("amoutToPointNeed");
                            }}
                          />
                        </FormControl>
                        <span>元，即可累積 1 點</span>
                        <FormMessage className="col-start-2" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <header className="flex items-center py-2.5 pl-5 ">
                <span className="font-semibold">選擇可兌換的優惠券</span>
              </header>

              <div className="border-y border-line-gray bg-white text-center">
                <div className="flex w-full flex-col gap-10 bg-white p-4">
                  <ScrollArea className="h-[500px] overflow-auto border-t border-line-gray sm:h-[417px] sm:w-72">
                    {couponsData && (
                      <div className="border-x border-b border-line-gray before:fixed before:h-12 before:w-1 before:bg-light-gray">
                        <div className="fixed right-[57px] h-12 w-1 bg-light-gray" />
                        <div className="sticky top-12 z-10 w-full border-b border-line-gray" />
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <DataTable
                            columns={columns}
                            data={couponsData}
                            rowSelection={rowSelection}
                            setRowSelection={setRowSelection}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            rmTheadMarginTop
                          />
                        )}
                      </div>
                    )}
                    <Scrollbar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
            </section>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}