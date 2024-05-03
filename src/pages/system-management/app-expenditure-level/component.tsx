import { NumberInput } from "@/components/number-input";
import {
  IconShortButton,
  IconShortWarningButton,
} from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import { expenditureLevelQuery, loader } from "./loader";
import {
  Dispatch,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import pencilIcon from "@/assets/pencil.svg";
import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import { cn } from "@/lib/utils";
import {
  Action,
  Level,
  levelsReducer,
} from "@/pages/system-management/app-expenditure-level/levels-reducer";
import { useActionData } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StoreCategory, storeCategoryMap } from "@/utils";
import { isUUIDV4, privateFetch } from "@/utils/utils";
import { toast } from "sonner";

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
      <div className=" w-full self-stretch" ref={ref}>
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
    mutationFn: async ({ level, id }: { level: Level; id?: string }) => {
      if (id) {
        await privateFetch(`/consumer-grade/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            minConsumption: level.minConsumption,
            maxConsumption: level.maxConsumption,
            canAppointDays: 10,
            category,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await privateFetch("/consumer-grade", {
          method: "POST",
          body: JSON.stringify({
            minConsumption: level.minConsumption,
            maxConsumption: level.maxConsumption,
            canAppointDays: 10,
            category,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    },
    onSuccess: () => toast.success("更新成功"),
    onError: () => toast.error("更新失敗"),
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

  const toggleSelected = (id: string) => {
    if (selectedLevels.includes(id))
      setSelectedLevels(selectedLevels.filter((l) => l !== id));
    else setSelectedLevels([...selectedLevels, id]);
  };

  useEffect(() => {
    (async () => {
      const level = expenditureLevels.find((level) => level.saveToDb);

      if (level) {
        if (level.saveToDb === "new") {
          await mutateAsync({ level });
        } else {
          await mutateAsync({ level, id: level.id });
        }

        dispatch({
          type: "reset-save-to-db-state",
          payload: { levelId: level.id },
        });
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
  toggleSelected: (s: string) => void;
}) {
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
          onChange={() => toggleSelected(level.id)}
        />
        <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:before:block" />
      </label>

      <div className="flex items-center gap-2.5">
        消費級距
        <div className="flex items-center">
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
          <div className="black-circles-before-after relative h-px w-4 bg-secondary-dark"></div>
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
        </div>
      </div>

      {level.disabled && (
        <button
          className="ml-auto"
          onClick={() => {
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
            onClick={() =>
              dispatch({
                type: "update-edit-status-save",
                payload: {
                  levelId: level.id,
                  saveToDB: isUUIDV4(level.id) ? "old" : "new",
                },
              })
            }
            disabled={!!level.saveToDb}
            className="disabled:opacity-50"
          >
            <img src={greenFileIcon} />
          </button>
          <button
            onClick={() =>
              dispatch({
                type: "update-edit-status-reset",
                payload: { levelId: level.id },
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
