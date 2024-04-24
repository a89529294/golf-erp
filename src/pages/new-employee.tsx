import { IconButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { MainLayout } from "@/layouts/main-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  idNumber: z.string(),
  name: z.string(),
  phoneno: z.string(),
  category: z.enum(["golf", "simulator", "ground", ""]),
  storeId: z.string(),
});

export default function NewEmployee() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
      name: "",
      phoneno: "",
      category: "",
      storeId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back">返回</IconButton>
          <IconButton icon="save" form="new-employee-form">
            儲存
          </IconButton>
        </>
      }
    >
      <div className="mb-2.5 w-full border border-line-gray p-1">
        <div className="bg-light-gray py-2.5  text-center">建立人員資料</div>
        <Form {...form}>
          <form
            id="new-employee-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center pt-12"
          >
            <section className="flex w-fit flex-col gap-6 border border-line-gray px-16 pb-10">
              <div className="-mx-16 bg-light-gray py-1.5 text-center text-black">
                基本資料
              </div>
              <EmployeeFormField form={form} name={"idNumber"} label="編號" />
              <EmployeeFormField form={form} name={"name"} label="姓名" />
              <EmployeeFormField form={form} name={"phoneno"} label="電話" />
            </section>
            <section className="flex w-fit flex-col gap-6 border border-line-gray px-16 pb-10">
              <div className="-mx-16 bg-light-gray py-1.5 text-center text-black">
                綁定廠商
              </div>
              <EmployeeFormSelectField
                form={form}
                name="category"
                label="類別"
              />
              <EmployeeFormSelectField
                form={form}
                name="storeId"
                label="店名"
              />
            </section>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}

function EmployeeFormField({
  form,
  name,
  label,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-baseline gap-7">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className={cn(
                "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                field.value && "border-b-orange",
              )}
              required
              placeholder={`請輸入${label}`}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EmployeeFormSelectField({
  form,
  name,
  label,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex items-baseline gap-7">
              <FormLabel>{label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark focus:border-b-[1.5px] focus:border-b-orange",
                      field.value && "border-b-orange",
                    )}
                  >
                    <SelectValue placeholder={`選擇${label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="golf">高爾夫</SelectItem>
                  <SelectItem value="simulator">室內模擬器</SelectItem>
                  <SelectItem value="ground">練習場</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  );
}
