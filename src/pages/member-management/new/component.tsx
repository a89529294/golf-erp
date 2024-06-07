import backIcon from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { MemberForm } from "../components/member-form";
import { memberFormSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Component() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      account: "",
      memberType: "guest",
      chName: "",
      phone: "",
      gender: "unknown",
      birthday: "",
    },
  });
  const { mutate, isPending } = useMutation<
    z.infer<typeof memberFormSchema>,
    Error,
    z.infer<typeof memberFormSchema>
  >({
    mutationKey: ["add-new-member"],
    mutationFn: async (variables) => {
      const { birthday, ...rest } = variables;
      const response = await privateFetch("/app-users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
          ...(birthday && { birthday }),
          appUserType: variables.memberType,
          account: variables.account,
        }),
      });

      return await response.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate(linksKV["member-management"].paths.index);
      toast.success("新增會員成功");
    },
    onError() {
      toast.error("新增會員失敗");
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

  console.log(window.location.pathname);

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            className={cn(
              button(),
              isPending ? "cursor-not-allowed opacity-50" : "",
            )}
            to={
              isPending
                ? window.location.pathname
                : linksKV["member-management"].paths["index"]
            }
          >
            <img src={backIcon} />
            返回
          </Link>

          <IconButton
            icon="save"
            type="submit"
            form="member-form"
            disabled={isPending}
          >
            儲存
          </IconButton>
        </>
      }
    >
      <MemberForm
        coin={0}
        form={form}
        disabled={isPending}
        onSubmit={onSubmit}
      />
    </MainLayout>
  );
}
