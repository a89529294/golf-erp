import { FormSelect } from "@/components/form-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schemas";

export function StoreFormAddressSelectFields({
  form,
  names,
  label,
  counties,
  districts,
  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  names: [
    Exclude<keyof z.infer<typeof formSchema>, "employees">,
    Exclude<keyof z.infer<typeof formSchema>, "employees">,
    Exclude<keyof z.infer<typeof formSchema>, "employees">,
  ];
  label: string;
  counties: { countyname: string; countycode: string }[];
  districts: { townname: string }[] | undefined;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-[270fr_186fr] gap-3">
      <FormSelect
        name="county"
        formItemClass="grid grid-cols-[auto_1fr] items-baseline gap-y-1"
        disabled={disabled}
        label="地址"
        labeClassName="w-28"
        placeholder="選擇縣市"
        options={counties}
        optionKey="countycode"
        optionValue="countyname"
        onValueChange={() => {
          form.resetField("district");
        }}
      />
      <FormSelect
        name="district"
        formItemClass="flex flex-col gap-1"
        disabled={disabled}
        placeholder={form.watch("county") ? "選擇鄉鎮" : "先選擇縣市"}
        options={districts}
        optionKey="townname"
        optionValue="townname"
      />

      <FormField
        control={form.control}
        name={names[2]}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1 ">
            <div className="flex items-baseline ">
              <div className="w-28" />
              <FormControl>
                <Input
                  className={cn(
                    "h-7 w-[186px] rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                    field.value && "border-b-orange",
                  )}
                  placeholder={`請輸入${label}`}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
            </div>
            <FormMessage className="ml-[76px]" />
          </FormItem>
        )}
      />
    </div>
  );
}
