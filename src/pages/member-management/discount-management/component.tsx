import { MainLayout } from "@/layouts/main-layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UnderscoredInput } from "@/components/underscored-input.tsx";
import { useEffect, useState } from "react";
import { DesktopMenubar } from "@/pages/member-management/discount-management/components/desktop-menubar.tsx";
import { MobileMenubar } from "@/pages/member-management/discount-management/components/mobile-menubar.tsx";
import { useIsMobile } from "@/hooks/use-is-mobile.ts";
import { useLoaderData } from "react-router-dom";
import {
  appUserDiscountQuery,
  loader,
} from "@/pages/member-management/discount-management/loader.ts";
import { appUserTypeNameOf } from "@/utils/appuser-type.ts";
import { privateFetch } from "@/utils/utils.ts";
import { queryClient } from "@/utils/query-client.ts";
import { AppUserType } from "@/constants/appuser-type.ts";

const AppUserTypeSortTable = {
  [AppUserType.Guest]: 0,
  [AppUserType.CommonUser]: 1,
  [AppUserType.GroupUser]: 2,
  [AppUserType.Coach]: 3,
  [AppUserType.Collaboration]: 4,
};

type DataType = Awaited<ReturnType<typeof loader>>;

export function Component(): React.ReactElement {
  const isMobile = useIsMobile();
  const form = useForm();
  const [isEditing, setIsEditing] = useState(false);

  const initialData = useLoaderData() as DataType;
  const { data } = useQuery({
    ...appUserDiscountQuery,
    initialData,
  });

  function setFormValues(values: DataType) {
    values.forEach((appUserDiscount) => {
      form.setValue(
        appUserDiscount.appUserType,
        Math.floor(Number(appUserDiscount.discount) * 100),
      );
    });
  }

  // refresh form data
  useEffect(() => {
    console.log("Update data...");
    data.sort(
      (a, b) =>
        (AppUserTypeSortTable[a.appUserType] ?? 0) -
        (AppUserTypeSortTable[b.appUserType] ?? 0),
    );
    form.reset();
    setFormValues(data);
  }, [form, data]);

  function startEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setFormValues(data);
  }

  const { mutate, isPending } = useMutation<
    void,
    Error,
    Record<string, number>
  >({
    mutationKey: ["update-appuser-discounts"],
    mutationFn: async (variables) => {
      // find changed fields
      const changedFields = Object.entries(variables)
        .map(([userType, discount]) => {
          const appUser = data.find((d) => d.appUserType === userType);

          if (!appUser) {
            return undefined;
          }

          const originalDiscountStr = appUser.discount;
          const discountNum = Number(discount);

          if (discountNum === Math.floor(Number(originalDiscountStr) * 100)) {
            return undefined;
          }

          return {
            appUserId: appUser.id,
            appUserType: appUser.appUserType,
            discountNum,
          };
        })
        .filter((a) => a);

      console.log({ changedFields });
      // 這裡需要根據你的 API 來更新數據
      const responsePromises = changedFields.map((changed) =>
        privateFetch(`/app-users/app-user-discount/${changed!.appUserId}`, {
          method: "PATCH",
          body: JSON.stringify({
            discount: Number(changed!.discountNum) / 100,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      await Promise.all(responsePromises);
    },
    onSuccess() {
      toast.success("折扣更新成功");
      setIsEditing(false);
      return queryClient.invalidateQueries({
        queryKey: ["appUser", "discount"],
      });
    },
    onError() {
      toast.error("折扣更新失敗");
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
        isMobile ? (
          <MobileMenubar
            isPending={isPending}
            isEditing={isEditing}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            onSubmit={async () => {
              const success = await form.trigger();
              if (success) onSubmit();
            }}
          />
        ) : (
          <DesktopMenubar
            isPending={isPending}
            isEditing={isEditing}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
          />
        )
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          會員身份折扣管理
        </h1>
        <Form {...form}>
          <form
            id="discount-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-1/2 space-y-10 self-center px-20 sm:w-full sm:self-stretch sm:px-4"
          >
            <section className="space-y-6 border border-line-gray bg-white px-12 py-10 sm:px-2 sm:py-4">
              <div className="flex w-full flex-col gap-10 bg-white p-4">
                {data?.map((appUser) => (
                  <div key={appUser.id} className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name={appUser.appUserType}
                      render={({ field }) => (
                        <FormItem className="flex items-baseline space-x-3 space-y-0">
                          <FormLabel className="w-16 sm:w-20">
                            {appUserTypeNameOf(appUser.appUserType)}
                          </FormLabel>
                          <FormControl>
                            <UnderscoredInput
                              placeholder={`請輸入折數`}
                              className="h-7 w-1/5 p-0 pb-1 sm:grow sm:text-center"
                              disabled={!isEditing}
                              {...field}
                              type="number"
                              min={0}
                              max={100}
                              onChange={(e) => {
                                field.onChange(e);
                                form.clearErrors(appUser.appUserType);
                              }}
                            />
                          </FormControl>
                          <span>%</span>
                          <FormMessage className="col-start-2" />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </section>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
