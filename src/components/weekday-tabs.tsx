import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { WeekdayRow } from "@/components/category/weekday-row";
import { Weekday, WeekdayContent } from "@/utils/category/schemas";
import { motion } from "framer-motion";
import React from "react";
import { useFormContext } from "react-hook-form";

export const WeekDayTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, ...props }, ref) => (
  <TabsList
    ref={ref}
    className={cn(
      "flex h-auto justify-start gap-3 bg-light-gray px-5 py-2.5",
      className,
    )}
    {...props}
  />
));

export const WeekDayTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof TabsTrigger> & { isActive: boolean }
>(({ className, children, isActive, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn(
      "group relative rounded-full bg-white px-5 py-3 text-base font-normal text-secondary-dark transition-colors duration-1000 data-[state=active]:text-white",
      className,
      isActive ? "z-10" : "z-0",
    )}
    {...props}
  >
    {isActive && (
      <motion.div
        className="absolute inset-0 rounded-full bg-secondary-dark"
        layoutId="weekday-tab"
      />
    )}
    <div className="relative">{children}</div>
  </TabsTrigger>
));

export const WeekdayTabs = ({
  onEdit,
  onRemove,
  onSave,
  disabled,
  activeValue,
  setActiveValue,
  myRef,
}: {
  onEdit: (weekday: Weekday, id: string) => void;
  onRemove: (weekday: Weekday, id: string) => void;
  onSave: (weekday: Weekday, content: WeekdayContent) => void;
  disabled?: boolean;
  activeValue: Weekday;
  setActiveValue: (s: string) => void;
  myRef?: React.RefObject<HTMLDivElement>;
}) => {
  const form = useFormContext();

  return (
    <Tabs ref={myRef} value={activeValue} onValueChange={setActiveValue}>
      <WeekDayTabsList>
        <WeekDayTabsTrigger
          disabled={disabled}
          value="monday"
          isActive={"monday" === activeValue}
        >
          星期一
        </WeekDayTabsTrigger>
        <WeekDayTabsTrigger
          value="tuesday"
          isActive={"tuesday" === activeValue}
          disabled={disabled}
        >
          星期二
        </WeekDayTabsTrigger>
        <WeekDayTabsTrigger
          value="wednesday"
          isActive={"wednesday" === activeValue}
          disabled={disabled}
        >
          星期三
        </WeekDayTabsTrigger>
        <WeekDayTabsTrigger
          value="thursday"
          isActive={"thursday" === activeValue}
          disabled={disabled}
        >
          星期四
        </WeekDayTabsTrigger>
        <WeekDayTabsTrigger
          value="friday"
          isActive={"friday" === activeValue}
          disabled={disabled}
        >
          星期五
        </WeekDayTabsTrigger>
        <WeekDayTabsTrigger
          value="saturday"
          isActive={"saturday" === activeValue}
          disabled={disabled}
        >
          星期六
        </WeekDayTabsTrigger>
        <WeekDayTabsTrigger
          value="sunday"
          isActive={"sunday" === activeValue}
          disabled={disabled}
        >
          星期日
        </WeekDayTabsTrigger>
      </WeekDayTabsList>
      {(
        [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ] as const
      ).map((day) => (
        <TabsContent value={day} key={day}>
          {form.watch(day).length ? (
            <ul>
              {form.getValues(day).map((content: WeekdayContent) => {
                return (
                  <WeekdayRow
                    key={content.id}
                    onRemove={() => onRemove(day, content.id)}
                    onSave={(content: WeekdayContent) => onSave(day, content)}
                    onEdit={() => onEdit(day, content.id)}
                    data={content}
                    disabled={disabled}
                  />
                );
              })}
            </ul>
          ) : (
            <p className="py-2.5">尚未新增開放時間</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
