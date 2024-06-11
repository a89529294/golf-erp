import back from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { z } from "zod";
import { formSchema } from "..";
import { InvitationForm } from "../components/invitation-form";
import { useQuery } from "@tanstack/react-query";
import { storesWithoutEmployeesQuery } from "../new/loader";
import { genInvitationDetailsQuery, loader } from "./loader";
import { membersQuery } from "@/pages/member-management/loader";

export function Component() {
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
      host: invitation.host ?? "",
      members: invitation.members,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
            <IconButton icon="save" form="appointment-form" type="submit">
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <InvitationForm
        form={form}
        onSubmit={onSubmit}
        disabled={formDisabled}
        stores={stores.data}
        appUsers={appUsers}
      />
    </MainLayout>
  );
}
