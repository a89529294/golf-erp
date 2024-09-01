import { compressImage } from "@/utils";
import {
  DateRange,
  ExistingDrivingRange,
  ExistingGolfCourse,
  ExistingIndoorSimulator,
  FileWithId,
  NewDrivingRange,
  NewGolfCourse,
  NewIndoorSimulator,
  Plan,
  TimeRange,
  VenueSettingsRowContent,
  Weekday,
  WeekdayContent,
} from "@/utils/category/schemas";
import { UseFormReturn } from "react-hook-form";
import { Equipment } from "@/pages/equipment-management/loader.ts";

// export function onSubmit<
//   T extends NewGolfCourse | NewIndoorSimulator | NewDrivingRange | ExistingGolfCourse | ExistingDrivingRange | ExistingIndoorSimulator,
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
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  const imageFiles = form.getValues("imageFiles");
  form.setValue(
    "imageFiles",
    imageFiles.filter((f) => f.id !== id),
    { shouldDirty: true },
  );
}

export async function onAddNewImages(
  e: React.ChangeEvent<HTMLInputElement>,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  const files = e.target.files;
  if (!files) return;

  let filesArray: FileWithId[] = [];

  const promises = [] as Promise<File>[];

  Array.from(files).forEach((file) => promises.push(compressImage(file)));

  const compressedFiles = await Promise.all(promises);

  filesArray = compressedFiles.map((file) => ({
    file: file,
    id: crypto.randomUUID(),
  }));

  form.setValue(
    "imageFiles",
    [...form.getValues("imageFiles"), ...filesArray],
    { shouldDirty: true },
  );
}

export function onAddNewOpeningDateRange(
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
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
      shouldValidate: false,
    },
  );
}

export function onEditOpeningDateRange(
  id: string,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
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
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "openingDates",
    form.getValues("openingDates").filter((od) => od.id !== id),
    { shouldValidate: true, shouldDirty: true },
  );
}

export function onSaveOpeningDateRange(
  dateRange: DateRange,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "openingDates",
    form
      .getValues("openingDates")
      .map((od) => (od.id === dateRange.id ? dateRange : od)),
    { shouldValidate: true, shouldDirty: true },
  );
}

export function onAddNewOpeningHoursRange(
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  if ("openingHours" in form.formState.errors) return;
  form.setValue(
    "openingHours",
    [
      {
        start: "",
        end: "",
        saved: false,
      },
    ],
    { shouldValidate: true },
  );
}

export function onRemoveOpeningTimeRange(
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue("openingHours", [], {
    shouldValidate: true,
    shouldDirty: true,
  });
}

export function onSaveOpeningTimeRange(
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
  tr: TimeRange,
) {
  form.setValue("openingHours", tr, {
    shouldValidate: true,
    shouldDirty: true,
  });
}

export function onEditOpeningTimeRange(
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "openingHours",
    [{ ...form.getValues("openingHours")[0], saved: false }],
    {
      shouldValidate: true,
      shouldDirty: true,
    },
  );
}

export function onAddNewPlan(
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  if ("plans" in form.formState.errors) return;
  form.setValue(
    "plans",
    [
      ...(form.getValues("plans") ?? []),
      {
        id: crypto.randomUUID(),
        title: "",
        hours: "",
        price: "",
        saved: false,
      },
    ],
    { shouldValidate: true },
  );
}

export function onRemovePlan(
  id: string,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "plans",
    form.getValues("plans")?.filter((v) => v.id !== id),
    {
      shouldValidate: true,
      shouldDirty: true,
    },
  );
}

export function onSavePlan(
  plan: Plan,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "plans",
    form.getValues("plans")?.map((v) => (v.id === plan.id ? plan : v)),
    {
      shouldValidate: true,
      shouldDirty: true,
    },
  );
}

export function onAddNewWeekdayTimeRange(
  day: Weekday,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
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
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    day,
    form.getValues(day).map((d) => (d.id === id ? { ...d, saved: false } : d)),
  );
}
export function onRemoveWeekdayTimeRange(
  day: Weekday,
  id: string,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    day,
    form.getValues(day).filter((d) => d.id !== id),
    {
      shouldDirty: true,
    },
  );
}
export function onSaveWeekdayTimeRange(
  day: Weekday,
  content: WeekdayContent,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    day,
    form
      .getValues(day)
      .map((d) => (d.id === content.id ? { ...content, saved: true } : d)),
    { shouldDirty: true },
  );
}

export function onSelectEquipment(
  equipment: Equipment,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  const newEquipments = form.getValues("equipments") ?? [];

  const idx = newEquipments.findIndex((e) => e.title === equipment.title);
  if (idx !== -1) {
    newEquipments.splice(idx, 1);
  } else {
    newEquipments.push(equipment);
  }

  form.setValue("equipments", newEquipments, {
    shouldDirty: true,
  });
}

export function findRealEquipments(
  availableEquipments: Equipment[],
  ...findTitles: string[]
): Equipment[] {
  const result: Equipment[] = [];
  for (const title of findTitles) {
    const eq = availableEquipments.find((e) => e.title === title);
    if (eq) {
      result.push(eq);
    }
  }

  return result;
}

export function onAddNewVenueSettingsRow(
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "venueSettings",
    [
      ...form.getValues("venueSettings"),
      {
        id: crypto.randomUUID(),
        start: "",
        end: "",
        saved: false,
      },
    ],
    { shouldValidate: false },
  );
}

export function onEditVenueSettingsRow(
  id: string,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
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
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "venueSettings",
    form.getValues("venueSettings").filter((v) => v.id !== id),
    {
      shouldValidate: true,
      shouldDirty: true,
    },
  );
}

export function onSaveVenueSettingsRow(
  venueSettingsRow: VenueSettingsRowContent,
  form: UseFormReturn<
    | NewGolfCourse
    | NewIndoorSimulator
    | NewDrivingRange
    | ExistingGolfCourse
    | ExistingDrivingRange
    | ExistingIndoorSimulator
  >,
) {
  form.setValue(
    "venueSettings",
    form
      .getValues("venueSettings")
      .map((v) => (v.id === venueSettingsRow.id ? venueSettingsRow : v)),
    {
      shouldValidate: true,
      shouldDirty: true,
    },
  );
}
