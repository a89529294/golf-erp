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
import { UseFormReturn } from "react-hook-form";

// export function onSubmit<
//   T extends NewGolfCourse | NewIndoorSimulator | NewDrivingRange,
// >(values: T, addNewSite: (v: T) => void) {
//   // Do something with the form values.
//   // ✅ This will be type-safe and validated.
//   console.log(values);

//   if (values.category === "driving-range") {
//     addNewSite(values);
//   }
// }

export function onRemoveImage(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  const imageFiles = form.getValues("imageFiles");
  form.setValue(
    "imageFiles",
    imageFiles.filter((f) => f.id !== id),
  );
}

export function onAddNewImages(
  e: React.ChangeEvent<HTMLInputElement>,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  const files = e.target.files;
  if (!files) return;

  let filesArray: FileWithId[] = [];

  filesArray = Array.from(files).map((file) => ({
    file: file,
    id: crypto.randomUUID(),
  }));

  form.setValue("imageFiles", [...form.getValues("imageFiles"), ...filesArray]);
}

export function onAddNewOpeningDateRange(
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
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

export function onEditOpeningDateRange(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "openingDates",
    form
      .getValues("openingDates")
      .map((v) =>
        v.id === id ? { ...v, saved: false } : { ...v, saved: true },
      ),
  );
}

export function onRemoveOpeningDateRange(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "openingDates",
    form.getValues("openingDates").filter((od) => od.id !== id),
    { shouldValidate: true },
  );
}

export function onSaveOpeningDateRange(
  dateRange: DateRange,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "openingDates",
    form
      .getValues("openingDates")
      .map((od) => (od.id === dateRange.id ? dateRange : od)),
    { shouldValidate: true },
  );
}

export function onAddNewOpeningHoursRange(
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
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

export function onEditOpeningTimeRange(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "openingHours",
    form
      .getValues("openingHours")
      .map((v) =>
        v.id === id ? { ...v, saved: false } : { ...v, saved: true },
      ),
  );
}

export function onRemoveOpeningTimeRange(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "openingHours",
    form.getValues("openingHours").filter((v) => v.id !== id),
    {
      shouldValidate: true,
    },
  );
}

export function onSaveOpeningTimeRange(
  timeRange: TimeRange,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
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

export function onAddNewWeekdayTimeRange(
  day: Weekday,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
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

export function onEditWeekdayTimeRange(
  day: Weekday,
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    day,
    form.getValues(day).map((d) => (d.id === id ? { ...d, saved: false } : d)),
  );
}
export function onRemoveWeekdayTimeRange(
  day: Weekday,
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    day,
    form.getValues(day).filter((d) => d.id !== id),
  );
}
export function onSaveWeekdayTimeRange(
  day: Weekday,
  content: WeekdayContent,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    day,
    form
      .getValues(day)
      .map((d) => (d.id === content.id ? { ...content, saved: true } : d)),
  );
}

export function onSelectEquipment(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "equipments",
    form
      .getValues("equipments")
      .map((v) => (v.id === id ? { ...v, selected: !v.selected } : v)),
  );
}

export function onAddNewVenueSettingsRow(
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
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

export function onEditVenueSettingsRow(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "venueSettings",
    form
      .getValues("venueSettings")
      .map((v) =>
        v.id === id ? { ...v, saved: false } : { ...v, saved: true },
      ),
  );
}

export function onRemoveVenueSettingsRow(
  id: string,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
  form.setValue(
    "venueSettings",
    form.getValues("venueSettings").filter((v) => v.id !== id),
    {
      shouldValidate: true,
    },
  );
}

export function onSaveVenueSettingsRow(
  venueSettingsRow: VenueSettingsRowContent,
  form: UseFormReturn<NewGolfCourse | NewIndoorSimulator | NewDrivingRange>,
) {
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
