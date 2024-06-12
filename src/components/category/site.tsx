import { DateRangeRow } from "@/components/category/date-range-row";
import { FormTextField } from "@/components/category/form-text-field";
import { PlanRow } from "@/components/category/plan-row";
import { PreviewImage } from "@/components/category/preview-image";
import { Section } from "@/components/category/section";
import { TimeRangeRow } from "@/components/category/time-range-row";
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
import { WeekDayTabs } from "@/components/weekday-tabs";
import { cn } from "@/lib/utils";
import { StoreWithoutEmployees } from "@/pages/store-management/loader";
import {
  DateRange,
  ExistingDrivingRange,
  ExistingGolfCourse,
  ExistingIndoorSimulator,
  NewDrivingRange,
  NewGolfCourse,
  NewIndoorSimulator,
  Plan,
  TimeRange,
  VenueSettingsRowContent,
  Weekday,
} from "@/utils/category/schemas";
import React, { useRef } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import {
  onAddNewImages,
  onAddNewOpeningDateRange,
  onAddNewOpeningHoursRange,
  onAddNewPlan,
  onAddNewVenueSettingsRow,
  onAddNewWeekdayTimeRange,
  onEditOpeningDateRange,
  onEditVenueSettingsRow,
  onEditWeekdayTimeRange,
  onRemoveImage,
  onRemoveOpeningDateRange,
  onRemoveOpeningTimeRange,
  onRemovePlan,
  onRemoveVenueSettingsRow,
  onRemoveWeekdayTimeRange,
  onSaveOpeningDateRange,
  onSaveOpeningTimeRange,
  onSavePlan,
  onSaveVenueSettingsRow,
  onSaveWeekdayTimeRange,
  onSelectEquipment,
} from "./helper-functions";
import { VenueSettingsRow } from "./venue-settings-row";

type S = {
  golf: NewGolfCourse;
  "indoor-simulator": NewIndoorSimulator;
  "driving-range": NewDrivingRange;
  "existing-golf": ExistingGolfCourse;
  "existing-indoor-simulator": ExistingIndoorSimulator;
  "existing-driving-range": ExistingDrivingRange;
};

export function Site({
  type,
  formDisabled,
  stores,
  onSubmit,
}: {
  type: keyof S;
  formDisabled: boolean;
  stores: StoreWithoutEmployees[];
  onSubmit: (v: S[typeof type]) => void;
}): React.ReactElement {
  const openingDateRangeRef = useRef<HTMLLIElement>(null);
  const openingHoursRef = useRef<HTMLLIElement>(null);
  const plansRef = useRef<HTMLLIElement>(null);
  const venueSettingsRef = useRef<HTMLLIElement>(null);
  const openingTimesRef = useRef<HTMLElement | null>(null);
  const [activeValue, setActiveValue] = React.useState<Weekday>("monday");
  const form = useFormContext<S[typeof type]>();

  return (
    <form
      onSubmit={form.handleSubmit(
        (v) => {
          console.log(v);
          console.log(form.formState.dirtyFields);

          // if (form.getValues("openingDates").some((v) => v.saved === false)) {
          //   openingDateRangeRef.current?.scrollIntoView();
          // }

          onSubmit(v);
        },
        (e) => {
          console.log(form.getValues("openingDates"));
          console.log(e);
          e.openingDates && openingDateRangeRef.current?.scrollIntoView();
          if ("venueSettings" in e) venueSettingsRef.current?.scrollIntoView();
          if ("openingHours" in e) openingHoursRef.current?.scrollIntoView();
          if ("plans" in e) plansRef.current?.scrollIntoView();
          if ("monday" in e || "tuesday" in e)
            openingTimesRef.current?.scrollIntoView();
        },
      )}
      className="space-y-10 px-20"
      id="site-details"
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
            <FormItem className="grid grid-cols-[auto_1fr] items-baseline gap-x-5">
              <FormLabel>綁定廠商</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormMessage className="col-start-2" />
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
        disabled={
          form.getValues("openingDates").some((od) => !od.saved) || formDisabled
        }
      >
        {form.watch("openingDates").length ? (
          <ul>
            {form.getValues("openingDates").map((dateRange, i) => {
              return (
                <DateRangeRow
                  myRef={openingDateRangeRef}
                  key={dateRange.id}
                  onRemove={() => onRemoveOpeningDateRange(dateRange.id, form)}
                  onSave={(dateRange: DateRange) =>
                    onSaveOpeningDateRange(dateRange, form)
                  }
                  data={dateRange}
                  onEdit={() => onEditOpeningDateRange(dateRange.id, form)}
                  disabled={formDisabled}
                  errorMessage={
                    form.formState.errors.openingDates?.[i] ? "請先儲存" : ""
                  }
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
                onClick={() => onAddNewWeekdayTimeRange(activeValue, form)}
              />
            ),
          }}
          disabled={
            formDisabled
            // || form.getValues("weekday").some((v) => !v.saved)
          }
          myRef={openingTimesRef}
        >
          <WeekDayTabs
            onEdit={(weekday, id) => onEditWeekdayTimeRange(weekday, id, form)}
            onRemove={(weekday, id) =>
              onRemoveWeekdayTimeRange(weekday, id, form)
            }
            onSave={(weekday, content) =>
              onSaveWeekdayTimeRange(weekday, content, form)
            }
            activeValue={activeValue}
            setActiveValue={(s) => setActiveValue(s as Weekday)}
          />
        </Section>
      )}
      {type === "indoor-simulator" && (
        <>
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
            disabled={
              formDisabled ||
              form.getValues("openingHours").some((v) => !v.saved)
            }
          >
            {form.watch("openingHours").length ? (
              <ul>
                {form.getValues("openingHours").map((hours, i) => {
                  return (
                    <TimeRangeRow
                      myRef={openingHoursRef}
                      key={hours.id}
                      onRemove={() => onRemoveOpeningTimeRange(hours.id, form)}
                      onSave={(timeRange: TimeRange) =>
                        onSaveOpeningTimeRange(timeRange, form)
                      }
                      data={hours}
                      disabled={formDisabled}
                      errorMessage={
                        (form as UseFormReturn<NewIndoorSimulator>).formState
                          .errors.openingHours?.[i]
                          ? "請先儲存"
                          : ""
                      }
                    />
                  );
                })}
              </ul>
            ) : (
              <p className="py-2.5">尚未新增開放時間</p>
            )}
          </Section>

          <Section
            title="場地方案"
            inputButton={{
              text: "新增方案",
              element: (
                <input
                  type="button"
                  className="hidden"
                  onClick={() => onAddNewPlan(form)}
                />
              ),
            }}
            disabled={
              formDisabled || form.getValues("plans")?.some((v) => !v.saved)
            }
          >
            {form.watch("plans")?.length ? (
              <ul>
                {form.getValues("plans")?.map((plan, i) => {
                  let errorMessage = "";
                  const planError = (form as UseFormReturn<NewIndoorSimulator>)
                    .formState.errors.plans?.[i];

                  if (planError) {
                    errorMessage = "請先儲存";
                  }

                  return (
                    <PlanRow
                      myRef={plansRef}
                      key={plan.id}
                      onRemove={() => onRemovePlan(plan.id, form)}
                      onSave={(plan: Plan) => onSavePlan(plan, form)}
                      data={plan}
                      disabled={formDisabled}
                      errorMessage={errorMessage}
                    />
                  );
                })}
              </ul>
            ) : (
              <p className="py-2.5">尚未新增方案</p>
            )}
          </Section>
        </>
      )}
      {(type === "driving-range" || type === "existing-driving-range") && (
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
            disabled={
              formDisabled ||
              form.getValues("venueSettings").some((v) => !v.saved)
            }
          >
            {form.watch("venueSettings").length ? (
              <ul>
                {form.getValues("venueSettings").map((settings, i) => {
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
                      errorMessage={
                        (form as UseFormReturn<ExistingDrivingRange>).formState
                          .errors.venueSettings?.[i]
                          ? "請先儲存"
                          : ""
                      }
                      myRef={venueSettingsRef}
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
