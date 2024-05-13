import plusIcon from "@/assets/plus-icon.svg";
import { DatePicker } from "@/components/date-picker";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UnderscoredInput } from "@/components/underscored-input";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { addDays } from "date-fns";
import { usePrevious } from "@/hooks/use-previous";

const fileWithIdSchema = z.object({
  file: z.instanceof(File),
  id: z.string(),
});

type FileWithId = z.infer<typeof fileWithIdSchema>;

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageFiles: z.array(fileWithIdSchema),
  openingDates: z.array(
    z.object({
      id: z.string(),
      start: z.date().optional(),
      end: z.date().optional(),
      saved: z.boolean(),
    }),
  ),
  openingHours: z.array(
    z.object({
      id: z.string(),
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      saved: z.boolean(),
    }),
  ),
});

type DateRange = z.infer<typeof formSchema>["openingDates"][number];
type TimeRange = z.infer<typeof formSchema>["openingHours"][number];

export function Component() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageFiles: [],
      openingDates: [],
      openingHours: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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
    const openingDates = form.getValues("openingDates");
    form.setValue("openingDates", [
      ...openingDates,
      {
        id: crypto.randomUUID(),
        start: undefined,
        end: undefined,
        saved: false,
      },
    ]);
  }

  function onRemoveOpeningDateRange(id: string) {
    form.setValue(
      "openingDates",
      form.getValues("openingDates").filter((od) => od.id !== id),
    );
  }

  function onSaveOpeningDateRange(dateRange: DateRange) {
    form.setValue(
      "openingDates",
      form
        .getValues("openingDates")
        .map((od) => (od.id === dateRange.id ? dateRange : od)),
    );
  }

  function onAddNewOpeningHoursRange() {
    form.setValue("openingHours", [
      ...form.getValues("openingHours"),
      {
        id: crypto.randomUUID(),
        start: "",
        end: "",
        saved: false,
      },
    ]);
  }

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back" onClick={() => navigate(-1)}>
            返回
          </IconButton>
          <IconButton icon="save" onClick={() => {}}>
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
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 px-56"
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
            >
              {form.watch("openingDates").length ? (
                <ul>
                  {form.getValues("openingDates").map((dateRange) => {
                    return (
                      <DateRange
                        key={dateRange.id}
                        onRemove={() => onRemoveOpeningDateRange(dateRange.id)}
                        onSave={(dateRange: DateRange) =>
                          onSaveOpeningDateRange(dateRange)
                        }
                        data={dateRange}
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
            >
              {form.watch("openingHours").length ? (
                <ul>
                  {form.getValues("openingHours").map((hours) => {
                    return (
                      <TimeRange
                        key={hours.id}
                        // onRemove={() => onRemoveOpeningDateRange(hours.id)}
                        // onSave={(dateRange:DateRange) => onSaveOpeningDateRange(dateRange)}
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

function FormTextField({
  name,
  label,
}: {
  name: "name" | "description";
  label: string;
}) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-baseline gap-5">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <UnderscoredInput
              placeholder={`請輸入${label}`}
              className="h-7 p-0 pb-1"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Section({
  title,
  subTitle,
  inputButtonElement,
  inputButtonText,
  children,
}: {
  title: string;
  subTitle?: string;
  inputButtonElement: ReactElement;
  inputButtonText: string;
  children: ReactNode;
}) {
  return (
    <section>
      <header className="flex items-center py-2.5 pl-5 ">
        <span className="font-semibold">{title}</span>
        {subTitle && (
          <span className="ml-1 text-sm text-word-red">{subTitle}</span>
        )}

        <label className="relative ml-auto bg-white">
          <div className={cn(button({ size: "short" }), "cursor-pointer")}>
            <img src={plusIcon} />
            {inputButtonText}
          </div>
          {inputButtonElement}
        </label>
      </header>

      <div className="border-y border-line-gray bg-white text-center text-word-gray">
        {children}
      </div>
    </section>
  );
}

function PreviewImage({
  file,
  onRemoveImage,
}: {
  file: FileWithId;
  onRemoveImage: (id: string) => void;
}) {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = (e) => {
      setImgSrc((e.target?.result ?? "") as string);
    };
  }, [file]);

  return (
    <div className="group relative h-32 w-32">
      <button
        type="button"
        className="absolute right-0 top-0 hidden h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full border border-line-red group-hover:block"
        onClick={() => onRemoveImage(file.id)}
      >
        <img src={redXIcon} />
      </button>
      <img src={imgSrc} className="h-full w-full  object-contain" />
    </div>
  );
}

function DateRange({
  onRemove,
  onSave,
  data,
}: {
  onRemove: () => void;
  onSave: (dr: DateRange) => void;
  data: DateRange;
}) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
  });

  function onSaveDateRange() {
    if (!start)
      setErrorFields((errorFields) => ({ ...errorFields, start: true }));
    if (!end) setErrorFields((errorFields) => ({ ...errorFields, end: true }));

    if (start && end) {
      onSave({
        id: data.id,
        start,
        end,
        saved: true,
      });
    }
  }

  return (
    <li
      className={cn(
        "flex items-center border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 ",
        !data.saved && "border-b-orange bg-hover-orange",
      )}
    >
      <DatePicker
        date={start}
        setDate={setStart}
        error={!!errorFields["start"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, start: false }))}
        toDate={end ? addDays(end, -1) : undefined}
      />
      <span className="px-2.5 text-secondary-dark">～</span>
      <DatePicker
        date={end}
        setDate={setEnd}
        error={!!errorFields["end"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, end: false }))}
        fromDate={start ? addDays(start, 1) : undefined}
      />

      <div className="ml-auto flex gap-4">
        {data.saved ? (
          <>
            <button type="button">
              <img src={trashCanIcon} />
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onSaveDateRange}>
              <img src={greenFileIcon} />
            </button>
            <button type="button" onClick={onRemove}>
              <img src={redXIcon} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

function TimeRange({ data }: { data: TimeRange }) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);

  return (
    <li className="flex items-center border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 text-secondary-dark ">
      <UnderscoredInput
        className="h-7 w-24 text-center"
        value={start}
        onChange={(e) => {
          const value = e.target.value;

          switch (value.length) {
            case 0:
              setStart("");
              break;
            case 1:
              if (+value >= 0 && +value <= 9) setStart(value);
              break;
            case 2:
              if (
                (+value[0] === 0 || +value[0] === 1) &&
                +value[1] >= 0 &&
                +value[1] <= 9
              ) {
                start.length === 1 && setStart(value + ":");
                start.length === 3 && setStart(value);
              } else if (+value[0] === 2 && +value[1] >= 0 && +value[1] <= 3)
                setStart(value + ":");
              break;
            case 3:
              setStart(e.target.value);
              break;
            case 4:
              if (+value[3] >= 0 && +value[3] <= 5) setStart(value);
              break;
            case 5:
              if (+value[4] >= 0 && +value[4] <= 9) setStart(value);
              break;
          }
        }}
        placeholder="開始時間"
        inputMode="numeric"
      />

      <span className="px-2.5 text-secondary-dark">～</span>
      <input
        className={cn("h-7 w-24", end && "text-word-gray")}
        value={end ?? "結束時間"}
        onChange={(e) => setStart(e.target.value)}
      />
    </li>
  );
}
