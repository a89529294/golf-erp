import backIcon from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { z } from "zod";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MemberForm } from "../components/member-form";
import { genMemberDetailsQuery, loader } from "./loader";
import { memberFormSchema } from "../schemas";

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
      cardNumber: data.cardNumber,
      memberType: data.appUserType,
      chName: data.chName,
      phone: data.phone,
      gender: data.gender,
      birthday: new Date(data.birthday),
    },
  });

  function onSubmit(values: z.infer<typeof memberFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
              onClick={() => setDisabled(false)}
            >
              編輯
            </IconButton>
          ) : (
            <IconButton icon="save" type="submit" form="edit-member-form">
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <MemberForm form={form} disabled={disabled} onSubmit={onSubmit} />
    </MainLayout>
  );
}
