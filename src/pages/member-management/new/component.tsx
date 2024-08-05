import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { NewFormDesktopMenubar } from "@/pages/member-management/components/new-form-desktop-menubar";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { MemberForm } from "../components/member-form";
import { memberFormSchema } from "../schemas";
import { NewFormMobileMenubar } from "@/pages/member-management/components/new-form-mobile-menubar";

export function Component() {
  const isMobile = useIsMobile();
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
      isActive: true,
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
      toast.error("新增會員失敗, 請檢查電話格式");
    },
  });

  function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    mutate({
      ...form.getValues(),
    });
  }

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <NewFormMobileMenubar
            isPending={isPending}
            onSubmit={async () => {
              const success = await form.trigger();
              if (success) onSubmit();
            }}
          />
        ) : (
          <NewFormDesktopMenubar isPending={isPending} />
        )
      }
    >
      <div className="mb-2.5 flex w-full flex-col gap-5 border border-line-gray bg-light-gray p-5">
        <MemberForm
          topUpAmount={0}
          spentAmount={0}
          form={form}
          disabled={isPending}
          onSubmit={onSubmit}
          newMemberForm
        />
      </div>
    </MainLayout>
  );
}
