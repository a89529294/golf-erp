import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    password: z.string().min(6, "密碼至少需要6個字元"),
    confirmPassword: z.string().min(6, "密碼至少需要6個字元"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  dialogTriggerChildren: ReactNode;
  userId: string;
}

export function ChangePasswordModal({
  dialogTriggerChildren,
  userId,
}: ChangePasswordModalProps) {
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (data: ChangePasswordForm) => {
      console.log(data);
      const response = await privateFetch(`/app-users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          password: data.password,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
    onSuccess() {
      toast.success("密碼更新成功");
      form.reset();
      setOpen(false);
    },
    onError() {
      toast.error("密碼更新失敗");
    },
  });

  function onSubmit(data: ChangePasswordForm) {
    setConfirmationOpen(true);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>
      <DialogContent className="flex flex-col items-center pb-5">
        <DialogHeader className="w-full">
          <div className="flex w-full flex-col">
            <header className="bg-light-gray py-2 text-center">修改密碼</header>
            <div className="flex flex-1 items-center justify-center">
              <div className="flex w-[400px] flex-col gap-6 px-10 sm:w-72 sm:gap-3 sm:px-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-10 flex flex-col space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-5">
                            <h2 className="w-20 shrink-0 ">新密碼</h2>
                            <FormControl>
                              <Input
                                type="password"
                                className="w-80 border-b border-line-gray bg-transparent px-0 pl-2 sm:w-auto sm:min-w-0 sm:flex-1"
                                {...field}
                              />
                            </FormControl>
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-5">
                            <h2 className="w-20 shrink-0">確認密碼</h2>
                            <FormControl>
                              <Input
                                type="password"
                                className="w-80 border-b border-line-gray bg-transparent px-0 pl-2 sm:w-auto sm:min-w-0 sm:flex-1"
                                {...field}
                              />
                            </FormControl>
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="mt-8 justify-center">
                      <TextButton type="submit" disabled={loading}>
                        確定
                      </TextButton>
                      <DialogPrimitive.Close asChild>
                        <TextWarningButton disabled={loading}>
                          取消
                        </TextWarningButton>
                      </DialogPrimitive.Close>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="px-4 py-2">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <div className="text-base text-black">請問是否確認無誤？</div>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <TextButton
              loading={loading}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                mutate(form.getValues());
                setLoading(false);
                setConfirmationOpen(false);
              }}
            >
              確定
            </TextButton>
            <DialogPrimitive.Close asChild>
              <TextWarningButton disabled={loading}>取消</TextWarningButton>
            </DialogPrimitive.Close>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
