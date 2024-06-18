import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

export function QueryParamSelect<T extends Record<string, string>>({
  disabled,
  options,
  optionKey,
  optionValue,
  placeholder,
  queryKey,
}: {
  disabled?: boolean;
  options: T[];
  optionKey: keyof T;
  optionValue: keyof T;
  placeholder: string;
  queryKey: string;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const value = searchParams.get(queryKey);

  const onValueChange = useCallback(
    (v: string, replace: boolean) => {
      navigate(`/indoor-simulator/appointment-management?storeId=${v}`, {
        replace,
      });
    },
    [navigate],
  );

  useEffect(() => {
    if (value) return;
    onValueChange(options[0].id, true);
  }, [value, onValueChange, options]);

  return (
    <Select
      disabled={disabled}
      value={value ?? ""}
      onValueChange={(v) => {
        onValueChange(v, false);
      }}
    >
      <SelectTrigger
        className={cn(
          "w-[186px] rounded-none border-0 border-b border-b-secondary-dark p-1",
          value && "border-b-orange",
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {options?.map((option) => (
          <SelectItem value={option[optionKey]} key={option[optionKey]}>
            {option[optionValue]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
