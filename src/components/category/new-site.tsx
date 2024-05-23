import { DateRangeRow } from "@/components/category/date-range-row";
import { FormTextField } from "@/components/category/form-text-field";
import { PreviewImage } from "@/components/category/preview-image";
import { Section } from "@/components/category/section";
import { TimeRangeRow } from "@/components/category/time-range-row";
import { WeekDayTabs } from "@/components/weekday-tabs";
import { cn } from "@/lib/utils";
import {
  DateRange,
  FileWithId,
  NewDrivingRange,
  NewGolfCourse,
  NewIndoorSimulator,
  TimeRange,
  VenueSettingsRowContent,
  Weekday,
  WeekdayContent,
} from "@/utils/category/schemas";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { VenueSettingsRow } from "./venue-settings-row";

export function NewSite({
  type,
}: {
  type: "golf" | "indoor-simulator" | "driving-range";
}) {
  const form = useFormContext<
    NewGolfCourse | NewIndoorSimulator | NewDrivingRange
  >();

  const [newTimeRangeDisabled, setNewTimeRangeDisabled] = useState(false);
  const [newDateRangeDisabled, setNewDateRangeDisabled] = useState(false);

  function onSubmit(
    values: NewGolfCourse | NewIndoorSimulator | NewDrivingRange,
  ) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function onRemoveImage(id: string) {
    const imageFiles = form.getValues("imageFiles");
    form.setValue(
      "imageFiles",
      imageFiles.filter((f) => f.id !== id),
    );
  }

  function onAddNewImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    let filesArray: FileWithId[] = [];

    filesArray = Array.from(files).map((file) => ({
      file: file,
      id: crypto.randomUUID(),
    }));

    form.setValue("imageFiles", [
      ...form.getValues("imageFiles"),
      ...filesArray,
    ]);
  }

  function onAddNewOpeningDateRange() {
    if (form.formState.errors.openingDates) return;
    const openingDates = form.getValues("openingDates");
    form.setValue(
      "openingDates",
      [
        ...openingDates,
        {
          id: crypto.randomUUID(),
          start: undefined,
          end: undefined,
          saved: false,
        },
      ],
      {
        shouldValidate: true,
      },
    );
  }

  function onEditOpeningDateRange(id: string) {
    form.setValue(
      "openingDates",
      form
        .getValues("openingDates")
        .map((v) =>
          v.id === id ? { ...v, saved: false } : { ...v, saved: true },
        ),
    );
  }

  function onRemoveOpeningDateRange(id: string) {
    form.setValue(
      "openingDates",
      form.getValues("openingDates").filter((od) => od.id !== id),
      { shouldValidate: true },
    );
  }

  function onSaveOpeningDateRange(dateRange: DateRange) {
    form.setValue(
      "openingDates",
      form
        .getValues("openingDates")
        .map((od) => (od.id === dateRange.id ? dateRange : od)),
      { shouldValidate: true },
    );
  }

  function onAddNewOpeningHoursRange() {
    if ("openingHours" in form.formState.errors) return;
    form.setValue(
      "openingHours",
      [
        ...form.getValues("openingHours"),
        {
          id: crypto.randomUUID(),
          start: "",
          end: "",
          fee: "",
          saved: false,
        },
      ],
      { shouldValidate: true },
    );
  }

  function onEditOpeningTimeRange(id: string) {
    form.setValue(
      "openingHours",
      form
        .getValues("openingHours")
        .map((v) =>
          v.id === id ? { ...v, saved: false } : { ...v, saved: true },
        ),
    );
  }

  function onRemoveOpeningTimeRange(id: string) {
    form.setValue(
      "openingHours",
      form.getValues("openingHours").filter((v) => v.id !== id),
      {
        shouldValidate: true,
      },
    );
  }

  function onSaveOpeningTimeRange(timeRange: TimeRange) {
    form.setValue(
      "openingHours",
      form
        .getValues("openingHours")
        .map((v) => (v.id === timeRange.id ? timeRange : v)),
      {
        shouldValidate: true,
      },
    );
  }

  function onAddNewWeekdayTimeRange(day: Weekday) {
    // if ("openingHours" in form.formState.errors) return;

    form.setValue(
      day,
      [
        ...form.getValues(day),
        {
          id: crypto.randomUUID(),
          title: "",
          start: "",
          end: "",
          numberOfGroups: "",
          subRows: [],
          saved: false,
        },
      ],
      { shouldValidate: true },
    );
  }

  function onEditWeekdayTimeRange(day: Weekday, id: string) {
    form.setValue(
      day,
      form
        .getValues(day)
        .map((d) => (d.id === id ? { ...d, saved: false } : d)),
    );
  }
  function onRemoveWeekdayTimeRange(day: Weekday, id: string) {
    form.setValue(
      day,
      form.getValues(day).filter((d) => d.id !== id),
    );
  }
  function onSaveWeekdayTimeRange(day: Weekday, content: WeekdayContent) {
    form.setValue(
      day,
      form
        .getValues(day)
        .map((d) => (d.id === content.id ? { ...content, saved: true } : d)),
    );
  }

  function onSelectEquipment(id: string) {
    form.setValue(
      "equipments",
      form
        .getValues("equipments")
        .map((v) => (v.id === id ? { ...v, selected: !v.selected } : v)),
    );
  }

  function onAddNewVenueSettingsRow() {
    form.setValue(
      "venueSettings",
      [
        ...form.getValues("venueSettings"),
        {
          id: crypto.randomUUID(),
          start: "",
          end: "",
          fee: "",
          saved: false,
          numberOfGroups: "",
          numberOfBalls: "",
        },
      ],
      { shouldValidate: true },
    );
  }

  function onEditVenueSettingsRow(id: string) {
    console.log(id);
    // form.setValue(
    //   "openingHours",
    //   form
    //     .getValues("openingHours")
    //     .map((v) =>
    //       v.id === id ? { ...v, saved: false } : { ...v, saved: true },
    //     ),
    // );
  }

  function onRemoveVenueSettingsRow(id: string) {
    form.setValue(
      "venueSettings",
      form.getValues("venueSettings").filter((v) => v.id !== id),
      {
        shouldValidate: true,
      },
    );
  }

  function onSaveVenueSettingsRow(venueSettingsRow: VenueSettingsRowContent) {
    form.setValue(
      "venueSettings",
      form
        .getValues("venueSettings")
        .map((v) => (v.id === venueSettingsRow.id ? venueSettingsRow : v)),
      {
        shouldValidate: true,
      },
    );
  }

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
      onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
      className="space-y-10 px-20"
      id="new-site"
    >
      <section className="space-y-6 border border-line-gray bg-white px-12 py-10">
        <FormTextField name="name" label="場地名稱" />
        <FormTextField name="description" label="場地簡介" />
      </section>

      <Section title="設備配置">
        <div className="flex flex-wrap gap-3 p-5 text-secondary-dark">
          {form.watch("equipments").map((e) => {
            return (
              <button
                type="button"
                className={cn(
                  "rounded-full border border-line-gray px-5 py-3 ",
                  e.selected &&
                    "border-secondary-dark bg-secondary-dark text-white",
                )}
                key={e.id}
                onClick={() => onSelectEquipment(e.id)}
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
              onChange={onAddNewImages}
            />
          ),
        }}
      >
        {form.watch("imageFiles").length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] px-3 py-5">
            {form.getValues("imageFiles").map((file) => {
              return (
                <PreviewImage
                  key={file.id}
                  file={file}
                  onRemoveImage={onRemoveImage}
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
              onClick={onAddNewOpeningDateRange}
            />
          ),
        }}
        disabled={newDateRangeDisabled}
      >
        {form.watch("openingDates").length ? (
          <ul>
            {form.getValues("openingDates").map((dateRange) => {
              return (
                <DateRangeRow
                  key={dateRange.id}
                  onRemove={() => onRemoveOpeningDateRange(dateRange.id)}
                  onSave={(dateRange: DateRange) =>
                    onSaveOpeningDateRange(dateRange)
                  }
                  data={dateRange}
                  onEdit={() => onEditOpeningDateRange(dateRange.id)}
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
                onClick={() => onAddNewWeekdayTimeRange("monday")}
              />
            ),
          }}
          disabled={newTimeRangeDisabled}
        >
          <WeekDayTabs
            onEdit={onEditWeekdayTimeRange}
            onRemove={onRemoveWeekdayTimeRange}
            onSave={onSaveWeekdayTimeRange}
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
                onClick={onAddNewOpeningHoursRange}
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
                    onRemove={() => onRemoveOpeningTimeRange(hours.id)}
                    onSave={(timeRange: TimeRange) =>
                      onSaveOpeningTimeRange(timeRange)
                    }
                    onEdit={() => onEditOpeningTimeRange(hours.id)}
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
        <Section
          title="場地開放設定"
          inputButton={{
            text: "新增設定",
            element: (
              <input
                type="button"
                className="hidden"
                onClick={onAddNewVenueSettingsRow}
              />
            ),
          }}
          disabled={false}
        >
          {form.watch("venueSettings").length ? (
            <ul>
              {form.getValues("venueSettings").map((settings) => {
                return (
                  <VenueSettingsRow
                    key={settings.id}
                    onRemove={() => onRemoveVenueSettingsRow(settings.id)}
                    onSave={(settings: VenueSettingsRowContent) =>
                      onSaveVenueSettingsRow(settings)
                    }
                    onEdit={() => onEditVenueSettingsRow(settings.id)}
                    data={settings}
                  />
                );
              })}
            </ul>
          ) : (
            <p className="py-2.5">尚未新增開放時間</p>
          )}
        </Section>
      )}
    </form>
  );
}
