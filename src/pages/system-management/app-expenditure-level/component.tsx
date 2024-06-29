import greenFileIcon from "@/assets/green-file-icon.svg";
import pencilIcon from "@/assets/pencil.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import { NumberInput } from "@/components/number-input";
import {
  IconShortButton,
  IconShortWarningButton,
} from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import {
  Action,
  Level,
  levelsReducer,
} from "@/pages/system-management/app-expenditure-level/levels-reducer";
import { StoreCategory, parseLocaleNumber, storeCategoryMap } from "@/utils";
import { isUUIDV4, privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dispatch,
  useEffect,
  useId,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useActionData } from "react-router-dom";
import { toast } from "sonner";
import { expenditureLevelQuery, loader } from "./loader";

export function Component() {
  const initialData = useActionData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...expenditureLevelQuery,
    initialData,
  });

  const sections: Record<StoreCategory, Level[]> = {
    golf: [],
    ground: [],
    simulator: [],
  };

  data.forEach((level) => {
    const newLevel: Level = {
      ...level,
      disabled: true,
      errorState: null,
      snapshot: null,
      saveToDb: false,
      toBeDeleted: false,
    };
    sections[level.category].push(newLevel);
  });

  const ref = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const cb = () =>
      setContainerHeight(ref.current?.getBoundingClientRect().height ?? 0);
    cb();

    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);

  return (
    <MainLayout>
      <div className="w-full self-stretch " ref={ref}>
        <ScrollArea
          style={{ height: `${containerHeight - 10}px` }}
          className="mb-2.5 border border-line-gray bg-light-gray p-5"
        >
          {containerHeight ? (
            <div className="flex flex-col gap-5 ">
              {(Object.entries(sections) as [StoreCategory, Level[]][]).map(
                ([category, levels]) => {
                  return (
                    <Section
                      category={category}
                      levels={levels}
                      key={category}
                    />
                  );
                },
              )}
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </MainLayout>
  );
}

function Section({
  levels,
  category,
}: {
  levels: Level[];
  category: StoreCategory;
}) {
  levels.sort((a, b) => +a.maxConsumption - +b.minConsumption);

  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [expenditureLevels, dispatch] = useReducer(levelsReducer, levels);
  const isSomeLevelBeingEdited = expenditureLevels.some(
    (level) => !level.disabled,
  );
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["save-expenditure-level"],
    mutationFn: async ({
      level,
      type,
      id,
    }: {
      level: Level;
      id: string;
      type: "old" | "new";
    }) => {
      if (type === "old") {
        await privateFetch(`/consumer-grade/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            minConsumption: parseLocaleNumber(level.minConsumption),
            maxConsumption: parseLocaleNumber(level.maxConsumption),
            canAppointDays: parseLocaleNumber(level.canAppointDays),
            category,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return { type };
      } else {
        const response = await privateFetch("/consumer-grade", {
          method: "POST",
          body: JSON.stringify({
            minConsumption: parseLocaleNumber(level.minConsumption),
            maxConsumption: parseLocaleNumber(level.maxConsumption),
            canAppointDays: parseLocaleNumber(level.canAppointDays),
            category,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        return {
          type,
          id: (await response.json()).id,
        };
      }
    },
    onSuccess: (data, variables) => {
      toast.success("更新成功");
      if (data.type === "old") {
        dispatch({
          type: "after-patch-level",
          payload: { levelId: variables.id },
        });
      } else {
        dispatch({
          type: "after-post-level",
          payload: { oldLevelId: variables.level.id, newLevelId: data.id },
        });
      }
    },
    onError: (_data, variables) => {
      toast.error("更新失敗");
      dispatch({
        type: "update-db-error",
        payload: { levelId: variables.id },
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["expenditure-level"],
      }),
  });

  const { mutateAsync: deleteLevels, isPending: deletingLevels } = useMutation({
    mutationKey: ["delete-levels"],
    mutationFn: async (ids: string[]) => {
      const promises = ids.map((id) =>
        privateFetch(`/consumer-grade/${id}`, {
          method: "DELETE",
        }),
      );

      await Promise.all(promises);
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["expenditure-level"],
      }),
    onSuccess: () => toast.success("移除成功"),
    onError: () => toast.error("移除失敗"),
  });

  const toggleSelected = (id: string, exclude = false) => {
    if (selectedLevels.includes(id) || exclude)
      setSelectedLevels(selectedLevels.filter((l) => l !== id));
    else setSelectedLevels([...selectedLevels, id]);
  };

  useEffect(() => {
    (async () => {
      const level = expenditureLevels.find((level) => level.saveToDb);

      if (level) {
        if (level.saveToDb === "new") {
          await mutateAsync({ level, type: "new", id: level.id });
        } else {
          await mutateAsync({ level, type: "old", id: level.id });
        }
      }
    })();
  }, [expenditureLevels, mutateAsync]);

  useEffect(() => {
    (async () => {
      const levelsToBeDeleted = expenditureLevels.filter(
        (level) => level.toBeDeleted,
      );
      if (levelsToBeDeleted.length) {
        await deleteLevels(levelsToBeDeleted.map((l) => l.id));

        dispatch({
          type: "delete-levels",
          payload: { levelIds: levelsToBeDeleted.map((l) => l.id) },
        });
        setSelectedLevels([]);
      }
    })();
  }, [expenditureLevels, deleteLevels]);

  return (
    <section>
      <header className="flex items-center gap-1">
        <label className="block px-6 py-5">
          <input
            type="checkbox"
            className="peer hidden"
            checked={
              selectedLevels.length === levels.length && levels.length !== 0
            }
            onChange={() => {
              if (selectedLevels.length === levels.length)
                setSelectedLevels([]);
              else setSelectedLevels(levels.map((level) => level.id));
            }}
          />
          <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:before:block" />
        </label>
        <div className="font-semibold">{storeCategoryMap[category]}</div>
        {selectedLevels.length > 0 && (
          <IconShortWarningButton
            icon="minus"
            className={cn("ml-auto", deletingLevels && "opacity-50")}
            onClick={() =>
              dispatch({
                type: "prep-delete-levels",
                payload: { levelIds: selectedLevels },
              })
            }
            disabled={deletingLevels}
          >
            移除
          </IconShortWarningButton>
        )}
        <IconShortButton
          onClick={() =>
            dispatch({
              type: "add-new-level",
              payload: {
                levelId: Date.now().toString(),
              },
            })
          }
          icon="plus"
          className={cn(
            "mr-px",
            selectedLevels.length === 0 && "ml-auto",
            deletingLevels && "opacity-50",
          )}
          disabled={isSomeLevelBeingEdited || deletingLevels}
        >
          新增級距
        </IconShortButton>
      </header>

      <ul className="bg-white">
        {expenditureLevels.map((level) => {
          return (
            <Li
              toggleSelected={toggleSelected}
              selected={selectedLevels.includes(level.id)}
              level={level}
              dispatch={dispatch}
              key={level.id}
            />
          );
        })}
        {expenditureLevels.length === 0 && (
          <li className="flex items-center justify-center border-y border-line-gray py-2.5 pr-5 text-word-gray">
            尚未新增級距
          </li>
        )}
      </ul>
    </section>
  );
}

function Li({
  level,
  dispatch,
  selected,
  toggleSelected,
}: {
  level: Level;
  dispatch: Dispatch<Action>;
  selected: boolean;
  toggleSelected: (s: string, exclude?: boolean) => void;
}) {
  const formId = useId();
  const minConsumptionRef = useRef<HTMLInputElement>(null);
  const maxConsumptionRef = useRef<HTMLInputElement>(null);
  const isMinConsumptionError = level.errorState?.field === "minConsumption";
  const isMaxConsumptionError = level.errorState?.field === "maxConsumption";

  const autoFocusMinConsumption = level.minConsumption === "";

  useEffect(() => {
    if (isMaxConsumptionError) maxConsumptionRef.current?.focus();
    if (isMinConsumptionError) minConsumptionRef.current?.focus();
  }, [isMaxConsumptionError, isMinConsumptionError]);

  return (
    <li
      key={level.id}
      className={cn(
        "flex items-center border-b border-line-gray pr-5 first-of-type:border-t",
        !level.disabled && "border-b-[1.5px] border-b-orange bg-hover-orange",
        level.errorState && "pb-3.5",
      )}
    >
      <label className="block px-6 py-6">
        <input
          type="checkbox"
          className="peer hidden"
          checked={selected}
          onChange={() => {
            toggleSelected(level.id);
            if (!level.disabled)
              dispatch({
                type: "update-edit-status-reset",
                payload: { levelId: level.id, isNew: level.isNew ?? false },
              });
          }}
        />
        <div className="grid size-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:before:block" />
      </label>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: "update-edit-status-save",
            payload: {
              levelId: level.id,
              saveToDB: isUUIDV4(level.id) ? "old" : "new",
            },
          });
        }}
        className="flex items-center gap-2.5"
        id={formId}
      >
        消費級距
        <div className="isolate flex items-center">
          <div className="relative">
            <NumberInput
              autoFocus={autoFocusMinConsumption}
              disabled={level.disabled}
              value={level.minConsumption}
              onChange={(e) =>
                dispatch({
                  type: "update-min-consumption",
                  payload: {
                    levelId: level.id,
                    value: e.target.value,
                  },
                })
              }
              onBlur={() =>
                dispatch({
                  type: "reset-error-state",
                  payload: { levelId: level.id },
                })
              }
              myRef={minConsumptionRef}
              className={cn(
                isMinConsumptionError && "border-red-500 focus:border-red-500",
              )}
            />
            {level.errorState?.field === "minConsumption" && (
              <p className="absolute bottom-0 translate-y-full whitespace-nowrap text-sm text-red-600">
                {level.errorState?.msg}
              </p>
            )}
          </div>

          <div className="black-circles-before-after relative z-10 h-px w-4 bg-secondary-dark"></div>

          <div className="relative">
            <NumberInput
              autoFocus={!autoFocusMinConsumption}
              disabled={level.disabled}
              value={level.maxConsumption}
              onChange={(e) =>
                dispatch({
                  type: "update-max-consumption",
                  payload: {
                    levelId: level.id,
                    value: e.target.value,
                  },
                })
              }
              onBlur={() =>
                dispatch({
                  type: "reset-error-state",
                  payload: { levelId: level.id },
                })
              }
              className={cn(
                isMaxConsumptionError && "border-red-500 focus:border-red-500",
              )}
              myRef={maxConsumptionRef}
            />
            {level.errorState?.field === "maxConsumption" && (
              <p className="absolute bottom-0 translate-y-full whitespace-nowrap text-sm text-red-600">
                {level.errorState?.msg}
              </p>
            )}
          </div>

          <div className="ml-12 flex items-center gap-2.5">
            <label>開放預定天數</label>
            <NumberInput
              disabled={level.disabled}
              value={level.canAppointDays}
              onChange={(e) =>
                dispatch({
                  type: "update-can-appoint-days",
                  payload: {
                    levelId: level.id,
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
        <button className="invisible" type="submit" />
      </form>

      {level.disabled && (
        <button
          className="ml-auto"
          onClick={() => {
            toggleSelected(level.id, true);
            dispatch({
              type: "update-edit-status-enabled",
              payload: {
                levelId: level.id,
                snapshot: {
                  minConsumption: level.minConsumption,
                  maxConsumption: level.maxConsumption,
                  canAppointDays: level.canAppointDays,
                },
              },
            });
          }}
        >
          <img src={pencilIcon} />
        </button>
      )}

      {!level.disabled && (
        <div className="ml-auto flex gap-4">
          <button
            type="submit"
            form={formId}
            disabled={!!level.saveToDb}
            className="disabled:opacity-50"
          >
            <img src={greenFileIcon} />
          </button>
          <button
            onClick={() =>
              dispatch({
                type: "update-edit-status-reset",
                payload: { levelId: level.id, isNew: level.isNew ?? false },
              })
            }
            disabled={!!level.saveToDb}
            className="disabled:opacity-50"
          >
            <img src={redXIcon} />
          </button>
        </div>
      )}
    </li>
  );
}
