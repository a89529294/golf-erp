import back from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { formSchema } from "..";
import { AddressFields } from "../components/address-fields";
import { AppointmentDatePicker } from "../components/appointment-date-picker";
import { FeeFormField } from "../components/fee-form-field";
import { HeadcountFormField } from "../components/headcount-form-field";
import { TextFormField } from "../components/text-form-field";
import { UnderscoredInput } from "@/components/underscored-input";
import pfp from "@/assets/pfp-outline.svg";
import { TimeFormField } from "../components/time-form-field";

export function Component() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      time: "",
      site: "",
      price: "",
      county: "",
      district: "",
      address: "",
      headcount: "",
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
      <div className="mb-1 flex w-full flex-col border border-line-gray p-1">
        <header className="mb-12 bg-light-gray py-2.5 text-center text-black">
          編輯邀約
        </header>
        <Form {...form}>
          <form
            id="appointment-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-[600px] flex-1 flex-col self-center border border-line-gray"
          >
            <header className="bg-light-gray py-2.5 text-center text-black">
              邀約資料
            </header>
            <div className="flex-1 space-y-7 px-12 py-10">
              <TextFormField name="title" label="標題" />
              <AppointmentDatePicker />
              <TimeFormField />
              <TextFormField name="site" label="球場" />
              <FeeFormField />
              <AddressFields />
              <HeadcountFormField />
            </div>
          </form>
          <div className="w-[600px] self-center border border-t-0 border-line-gray ">
            <header className=" bg-light-gray py-2.5 text-center text-black">
              參與人員
            </header>
            <div className="px-12 py-10">
              <div className="grid grid-cols-[1fr_415px] items-baseline">
                <label>參與人員</label>
                <div className="flex items-center gap-2">
                  <div className="grid size-10 place-items-center rounded-full border border-line-gray bg-light-gray">
                    <img className="" src={pfp} />
                  </div>
                  <UnderscoredInput className="flex-1" />
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </MainLayout>
  );
}
