import { WeekDayTabs } from "@/components/weekday-tabs";
import { DateRangeRow } from "@/components/category/date-range-row";
import { FormTextField } from "@/components/category/form-text-field";
import { PreviewImage } from "@/components/category/preview-image";
import { Section } from "@/components/category/section";
import { TimeRangeRow } from "@/components/category/time-range-row";
import {
  DateRange,
  ExistingGolfCourse,
  ExistingImg,
  ExistingIndoorSimulator,
  FileWithId,
  TimeRange,
  Weekday,
  WeekdayContent,
} from "@/utils/category/schemas";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function SiteDetails({ formDisabled }: { formDisabled: boolean }) {
  const form = useFormContext<ExistingIndoorSimulator | ExistingGolfCourse>();
  const [newTimeRangeDisabled, setNewTimeRangeDisabled] = useState(false);
  const [newDateRangeDisabled, setNewDateRangeDisabled] = useState(false);

  function onSubmit(values: ExistingGolfCourse | ExistingIndoorSimulator) {
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

    let filesArray: (FileWithId | ExistingImg)[] = [];

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
          start: "",
          end: "",
          saved: false,
          numberOfGroups: "",
          subRows: [],
          title: "",
        },
      ],
      { shouldValidate: true },
    );
  }

  function onEditWeekdayTimeRange(day: Weekday, id: string) {
    console.log(day, id);
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
      id="edit-site"
    >
      <section className="space-y-6 border border-line-gray bg-white px-12 py-10">
        <FormTextField name="name" label="場地名稱" disabled={formDisabled} />
        <FormTextField
          name="description"
          label="場地簡介"
          disabled={formDisabled}
        />
      </section>

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
              disabled={formDisabled}
            />
          ),
        }}
        disabled={formDisabled}
      >
        {form.watch("imageFiles").length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] px-3 py-5">
            {form.getValues("imageFiles").map((file) => {
              return (
                <PreviewImage
                  key={file.id}
                  file={file}
                  onRemoveImage={onRemoveImage}
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
              onClick={onAddNewOpeningDateRange}
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
                  onRemove={() => onRemoveOpeningDateRange(dateRange.id)}
                  onSave={(dateRange: DateRange) =>
                    onSaveOpeningDateRange(dateRange)
                  }
                  data={dateRange}
                  onEdit={() => onEditOpeningDateRange(dateRange.id)}
                  disabled={formDisabled}
                />
              );
            })}
          </ul>
        ) : (
          <p className="py-2.5">尚未新增開放日期</p>
        )}
      </Section>

      {form.getValues("monday") ? (
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
          disabled={newTimeRangeDisabled || formDisabled}
        >
          <WeekDayTabs
            onEdit={onEditWeekdayTimeRange}
            onRemove={onRemoveWeekdayTimeRange}
            onSave={onSaveWeekdayTimeRange}
            disabled={formDisabled}
          />
        </Section>
      ) : (
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
                    disabled={formDisabled}
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
