import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { DateRangeRow } from "@/pages/indoor-simulator/site-management/new/components/date-range-row";
import { FormTextField } from "@/pages/indoor-simulator/site-management/new/components/form-text-field";
import { PreviewImage } from "@/pages/indoor-simulator/site-management/new/components/preview-image";
import { Section } from "@/pages/indoor-simulator/site-management/new/components/section";
import { TimeRangeRow } from "@/pages/indoor-simulator/site-management/new/components/time-range-row";
import {
  type DateRange,
  type FileWithId,
  type TimeRange,
  newIndoorSimulatorSiteSchema,
} from "@/pages/indoor-simulator/site-management/new/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export function Component() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof newIndoorSimulatorSiteSchema>>({
    resolver: zodResolver(newIndoorSimulatorSiteSchema),
    defaultValues: {
      name: "",
      description: "",
      imageFiles: [],
      openingDates: [],
      openingHours: [],
    },
  });
  const [newTimeRangeDisabled, setNewTimeRangeDisabled] = useState(false);
  const [newDateRangeDisabled, setNewDateRangeDisabled] = useState(false);

  function onSubmit(values: z.infer<typeof newIndoorSimulatorSiteSchema>) {
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

  useEffect(() => {
    setNewTimeRangeDisabled(!!form.formState.errors.openingHours);
  }, [form.formState.errors.openingHours]);

  useEffect(() => {
    console.log(form.formState.errors.openingDates);
    setNewDateRangeDisabled(!!form.formState.errors.openingDates);
  }, [form.formState.errors.openingDates]);

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back" onClick={() => navigate(-1)}>
            返回
          </IconButton>
          <IconButton icon="save" form="new-site" onClick={() => {}}>
            儲存
          </IconButton>
        </>
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          建立場地資料
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="space-y-10 px-56"
            id="new-site"
          >
            <section className="space-y-6 border border-line-gray bg-white px-12 py-10">
              <FormTextField name="name" label="場地名稱" />
              <FormTextField name="description" label="場地簡介" />
            </section>

            <Section
              title="場地圖片"
              subTitle="(圖片上限10張)"
              inputButtonText="新增圖片"
              inputButtonElement={
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={onAddNewImages}
                />
              }
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
              inputButtonText="新增日期"
              inputButtonElement={
                <input
                  type="button"
                  className="hidden"
                  onClick={onAddNewOpeningDateRange}
                />
              }
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

            <Section
              title="場地開放時間"
              inputButtonText="新增時間"
              inputButtonElement={
                <input
                  type="button"
                  className="hidden"
                  onClick={onAddNewOpeningHoursRange}
                />
              }
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
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
