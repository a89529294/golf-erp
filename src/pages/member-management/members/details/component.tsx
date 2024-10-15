import { MainLayout } from "@/layouts/main-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoaderData, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { DesktopMenubar } from "@/pages/member-management/members/components/desktop-menubar";
import { MobileMenubar } from "@/pages/member-management/members/components/mobile-menubar";
import { filterObject } from "@/utils";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MemberForm } from "../components/member-form";
import { memberFormSchema } from "../schemas";
import {
  spendingHistoryColumns,
  topUpHistorycolumns,
  couponHistorycolumns,
} from "./columns";
import { genMemberDetailsQuery, loader } from "./loader";

type MemberHistory = "top-up-history" | "spending-history" | "coupon-history";

export function Component() {
  const [searchParams] = useSearchParams();
  const [memberHistory, setMemberHistory] =
    useState<MemberHistory>("top-up-history");
  const { id } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genMemberDetailsQuery(id!, searchParams.get("storeId") ?? undefined),
    initialData,
  });
  const [disabled, setDisabled] = useState(true);
  const form = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      account: data.account,
      memberType: data.appUserType,
      chName: data.chName,
      phone: data.phone ?? "",
      gender: data.gender,
      birthday: data.birthday ? new Date(data.birthday) : "",
      isActive: data.isActive,
    },
  });
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["patch-app-user"],
    mutationFn: async () => {
      const x = filterObject(
        form.getValues(),
        Object.keys(
          form.formState.dirtyFields,
        ) as (keyof typeof form.formState.dirtyFields)[],
      );

      const response = await privateFetch(`/app-users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...x,
          appUserType: x.memberType,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    },
    onSuccess() {
      toast.success("更新成功");
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
      setDisabled(true);
    },
    onError() {
      toast.error("更新失敗");
    },
  });
  const { mutate: toggleMemberStatus, isPending: isUpdatingMemberStatus } =
    useMutation({
      mutationKey: ["update-member-status"],
      mutationFn: async () => {
        const response = await privateFetch(`/app-users/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !data.isActive,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        return await response.json();
      },
      onSuccess() {
        toast.success("更新狀態成功");
        queryClient.invalidateQueries({ queryKey: ["members"] });
      },
    });

  const isMobile = useIsMobile();

  useEffect(() => {
    form.reset({
      account: data.account,
      memberType: data.appUserType,
      chName: data.chName,
      phone: data.phone ?? "",
      gender: data.gender,
      birthday: data.birthday ? new Date(data.birthday) : "",
      isActive: data.isActive,
    });
  }, [data, form]);

  function onSubmit() {
    mutate();
  }

  return (
    <MainLayout
      headerChildren={
        <>
          {isMobile ? (
            <MobileMenubar
              disabled={disabled}
              isUpdatingMemberStatus={isUpdatingMemberStatus}
              data={data}
              form={form}
              isPending={isPending}
              setDisabled={setDisabled}
              toggleMemberStatus={toggleMemberStatus}
              onSubmit={onSubmit}
            />
          ) : (
            <DesktopMenubar
              disabled={disabled}
              isUpdatingMemberStatus={isUpdatingMemberStatus}
              data={data}
              form={form}
              isPending={isPending}
              setDisabled={setDisabled}
              toggleMemberStatus={toggleMemberStatus}
            />
          )}
        </>
      }
    >
      <div className=" mb-2.5 flex w-full flex-col gap-5 border border-line-gray bg-light-gray p-5">
        <MemberForm
          form={form}
          disabled={disabled || isPending}
          onSubmit={onSubmit}
          topUpAmount={data.appChargeHistories.reduce(
            (acc, val) => acc + val.amount,
            0,
          )}
          spentAmount={
            data.simulatorAppointmens?.reduce(
              (acc, val) => acc + val.amount,
              0,
            ) ?? 0
          }
        />
        <nav className="flex justify-center gap-3">
          <button
            className={cn(
              "rounded-full px-5 py-3",
              memberHistory === "spending-history"
                ? "bg-secondary-dark text-white "
                : "border border-line-gray bg-white",
            )}
            onClick={() => setMemberHistory("spending-history")}
          >
            消費紀錄
          </button>
          <button
            className={cn(
              "rounded-full px-5 py-3",
              memberHistory === "top-up-history"
                ? "bg-secondary-dark text-white "
                : "border border-line-gray bg-white",
            )}
            onClick={() => setMemberHistory("top-up-history")}
          >
            儲值紀錄
          </button>
          <button
            className={cn(
              "rounded-full px-5 py-3",
              memberHistory === "coupon-history"
                ? "bg-secondary-dark text-white "
                : "border border-line-gray bg-white",
            )}
            onClick={() => setMemberHistory("coupon-history")}
          >
            優惠券紀錄
          </button>
        </nav>
        <div className="relative grow sm:h-96">
          <div className="absolute inset-0 ">
            <ScrollArea className="h-full border border-t-0 border-line-gray">
              <GenericDataTable
                columns={
                  memberHistory === "top-up-history"
                    ? topUpHistorycolumns
                    : memberHistory === "spending-history"
                      ? spendingHistoryColumns
                      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (couponHistorycolumns as any)
                }
                data={
                  memberHistory === "top-up-history"
                    ? data.appChargeHistories
                    : memberHistory === "spending-history"
                      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data.simulatorAppointmens ?? ([] as any)
                      : data.appUserCoupons
                }
              />
              <ScrollBar className="hidden sm:block" orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
