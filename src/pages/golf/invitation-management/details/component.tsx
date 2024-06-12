import back from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { formSchema } from "..";
import { InvitationForm } from "../components/invitation-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storesWithoutEmployeesQuery } from "../new/loader";
import { genInvitationDetailsQuery, loader } from "./loader";
import { membersQuery } from "@/pages/member-management/loader";
import { filterObject, fromDateAndTimeToDateTimeString } from "@/utils";
import { InvitationPATCH } from "../loader";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";

export function Component() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { invitationId } = useParams();
  const [formDisabled, setFormDisabled] = React.useState(true);
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...storesWithoutEmployeesQuery,
    initialData: initialData.stores,
  });
  const { data: invitation } = useQuery({
    ...genInvitationDetailsQuery(invitationId!),
    initialData: initialData.invitation,
  });
  const { data: appUsers } = useQuery({
    ...membersQuery,
    initialData: initialData.appUsers,
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["patch-invitation"],
    mutationFn: async (v: InvitationPATCH) => {
      return await privateFetch(`/store/golf/invite/${invitationId}`, {
        method: "PATCH",
        body: JSON.stringify(v),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("更新邀約成功"),
        queryClient.invalidateQueries({ queryKey: ["invitations"] });
      navigate("/golf/invitation-management");
    },
    onError() {
      toast.error("更新邀約失敗");
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: invitation.title,
      introduce: invitation.introduce,
      time: invitation.time,
      storeId: invitation.store.id,
      date: new Date(invitation.date),
      price: invitation.price.toString(),
      county: invitation.store.county,
      district: invitation.store.district,
      address: invitation.store.address,
      headcount: invitation.inviteCount.toString(),
      host: invitation.host,
      members: invitation.members,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const x: InvitationPATCH = {};

    const changedValues = filterObject(
      values,
      Object.keys(
        form.formState.dirtyFields,
      ) as (keyof typeof form.formState.dirtyFields)[],
    );

    if (changedValues.title) x.title = values.title;
    if (changedValues.date || changedValues.time)
      x.inviteDateTime = fromDateAndTimeToDateTimeString(
        values.date,
        values.time,
      );
    if (changedValues.price) x.price = +values.price;
    if (changedValues.headcount) x.inviteCount = +values.headcount;
    if (changedValues.introduce) x.introduce = values.introduce;
    if (changedValues.host) x.hostId = values.host[0].id;
    if (changedValues.members) x.memberIds = values.members.map((m) => m.id);

    mutate(x);
  }

  return (
    <MainLayout
      headerChildren={
        <>
          {formDisabled ? (
            <Link
              to={linksKV.golf.subLinks["invitation-management"].paths.index}
              className={button()}
            >
              <img src={back} />
              返回
            </Link>
          ) : (
            <IconButton icon="back" onClick={() => setFormDisabled(true)}>
              返回
            </IconButton>
          )}
          {formDisabled ? (
            <IconButton
              icon="pencil"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setFormDisabled(false);
              }}
            >
              編輯
            </IconButton>
          ) : (
            <IconButton
              disabled={isPending}
              icon="save"
              form="appointment-form"
              type="submit"
            >
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <InvitationForm
        form={form}
        onSubmit={onSubmit}
        disabled={formDisabled || isPending}
        stores={stores.data}
        appUsers={appUsers}
      />
    </MainLayout>
  );
}
