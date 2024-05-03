import { NumberInput } from "@/components/number-input";
import { IconShortButton } from "@/components/ui/button";
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
  reducer,
} from "@/pages/system-management/app-expenditure-level/reducer";
import { useActionData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StoreCategory, storeCategoryMap } from "@/utils";

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
    const newLevel = {
      ...level,
      disabled: true,
      errorState: null,
      snapshot: null,
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

// const levels = [
//   {
//     id: "1",
//     minConsumption: 0,
//     maxConsumption: 100,
//     canAppointDays: 10,
//     disabled: true,
//     errorState: null,
//     snapshot: null,
//   },
//   {
//     id: "2",
//     minConsumption: 101,
//     maxConsumption: 200,
//     canAppointDays: 20,
//     disabled: true,
//     errorState: null,
//     snapshot: null,
//   },
// ];

function Section({
  levels,
  category,
}: {
  levels: Level[];
  category: StoreCategory;
}) {
  const [expenditureLevels, dispatch] = useReducer(reducer, levels);
  const isSomeLevelBeingEdited = expenditureLevels.some(
    (level) => !level.disabled,
  );

  return (
    <section>
      <header className="flex items-center ">
        <label className="block px-6 py-5">
          <input type="checkbox" className="peer hidden" />
          <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:before:block" />
        </label>
        <div className="font-semibold">{storeCategoryMap[category]}</div>
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
          className="ml-auto mr-px"
          disabled={isSomeLevelBeingEdited}
        >
          新增級距
        </IconShortButton>
      </header>

      <ul className="bg-white">
        {expenditureLevels.map((level) => {
          return <Li level={level} dispatch={dispatch} key={level.id} />;
        })}
      </ul>
    </section>
  );
}

function Li({ level, dispatch }: { level: Level; dispatch: Dispatch<Action> }) {
  const minConsumptionRef = useRef<HTMLInputElement>(null);
  const maxConsumptionRef = useRef<HTMLInputElement>(null);
  const isMinConsumptionError = level.errorState?.field === "minConsumption";
  const isMaxConsumptionError = level.errorState?.field === "maxConsumption";

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
        <input type="checkbox" className="peer hidden" />
        <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:before:block" />
      </label>

      <div className="flex items-center gap-2.5">
        消費級距
        <div className="flex items-center">
          <div className="relative">
            <NumberInput
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
              autoFocus
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
                payload: { levelId: level.id },
              })
            }
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
          >
            <img src={redXIcon} />
          </button>
        </div>
      )}
    </li>
  );
}
