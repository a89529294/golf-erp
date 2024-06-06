import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { TextFormField } from "./text-form-field";
import { useQuery } from "@tanstack/react-query";
import { countyQuery, generateDistrictQuery } from "@/api/county-district";

export function AddressFields({ disabled }: { disabled?: boolean }) {
  return (
    <fieldset className="flex items-baseline gap-5">
      <label className="flex-1">球場地址</label>
      <div className="grid w-[415px] auto-rows-[32px] grid-cols-[176fr_227fr] gap-3">
        <SelectField name="county" placeholder="請選城市" disabled={disabled} />
        <SelectField
          name="district"
          placeholder="請選鄉鎮"
          disabled={disabled}
        />
        <TextFormField
          name="address"
          placeholder="請填剩餘地址"
          className="col-span-2 "
          textLeft
          disabled={disabled}
        />
      </div>
    </fieldset>
  );
}

function SelectField({
  name,
  placeholder,
  disabled,
}: {
  name: "county" | "district";
  placeholder: string;
  disabled?: boolean;
}) {
  const form = useFormContext();
  const { data: counties } = useQuery({
    ...countyQuery,
  });

  const currentCounty = form.watch("county");
  const { data: districts } = useQuery({
    ...generateDistrictQuery(currentCounty),
    enabled: !!currentCounty,
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                disabled={disabled}
                className="h-full rounded-none border-0 border-b border-secondary-dark p-1"
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {name === "county"
                ? counties?.map((c) => (
                    <SelectItem key={c.countycode} value={c.countycode}>
                      {c.countyname}
                    </SelectItem>
                  ))
                : districts?.map((d) => (
                    <SelectItem value={d.townname}>{d.townname}</SelectItem>
                  ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
