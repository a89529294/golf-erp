import {
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
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "../schemas";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
      <FormField
        control={form.control}
        name={names[0]}
        render={({ field }) => (
          <FormItem className="grid grid-cols-[auto_1fr] items-baseline gap-y-1">
            <FormLabel className="w-20">{label}</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={(v) => {
                field.onChange(v);
                form.resetField("district");
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "w-[186px] rounded-none border-0 border-b border-b-secondary-dark p-1",
                    field.value && "border-b-orange",
                  )}
                >
                  <SelectValue placeholder="選擇縣市" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-72">
                {counties.map(({ countycode, countyname }) => (
                  <SelectItem value={countycode} key={countycode}>
                    {countyname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage className="col-start-2" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={names[1]}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <div className="flex items-baseline gap-5">
              <Select
                disabled={disabled}
                onValueChange={field.onChange}
                value={form.watch("district")}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-[186px] rounded-none border-0 border-b border-b-secondary-dark p-1",
                      field.value && "border-b-orange",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        form.watch("county") ? "選擇鄉鎮" : "先選擇縣市"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-72">
                  {districts?.map(({ townname }) => (
                    <SelectItem value={townname} key={townname}>
                      {townname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={names[2]}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1 ">
            <div className="flex items-baseline ">
              <div className="w-20" />
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
