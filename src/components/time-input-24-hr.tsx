import { ChangeEventHandler, FocusEventHandler } from "react";
import { Input } from "./ui/input"; // Adjust import path as needed
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
import { ControllerRenderProps, FieldValues } from "react-hook-form";

const hourOptions = Array.from({ length: 25 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const minuteOptions = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

export const Time24hrInput = ({
  control,
  name,
  label,
}: {
  control: any;
  name: string;
  label: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      // rules={{
      //   required: "時間為必填",
      //   validate: {
      //     completeTime: (value) => {
      //       if (!value) return "請輸入完整的時間格式 (HH:MM)";

      //       // Remove colons and check if we have exactly 4 digits
      //       const digits = value.replace(/\D/g, "");
      //       if (digits.length !== 4) {
      //         return "請輸入完整的時間格式 (HH:MM)";
      //       }

      //       // Validate the time format
      //       const timeRegex = /^([0-1][0-9]|2[0-4]):([0-5][0-9])$/;
      //       if (value === "24:00") return true; // Special case for 24:00
      //       if (!timeRegex.test(value)) {
      //         return "請輸入有效的時間格式 (00:00-24:00)";
      //       }

      //       return true;
      //     },
      //   },
      // }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">{label}</FormLabel>
          <div className="flex items-center gap-2">
            <HourMinuteSelect {...field} />
          </div>
          <FormMessage />
        </FormItem>
      )}

      // render={({ field, fieldState }) => {
      //   const formatTimeInput = (value: string) => {
      //     // Remove all non-digits
      //     const digits = value.replace(/\D/g, "");

      //     if (digits.length === 0) return "";

      //     // Allow typing without colons - don't auto-format until blur
      //     // But still validate each digit as they type
      //     let validDigits = "";

      //     // Validate first digit (0, 1, or 2 only)
      //     if (/[0-2]/.test(digits[0])) {
      //       validDigits += digits[0];
      //     } else {
      //       return validDigits;
      //     }

      //     if (digits.length >= 2) {
      //       // Validate second digit based on first digit
      //       if (digits[0] === "2") {
      //         // If first digit is 2, second can only be 0,1,2,3,4
      //         if (/[0-4]/.test(digits[1])) {
      //           validDigits += digits[1];
      //         }
      //       } else {
      //         // If first digit is 0 or 1, second can be any digit
      //         if (/[0-9]/.test(digits[1])) {
      //           validDigits += digits[1];
      //         }
      //       }
      //     }

      //     if (digits.length >= 3) {
      //       // Check if we're at 24xx - only allow 2400
      //       if (validDigits === "24") {
      //         if (
      //           digits[2] === "0" &&
      //           (digits.length === 3 || digits[3] === "0")
      //         ) {
      //           validDigits += digits[2];
      //           if (digits.length >= 4) {
      //             validDigits += digits[3];
      //           }
      //         }
      //       } else {
      //         // For other hours, validate minutes (00-59)
      //         if (/[0-5]/.test(digits[2])) {
      //           validDigits += digits[2];
      //           if (digits.length >= 4 && /[0-9]/.test(digits[3])) {
      //             validDigits += digits[3];
      //           }
      //         }
      //       }
      //     }

      //     // If the current value already has colons, preserve the format
      //     if (value.includes(":")) {
      //       if (validDigits.length >= 2) {
      //         return validDigits.length >= 4
      //           ? `${validDigits.slice(0, 2)}:${validDigits.slice(2, 4)}`
      //           : `${validDigits.slice(0, 2)}:${validDigits.slice(2)}`;
      //       }
      //     }

      //     return validDigits;
      //   };

      //   const roundToNearestFiveMinutes = (timeString: string) => {
      //     if (!timeString || timeString.length < 5) return timeString;

      //     const [hours, minutes] = timeString.split(":").map(Number);
      //     if (isNaN(hours) || isNaN(minutes)) return timeString;

      //     const roundedMinutes = Math.round(minutes / 5) * 5;
      //     const finalMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;
      //     const finalHours = roundedMinutes === 60 ? (hours + 1) % 24 : hours;

      //     return `${String(finalHours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}`;
      //   };

      //   const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      //     const formatted = formatTimeInput(e.target.value);
      //     field.onChange(formatted);
      //   };

      //   const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      //     let value = e.target.value;

      //     // If user typed without colons (e.g., "2233"), format it properly
      //     if (!value.includes(":") && value.length >= 3) {
      //       const digits = value.replace(/\D/g, "");
      //       if (digits.length >= 4) {
      //         value = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
      //       } else if (digits.length === 3) {
      //         // Handle cases like "233" -> "02:33"
      //         value = `0${digits[0]}:${digits.slice(1)}`;
      //       }
      //     }

      //     const rounded = roundToNearestFiveMinutes(value);
      //     field.onChange(rounded);
      //     if (field.onBlur) field.onBlur();
      //   };

      //   return (
      //     <FormItem>
      //       <FormLabel className="text-xs font-medium text-gray-600">
      //         {label}
      //       </FormLabel>
      //       <FormControl>
      //         <Input
      //           type="text"
      //           {...field}
      //           onChange={handleChange}
      //           onBlur={handleBlur}
      //           className={`block h-9 w-full text-sm ${
      //             fieldState.error
      //               ? "border-red-500 focus-visible:ring-red-500"
      //               : ""
      //           }`}
      //           placeholder="HH:MM"
      //           maxLength={5}
      //         />
      //       </FormControl>
      //       <FormMessage />
      //     </FormItem>
      //   );
      // }}
    />
  );
};

function HourMinuteSelect({
  value,
  onChange,
  onBlur,
  disabled,
}: ControllerRenderProps<FieldValues, string>) {
  const [hour, minute] = value.split(":");

  const handleHourChange = (newHour: string) => {
    const newTime = `${newHour}:${minute}`;
    onChange(newTime);
    onBlur(); // Trigger validation on change
  };

  const handleMinuteChange = (newMinute: string) => {
    // When minute changes, combine it with the current hour (or '09')
    // and update the form state.
    const newTime = `${hour}:${newMinute}`;
    onChange(newTime);
    onBlur(); // Trigger validation on change
  };

  return (
    <>
      <Select onValueChange={handleHourChange} value={hour}>
        <FormControl>
          <SelectTrigger className="w-60" disabled={disabled}>
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {hourOptions.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="font-bold">:</span>

      <Select onValueChange={handleMinuteChange} value={minute}>
        <FormControl>
          <SelectTrigger className="w-60" disabled={disabled}>
            <SelectValue placeholder="Minute" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {(hour === "24" ? ["00"] : minuteOptions).map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
