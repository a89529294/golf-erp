import { DateRangeRow } from "@/components/category/date-range-row";
import { FormTextField } from "@/components/category/form-text-field";
import { PreviewImage } from "@/components/category/preview-image";
import { Section } from "@/components/category/section";
import { TimeRangeRow } from "@/components/category/time-range-row";
import { WeekDayTabs } from "@/components/weekday-tabs";
import { cn } from "@/lib/utils";
import {
  DateRange,
  NewDrivingRange,
  NewGolfCourse,
  NewIndoorSimulator,
  TimeRange,
  VenueSettingsRowContent,
} from "@/utils/category/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { VenueSettingsRow } from "./venue-settings-row";
import {
  onAddNewImages,
  onAddNewOpeningDateRange,
  onAddNewOpeningHoursRange,
  onAddNewVenueSettingsRow,
  onAddNewWeekdayTimeRange,
  onEditOpeningDateRange,
  onEditOpeningTimeRange,
  onEditVenueSettingsRow,
  onEditWeekdayTimeRange,
  onRemoveImage,
  onRemoveOpeningDateRange,
  onRemoveOpeningTimeRange,
  onRemoveVenueSettingsRow,
  onRemoveWeekdayTimeRange,
  onSaveOpeningDateRange,
  onSaveOpeningTimeRange,
  onSaveVenueSettingsRow,
  onSaveWeekdayTimeRange,
  onSelectEquipment,
} from "./helper-functions";
import { StoreWithoutEmployees } from "@/pages/store-management/loader";
import { UnderscoredInput } from "@/components/underscored-input";

type S = {
  golf: NewGolfCourse;
  "indoor-simulator": NewIndoorSimulator;
  "driving-range": NewDrivingRange;
};

export function Site({
  type,
  formDisabled,
  stores,
  addNewSite,
}: {
  type: "golf" | "indoor-simulator" | "driving-range";
  formDisabled: boolean;
  stores: StoreWithoutEmployees[];
  addNewSite: (v: S[typeof type]) => void;
}): React.ReactElement {
  const form = useFormContext<S[typeof type]>();
  const [newTimeRangeDisabled, setNewTimeRangeDisabled] = useState(false);
  const [newDateRangeDisabled, setNewDateRangeDisabled] = useState(false);

  const x =
    "openingHours" in form.formState.errors
      ? form.formState.errors.openingHours
      : "";

  useEffect(() => {
    if ("openingHours" in form.formState.errors) setNewTimeRangeDisabled(!!x);
  }, [x, form.formState.errors]);

  useEffect(() => {
    setNewDateRangeDisabled(!!form.formState.errors.openingDates);
  }, [form.formState.errors.openingDates]);

  return (
    <form
      onSubmit={form.handleSubmit(
        (v) => {
          addNewSite(v);
        },
        (e) => console.log(e),
      )}
      className="space-y-10 px-20"
      id="new-site"
    >
      <section className="space-y-6 border border-line-gray bg-white px-12 py-10">
        <FormTextField name="name" label="場地名稱" disabled={formDisabled} />
        <FormTextField
          name="description"
          label="場地簡介"
          disabled={formDisabled}
        />
        <FormField
          control={form.control}
          name="storeId"
          render={({ field }) => (
            <FormItem className="flex items-baseline gap-5">
              <FormLabel>綁定廠商</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    disabled={formDisabled}
                    className="h-7 rounded-none border-0 border-b border-secondary-dark pl-0"
                  >
                    <SelectValue placeholder="選擇廠商" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <Section title="設備配置">
        <div className={cn("flex flex-wrap gap-3 p-5 text-secondary-dark")}>
          {form.watch("equipments").map((e) => {
            return (
              <button
                type="button"
                className={cn(
                  "rounded-full border border-line-gray px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50",
                  e.selected &&
                    "border-secondary-dark bg-secondary-dark text-white",
                )}
                key={e.id}
                onClick={() => onSelectEquipment(e.id, form)}
                disabled={formDisabled}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        title="場地圖片"
        subTitle="(圖片上限10張)"
        inputButton={{
          text: "新增圖片",
          element: (
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              multiple
              onChange={(e) => onAddNewImages(e, form)}
            />
          ),
        }}
        disabled={formDisabled}
      >
        {form.watch("imageFiles").length ? (
          <div
            className={cn(
              "grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] px-3 py-5",
            )}
          >
            {form.getValues("imageFiles").map((file) => {
              return (
                <PreviewImage
                  key={file.id}
                  file={file}
                  onRemoveImage={(id) => onRemoveImage(id, form)}
                  disabled={formDisabled}
                />
              );
            })}
          </div>
        ) : (
          <p className="py-2.5">尚未新增圖片</p>
        )}
      </Section>

      <Section
        title="場地開放日期"
        inputButton={{
          text: "新增日期",
          element: (
            <input
              type="button"
              className="hidden"
              onClick={() => onAddNewOpeningDateRange(form)}
            />
          ),
        }}
        disabled={newDateRangeDisabled || formDisabled}
      >
        {form.watch("openingDates").length ? (
          <ul>
            {form.getValues("openingDates").map((dateRange) => {
              return (
                <DateRangeRow
                  key={dateRange.id}
                  onRemove={() => onRemoveOpeningDateRange(dateRange.id, form)}
                  onSave={(dateRange: DateRange) =>
                    onSaveOpeningDateRange(dateRange, form)
                  }
                  data={dateRange}
                  onEdit={() => onEditOpeningDateRange(dateRange.id, form)}
                  disabled={formDisabled}
                />
              );
            })}
          </ul>
        ) : (
          <p className="py-2.5">尚未新增開放日期</p>
        )}
      </Section>

      {type === "golf" && (
        <Section
          title="場地開放時間"
          inputButton={{
            text: "新增時間",
            element: (
              <input
                type="button"
                className="hidden"
                onClick={() => onAddNewWeekdayTimeRange("monday", form)}
              />
            ),
          }}
          disabled={newTimeRangeDisabled}
        >
          <WeekDayTabs
            onEdit={(weekday, id) => onEditWeekdayTimeRange(weekday, id, form)}
            onRemove={(weekday, id) =>
              onRemoveWeekdayTimeRange(weekday, id, form)
            }
            onSave={(weekday, content) =>
              onSaveWeekdayTimeRange(weekday, content, form)
            }
          />
        </Section>
      )}

      {type === "indoor-simulator" && (
        <Section
          title="場地開放時間"
          inputButton={{
            text: "新增時間",
            element: (
              <input
                type="button"
                className="hidden"
                onClick={() => onAddNewOpeningHoursRange(form)}
              />
            ),
          }}
          disabled={newTimeRangeDisabled}
        >
          {form.watch("openingHours").length ? (
            <ul>
              {form.getValues("openingHours").map((hours) => {
                return (
                  <TimeRangeRow
                    key={hours.id}
                    onRemove={() => onRemoveOpeningTimeRange(hours.id, form)}
                    onSave={(timeRange: TimeRange) =>
                      onSaveOpeningTimeRange(timeRange, form)
                    }
                    onEdit={() => onEditOpeningTimeRange(hours.id, form)}
                    data={hours}
                  />
                );
              })}
            </ul>
          ) : (
            <p className="py-2.5">尚未新增開放時間</p>
          )}
        </Section>
      )}

      {type === "driving-range" && (
        <>
          <Section
            title="場地開放設定"
            inputButton={{
              text: "新增設定",
              element: (
                <input
                  type="button"
                  className="hidden"
                  onClick={() => onAddNewVenueSettingsRow(form)}
                />
              ),
            }}
            disabled={formDisabled}
          >
            {form.watch("venueSettings").length ? (
              <ul>
                {form.getValues("venueSettings").map((settings) => {
                  return (
                    <VenueSettingsRow
                      key={settings.id}
                      onRemove={() =>
                        onRemoveVenueSettingsRow(settings.id, form)
                      }
                      onSave={(settings: VenueSettingsRowContent) =>
                        onSaveVenueSettingsRow(settings, form)
                      }
                      onEdit={() => onEditVenueSettingsRow(settings.id, form)}
                      data={settings}
                      formDisabled={formDisabled}
                    />
                  );
                })}
              </ul>
            ) : (
              <p className="py-2.5">尚未新增開放時間</p>
            )}
          </Section>

          <Section title="">
            <div className="flex justify-between px-5 pb-2.5 pt-4">
              <p className="font-medium text-secondary-dark">球費單盒計價</p>
              <FormField
                control={form.control}
                name="costPerBox"
                render={({ field }) => (
                  <FormItem className="flex items-baseline gap-1.5">
                    <FormControl>
                      <UnderscoredInput
                        placeholder={`價錢`}
                        className="h-7 w-28 p-0 pb-1 text-center text-secondary-dark"
                        disabled={formDisabled}
                        {...field}
                        onChange={(e) => {
                          const value = Number.isNaN(+e.target.value)
                            ? field.value
                            : +e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-secondary-dark">盒/元</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>
        </>
      )}
    </form>
  );
}
