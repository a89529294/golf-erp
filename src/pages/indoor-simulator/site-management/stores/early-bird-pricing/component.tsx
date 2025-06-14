import { IconButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { privateFetch } from "@/utils/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { genEarlyBirdPricingForStoreQuery, loader } from "./loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { genIndoorSimulatorStoresWithSitesQuery } from "@/pages/indoor-simulator/site-management/loader";
import { Time24hrInput } from "@/components/time-input-24-hr";

const DAYS_OF_WEEK_CONFIG = [
  { dayNumber: 1, keyStr: "monday", label: "星期一" },
  { dayNumber: 2, keyStr: "tuesday", label: "星期二" },
  { dayNumber: 3, keyStr: "wednesday", label: "星期三" },
  { dayNumber: 4, keyStr: "thursday", label: "星期四" },
  { dayNumber: 5, keyStr: "friday", label: "星期五" },
  { dayNumber: 6, keyStr: "saturday", label: "星期六" },
  { dayNumber: 0, keyStr: "sunday", label: "星期日" },
] as const;

// ... (previous imports remain the same)

type TimeRange = {
  id: string;
  startTime: string;
  endTime: string;
  discount: number;
};

type DaySchedule = {
  id: string;
  day: number;
  enabled: boolean;
  timeRanges: TimeRange[];
};

type EarlyBirdPricingFormData = {
  specialPlans: DaySchedule[];
  isUseSpecialPlan: boolean;
};

interface TimeRangeFieldProps {
  control: Control<EarlyBirdPricingFormData>;
  dayIndex: number;
  rangeIndex: number;
  removeTimeRange: (index: number) => void;
  disabled?: boolean;
}

const TimeRangeField: React.FC<TimeRangeFieldProps> = ({
  control,
  dayIndex,
  rangeIndex,
  removeTimeRange,
  disabled = false,
}) => {
  const form = useFormContext<EarlyBirdPricingFormData>();
  const fieldClassName = disabled ? "opacity-50 pointer-events-none" : "";

  return (
    <div className="mb-3 grid grid-cols-1 items-end gap-x-4 gap-y-2 border-t border-gray-100 p-3 pt-3 first:border-t-0 md:grid-cols-[1fr_1fr_1fr_auto]">
      <Time24hrInput
        control={control}
        name={`specialPlans.${dayIndex}.timeRanges.${rangeIndex}.startTime`}
        label="開始時間"
      />

      <Time24hrInput
        control={control}
        name={`specialPlans.${dayIndex}.timeRanges.${rangeIndex}.endTime`}
        label="結束時間"
      />

      <FormField
        control={control}
        name={`specialPlans.${dayIndex}.timeRanges.${rangeIndex}.discount`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-medium text-gray-600">
              折扣 (例: 0.9 為9折)
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                disabled={disabled}
                {...field}
                value={field.value === undefined ? "" : String(field.value)}
                onChange={(e) => {
                  if (disabled) return;
                  const val = e.target.value;
                  let numVal;
                  if (val === "") {
                    numVal = 0;
                  } else {
                    const parsed = parseFloat(val);
                    if (!isNaN(parsed)) {
                      numVal = Math.min(Math.max(parsed, 0), 1);
                    } else {
                      numVal = 1;
                    }
                  }
                  field.onChange(numVal);
                  form.setValue(field.name, numVal, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  form.clearErrors(field.name);
                }}
                className={cn("h-9 w-60 text-sm", fieldClassName)}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <IconButton
        type="button"
        onClick={() => removeTimeRange(rangeIndex)}
        className="mt-4 h-9 self-center justify-self-start md:mb-[2px] md:mt-0 md:self-end"
        icon="trashCan"
        disabled={disabled}
      >
        刪除
      </IconButton>
    </div>
  );
};

interface EarlyBirdPricingFormProps {
  disabled?: boolean;
}

function EarlyBirdPricingForm({ disabled = false }: EarlyBirdPricingFormProps) {
  const form = useFormContext<EarlyBirdPricingFormData>();
  const { control } = form;

  const specialPlansArray = useFieldArray({
    control,
    name: "specialPlans",
  });

  const timeRangesArrays = Array.from({ length: 7 }, (_, i) =>
    useFieldArray({
      control,
      name: `specialPlans.${i}.timeRanges` as const,
    }),
  );

  console.log(specialPlansArray);

  const fieldClassName = disabled ? "opacity-50 pointer-events-none" : "";

  return (
    <div className="space-y-6 p-6">
      {specialPlansArray.fields.map((field, dayIndex) => {
        const dayConfig = DAYS_OF_WEEK_CONFIG[dayIndex];
        const {
          fields: timeRangeFields,
          append: appendTimeRange,
          remove: removeTimeRange,
        } = timeRangesArrays[dayIndex];

        return (
          <div
            key={field.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-700">
                {dayConfig.label}
              </h4>
              <Controller
                name={`specialPlans.${dayIndex}.day`}
                control={control}
                defaultValue={dayConfig.dayNumber}
                render={({ field }) => (
                  <input
                    type="hidden"
                    {...field}
                    value={field.value || dayConfig.dayNumber}
                  />
                )}
              />
              <IconButton
                type="button"
                onClick={() => {
                  appendTimeRange({
                    id: crypto.randomUUID(),
                    startTime: "09:00",
                    endTime: "12:00",
                    discount: 0.1,
                  });
                  form.clearErrors(`specialPlans.${dayIndex}.timeRanges`);
                }}
                disabled={disabled}
                icon="plus"
              >
                新增時段
              </IconButton>
            </div>

            {timeRangeFields.length === 0 ? (
              <p className="py-2 text-sm italic text-gray-500">
                本日無特殊時段
              </p>
            ) : (
              timeRangeFields.map((range, rangeIndex) => (
                <TimeRangeField
                  key={range.id}
                  control={control}
                  dayIndex={dayIndex}
                  rangeIndex={rangeIndex}
                  removeTimeRange={removeTimeRange}
                  disabled={disabled}
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Component() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { user } = useAuth();

  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: stores } = useQuery({
    ...genIndoorSimulatorStoresWithSitesQuery(
      user!.isAdmin ? "all" : user!.allowedStores.simulator,
    ),
    initialData: initialData.stores,
    staleTime: 5000,
  });

  const { data: store } = useQuery({
    ...genEarlyBirdPricingForStoreQuery(storeId!),
    initialData: initialData.earlyBirdPricing,
    staleTime: 5000,
  });

  // Create default values once
  const getDefaultValues = useCallback(() => {
    const specialPlans = Array.from({ length: 7 }, (_, i) => {
      const day = i + 1;
      const existingPlan = store.specialPlans.find((p) => p.day === day);

      return (
        existingPlan || {
          day,
          timeRanges: [],
        }
      );
    });

    return { specialPlans, isUseSpecialPlan: store.isUseSpecialPlan };
  }, [store]);

  const form = useForm<EarlyBirdPricingFormData>({
    defaultValues: getDefaultValues(),
    disabled: !isEditing || isUpdating,
  });

  const onStoreValueChange = useCallback(
    (newStoreId: string, replace = false) => {
      navigate(
        `/indoor-simulator/site-management/stores/early-bird-pricing/${newStoreId}`,
        { replace },
      );
    },
    [navigate],
  );

  const handleSubmit = async (data: EarlyBirdPricingFormData) => {
    setIsUpdating(true);
    try {
      const response = await privateFetch(`/store/${storeId}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...data,
          specialPlans: data.specialPlans.map((v) => ({
            ...v,
            timeRanges: v.timeRanges.map((tr) => ({
              ...tr,
              startTime: tr.startTime + ":00",
              endTime: tr.endTime + ":00",
            })),
          })),
        } satisfies EarlyBirdPricingFormData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast.success("更新廠商成功");
      queryClient.invalidateQueries({ queryKey: ["early-bird-pricing"] });
      form.reset(data);
      setIsEditing(false);
    } catch (error) {
      toast.error("更新廠商失敗");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    form.reset(getDefaultValues());
    setIsEditing(false);
  };

  // Use proper dependency for the reset effect
  useEffect(() => {
    // Only reset the form when the storeId changes
    form.reset(getDefaultValues());
  }, [storeId, getDefaultValues]);

  const specialPlanCheckbox = (
    <label className="mr-2 flex cursor-pointer items-center gap-2">
      <span className="select-none">開放使用</span>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        {...form.register("isUseSpecialPlan")}
      />
    </label>
  );

  // Rest of your component code remains the same
  const viewContent = (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">早鳥優惠設定</h2>
        <div className="flex gap-2">
          {specialPlanCheckbox}
          <IconButton key="edit-button" icon="pencil" onClick={handleEdit}>
            編輯
          </IconButton>
        </div>
      </div>

      <EarlyBirdPricingForm disabled={true} />
    </div>
  );

  const editContent = (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">早鳥優惠設定</h2>
        <div className="flex gap-2">
          {specialPlanCheckbox}
          <IconButton
            type="button"
            onClick={handleCancel}
            icon="x"
            disabled={isUpdating}
            key="cancel-button"
          >
            取消
          </IconButton>
          <IconButton
            type="submit"
            icon="save"
            disabled={isUpdating || !form.formState.isDirty}
          >
            儲存
          </IconButton>
        </div>
      </div>
      <EarlyBirdPricingForm disabled={isUpdating} />
    </div>
  );

  return (
    <MainLayout
      headerChildren={
        <Select
          value={storeId}
          onValueChange={(v) => onStoreValueChange(v, false)}
        >
          <SelectTrigger className="h-11 w-[280px] rounded-none border-0 border-b border-secondary-dark">
            <SelectValue placeholder="選擇廠商" />
          </SelectTrigger>
          <SelectContent className="w-[280px]">
            {stores.length === 0 ? (
              <SelectItem key={0} value="undef" disabled>
                請先新增廠商
              </SelectItem>
            ) : (
              stores.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="h-full flex-1"
        >
          {isEditing ? editContent : viewContent}
        </form>
      </Form>
    </MainLayout>
  );
}
