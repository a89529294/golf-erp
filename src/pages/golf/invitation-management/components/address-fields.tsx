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
import { UnderscoredInput } from "@/components/underscored-input";
import { SimpleStore } from "@/utils/types";
import { FieldPath, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "..";
import { TextFormField } from "./text-form-field";

export function AddressFields({
  disabled,
  stores,
}: {
  disabled?: boolean;
  stores: SimpleStore[];
}) {
  return (
    <>
      <StoreSelectField stores={stores} disabled={disabled} />
      <fieldset className="flex items-baseline gap-5">
        <label className="flex-1 shrink-0 sm:w-20 sm:flex-initial sm:whitespace-nowrap">
          球場地址
        </label>
        <div className="grid w-[415px] auto-rows-[32px] grid-cols-[176fr_227fr] gap-3 sm:flex sm:w-auto sm:flex-col">
          <DisabledTextFormField name="county" />
          <DisabledTextFormField name="district" />
          <TextFormField
            name="address"
            className="col-span-2 sm:flex"
            placeholder=""
            textLeft
            disabled={true}
            // value={form.watch("address")}
          />
        </div>
      </fieldset>
    </>
  );
}

function StoreSelectField({
  stores,
  disabled,
}: {
  stores: SimpleStore[];
  disabled?: boolean;
}) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="storeId"
      render={({ field }) => (
        <FormItem className="grid grid-cols-[1fr_415px] items-baseline sm:grid-cols-[80px_1fr]">
          <FormLabel>球場</FormLabel>
          <Select
            onValueChange={(storeId) => {
              field.onChange(storeId);
              form.setValue(
                "county",
                stores.find((s) => s.id === storeId)!.county,
              );
              form.setValue(
                "district",
                stores.find((s) => s.id === storeId)!.district,
              );
              form.setValue(
                "address",
                stores.find((s) => s.id === storeId)!.address,
              );
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger
                disabled={disabled}
                className="h-full rounded-none border-0 border-b border-secondary-dark p-1 [&>span]:w-full"
              >
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-52">
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}

function DisabledTextFormField({
  name,
}: {
  name: FieldPath<z.infer<typeof formSchema>>;
}) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <UnderscoredInput
              {...field}
              className="h-8 p-1 text-left"
              disabled
              value={form.watch(name)}
            />
          </FormControl>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
