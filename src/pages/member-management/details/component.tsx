import backIcon from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { z } from "zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MemberForm } from "../components/member-form";
import { genMemberDetailsQuery, loader } from "./loader";
import { memberFormSchema } from "../schemas";
import { privateFetch } from "@/utils/utils";
import { filterObject } from "@/utils";
import { toast } from "sonner";

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

      return privateFetch(`/app-users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...x,
          appUserType: x.memberType,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("更新成功");
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
    onError() {
      toast.error("更新失敗");
    },
  });

  function onSubmit(values: z.infer<typeof memberFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    mutate();
  }

  return (
    <MainLayout
      headerChildren={
        <>
          {disabled === true ? (
            <Link
              className={button()}
              to={linksKV["member-management"].paths["index"]}
            >
              <img src={backIcon} />
              返回
            </Link>
          ) : (
            <button
              type="button"
              className={button()}
              onClick={() => setDisabled(true)}
            >
              <img src={backIcon} />
              返回
            </button>
          )}
          {disabled === true ? (
            <IconButton
              icon="pencil"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setDisabled(false);
              }}
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
      <MemberForm
        form={form}
        disabled={disabled || isPending}
        onSubmit={onSubmit}
      />
    </MainLayout>
  );
}
