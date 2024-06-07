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
import React from "react";

export function Component() {
  const [formDisabled, setFormDisabled] = React.useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "測試1",
      time: "06:11",
      site: "測試球場",
      date: new Date(),
      fee: "100",
      county: "",
      district: "",
      address: "",
      headcount: "5",
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
              to={linksKV.golf.subLinks["appointment-management"].paths.index}
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
      <div className="flex flex-col w-full p-1 mb-1 border border-line-gray">
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
            <div className="flex-1 px-12 py-10 space-y-7">
              <TextFormField
                name="title"
                label="標題"
                disabled={formDisabled}
              />
              <AppointmentDatePicker disabled={formDisabled} />
              <TextFormField name="time" label="時段" disabled={formDisabled} />
              <TextFormField name="site" label="球場" disabled={formDisabled} />
              <FeeFormField disabled={formDisabled} />
              <AddressFields disabled={formDisabled} />
              <HeadcountFormField disabled={formDisabled} />
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
                  <div className="grid border rounded-full size-10 place-items-center border-line-gray bg-light-gray">
                    <img className="" src={pfp} />
                  </div>
                  <UnderscoredInput
                    disabled={formDisabled}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </MainLayout>
  );
}
