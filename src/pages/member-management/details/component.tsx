import backIcon from "@/assets/back.svg";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { z } from "zod";

import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterObject } from "@/utils";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MemberForm } from "../components/member-form";
import { memberFormSchema } from "../schemas";
import { columns } from "./columns";
import { genMemberDetailsQuery, loader } from "./loader";
import { cn } from "@/lib/utils";

export function Component() {
  const { id } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genMemberDetailsQuery(id!),
    initialData,
  });
  const [disabled, setDisabled] = useState(true);

  const form = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      account: data.account,
      memberType: data.appUserType,
      chName: data.chName,
      phone: data.phone,
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
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const refCurrent = ref.current;
    if (!refCurrent) return;

    const heightListener = () => {
      setHeight(refCurrent.clientHeight);
    };

    heightListener();

    ref.current.addEventListener("resize", heightListener);

    return () => refCurrent.removeEventListener("resize", heightListener);
  }, []);

  useEffect(() => {
    form.reset({
      account: data.account,
      memberType: data.appUserType,
      chName: data.chName,
      phone: data.phone,
      gender: data.gender,
      birthday: data.birthday ? new Date(data.birthday) : "",
      isActive: data.isActive,
    });
  }, [data, form]);

  function onSubmit(values: z.infer<typeof memberFormSchema>) {
    console.log(values);
    mutate();
  }

  return (
    <MainLayout
      headerChildren={
        <>
          {disabled === true ? (
            <Link
              className={cn(
                button(),
                isUpdatingMemberStatus && "pointer-events-none opacity-50",
              )}
              to={linksKV["member-management"].paths["index"]}
            >
              <img src={backIcon} />
              返回
            </Link>
          ) : (
            <IconWarningButton
              type="button"
              onClick={() => {
                setDisabled(true);
                form.reset();
              }}
              icon="redX"
              disabled={isPending}
            >
              取消編輯
            </IconWarningButton>
          )}

          {disabled &&
            (data.isActive ? (
              <IconWarningButton
                disabled={isUpdatingMemberStatus}
                onClick={() => toggleMemberStatus()}
                icon="redX"
              >
                停權
              </IconWarningButton>
            ) : (
              <IconButton
                className="bg-secondary-purple/10 text-secondary-purple outline-secondary-purple"
                icon="check"
                onClick={() => toggleMemberStatus()}
                disabled={isUpdatingMemberStatus}
              >
                恢復
              </IconButton>
            ))}

          {disabled === true ? (
            <IconButton
              icon="pencil"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setDisabled(false);
              }}
              disabled={isUpdatingMemberStatus}
            >
              編輯
            </IconButton>
          ) : (
            <IconButton
              disabled={
                Object.keys(form.formState.dirtyFields).length === 0 ||
                isPending
              }
              icon="save"
              type="submit"
              form="member-form"
            >
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <div className="mb-2.5 flex w-full flex-col gap-5 border border-line-gray bg-light-gray p-5">
        <MemberForm
          form={form}
          disabled={disabled || isPending}
          onSubmit={onSubmit}
          coin={data.coin}
        />
        <button className="self-center rounded-full bg-secondary-dark px-5 py-3 text-white">
          儲值紀錄
        </button>
        <div className="grow" ref={ref}>
          {!!height && (
            <ScrollArea style={{ height }}>
              <GenericDataTable
                columns={columns}
                data={data.appChargeHistories}
              />
            </ScrollArea>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
