import back from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { z } from "zod";
import { formSchema } from "..";
import { InvitationForm } from "../components/invitation-form";
import { loader, storesWithoutEmployeesQuery } from "./loader";
import { membersQuery } from "@/pages/member-management/loader";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";

export function Component() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...storesWithoutEmployeesQuery,
    initialData: initialData.stores,
  });
  const { data: appUsers } = useQuery({
    ...membersQuery,
    initialData: initialData.appUsers,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      introduce: "",
      time: "",
      storeId: "",
      price: "",
      county: "",
      district: "",
      address: "",
      headcount: "",
      host: "",
      members: [],
    },
  });
  const { mutate: addNewInvitation, isPending } = useMutation({
    mutationKey: ["add-new-invitation"],
    mutationFn: async () => {
      const values = form.getValues();
      console.log(values);

      await privateFetch(`/store/${values.storeId}/golf/invite`, {
        method: "POST",
        body: JSON.stringify({
          title: values.title,
          introduce: values.introduce,
          inviteDateTime: `${values.date.getFullYear()}-${(values.date.getMonth() + 1).toString().padStart(2, "0")}-${values.date.getDate().toString().padStart(2, "0")}T${values.time}Z`,
          price: values.price,
          inviteCount: values.headcount,
          hostId:
            typeof values.host === "string" ? values.host : values.host.id,
          memberIds: values.members.map((m) => m.id),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("成功新增");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      navigate("/golf/invitation-management");
    },
  });

  function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addNewInvitation();
  }

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            to={linksKV.golf.subLinks["invitation-management"].paths.index}
            className={button()}
          >
            <img src={back} />
            返回
          </Link>
          <IconButton icon="save" form="appointment-form" type="submit">
            儲存
          </IconButton>
        </>
      }
    >
      <InvitationForm
        form={form}
        onSubmit={onSubmit}
        stores={stores.data}
        disabled={isPending}
        appUsers={appUsers}
      />
    </MainLayout>
  );
}
