import backIcon from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { MemberForm } from "../components/member-form";
import { memberFormSchema } from "../schemas";
import { useMutation } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";

export function Component() {
  const form = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      cardNumber: "",
      memberType: "guest",
      chName: "",
      phone: "",
      gender: "unknown",
      birthday: "",
    },
  });
  const { mutate } = useMutation<
    z.infer<typeof memberFormSchema>,
    Error,
    z.infer<typeof memberFormSchema>
  >({
    mutationKey: ["add-new-member"],
    mutationFn: async (variables) => {
      const response = await privateFetch("/app-users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...variables,
          appUserType: variables.memberType,
          account: variables.cardNumber,
        }),
      });

      return await response.json();
    },
  });

  function onSubmit(values: z.infer<typeof memberFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    mutate({
      ...values,
    });
  }

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            className={button()}
            to={linksKV["member-management"].paths["index"]}
          >
            <img src={backIcon} />
            返回
          </Link>
          <IconButton icon="save" type="submit" form="member-form">
            儲存
          </IconButton>
        </>
      }
    >
      <MemberForm form={form} disabled={false} onSubmit={onSubmit} />
    </MainLayout>
  );
}
