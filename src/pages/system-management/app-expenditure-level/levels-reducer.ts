import { parseLocaleNumber, toLocaleNumber } from "@/utils";

function assertNever(arg: never) {
  throw new Error(arg);
}

type Snapshot = {
  minConsumption: string;
  maxConsumption: string;
  canAppointDays: string;
};

export type Level = {
  id: string;
  disabled: boolean;
  errorState: null | {
    field: string;
    msg: string;
  };
  snapshot: Snapshot | null;
  saveToDb: "new" | "old" | false;
  toBeDeleted: boolean;
  isNew?: boolean;
} & Snapshot;

export type Action =
  | {
      type: "update-can-appoint-days";
      payload: {
        levelId: string;
        value: string;
      };
    }
  | {
      type: "update-min-consumption";
      payload: {
        levelId: string;
        value: string;
      };
    }
  | {
      type: "update-max-consumption";
      payload: {
        levelId: string;
        value: string;
      };
    }
  | {
      type: "update-edit-status-reset";
      payload: {
        levelId: string;
        isNew: boolean;
      };
    }
  | {
      type: "update-db-error";
      payload: {
        levelId: string;
      };
    }
  | {
      type: "update-edit-status-save";
      payload: {
        levelId: string;
        saveToDB: Exclude<Level["saveToDb"], false>;
      };
    }
  | {
      type: "update-edit-status-enabled";
      payload: {
        levelId: string;
        snapshot: Snapshot;
      };
    }
  | {
      type: "reset-error-state";
      payload: {
        levelId: string;
      };
    }
  | {
      type: "add-new-level";
      payload: {
        levelId: string;
      };
    }
  | {
      type: "after-post-level";
      payload: {
        oldLevelId: string;
        newLevelId: string;
      };
    }
  | {
      type: "after-patch-level";
      payload: {
        levelId: string;
      };
    }
  | {
      type: "prep-delete-levels";
      payload: {
        levelIds: string[];
      };
    }
  | {
      type: "delete-levels";
      payload: {
        levelIds: string[];
      };
    };

export const levelsReducer = (state: Level[], action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case "update-can-appoint-days": {
      const numericValue = parseLocaleNumber(payload.value);
      if (Number.isNaN(numericValue) || numericValue < 0) return state;

      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? {
              ...prevLevel,
              canAppointDays: toLocaleNumber(numericValue),
            }
          : prevLevel,
      );
    }
    case "update-max-consumption":
    case "update-min-consumption": {
      const numericValue = parseLocaleNumber(payload.value);

      if (Number.isNaN(numericValue) || numericValue < 0) return state;

      const isMinConsumption = action.type === "update-min-consumption";

      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? {
              ...prevLevel,
              [isMinConsumption ? "minConsumption" : "maxConsumption"]:
                toLocaleNumber(numericValue),
            }
          : prevLevel,
      );
    }
    case "update-edit-status-enabled": {
      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? {
              ...prevLevel,
              snapshot: action.payload.snapshot,
              disabled: false,
            }
          : {
              ...prevLevel,
              disabled: true,
            },
      );
    }
    case "update-edit-status-reset": {
      if (payload.isNew) return state.filter((l) => !l.isNew);

      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? {
              ...prevLevel,
              minConsumption: prevLevel.snapshot?.minConsumption ?? "",
              maxConsumption: prevLevel.snapshot?.maxConsumption ?? "",
              canAppointDays: prevLevel.snapshot?.canAppointDays ?? "",
              disabled: true,
            }
          : prevLevel,
      ) as Level[];
    }
    case "update-db-error": {
      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? ({
              ...prevLevel,
              minConsumption: prevLevel.snapshot?.minConsumption ?? "",
              maxConsumption: prevLevel.snapshot?.maxConsumption ?? "",
              canAppointDays: prevLevel.snapshot?.canAppointDays ?? "",
              disabled: false,
              saveToDb: false,
            } as Level)
          : prevLevel,
      );
    }
    case "update-edit-status-save": {
      const foundLevelIndex = state.findIndex(
        (prevLevel) => prevLevel.id === action.payload.levelId,
      );
      const foundLevel = state[foundLevelIndex];
      if (foundLevel.minConsumption === "") {
        return state.map((prevLevel) =>
          prevLevel.id === action.payload.levelId
            ? {
                ...prevLevel,
                errorState: {
                  field: "minConsumption",
                  msg: "min spending cannot be left blank",
                },
              }
            : prevLevel,
        );
      } else if (foundLevel.maxConsumption === "") {
        return state.map((prevLevel) =>
          prevLevel.id === action.payload.levelId
            ? {
                ...prevLevel,
                errorState: {
                  field: "maxConsumption",
                  msg: "max spending needs to be more than previous max spending",
                },
              }
            : prevLevel,
        );
      }

      if (
        parseLocaleNumber(foundLevel.minConsumption) >=
        parseLocaleNumber(foundLevel.maxConsumption)
      )
        return state.map((prevLevel) =>
          prevLevel.id === action.payload.levelId
            ? {
                ...prevLevel,
                errorState: {
                  field: "maxConsumption",
                  msg: "max spending needs to be greater than min spending",
                },
              }
            : prevLevel,
        );
      else if (
        foundLevelIndex > 0 &&
        parseLocaleNumber(state[foundLevelIndex - 1].maxConsumption) >=
          parseLocaleNumber(foundLevel.minConsumption)
      ) {
        return state.map((prevLevel) =>
          prevLevel.id === action.payload.levelId
            ? {
                ...prevLevel,
                errorState: {
                  field: "minConsumption",
                  msg: "min spending needs to be more than previous max spending",
                },
              }
            : prevLevel,
        );
      } else if (
        foundLevelIndex < state.length - 1 &&
        parseLocaleNumber(foundLevel.maxConsumption) >=
          parseLocaleNumber(state[foundLevelIndex + 1].minConsumption)
      ) {
        return state.map((prevLevel) =>
          prevLevel.id === action.payload.levelId
            ? {
                ...prevLevel,
                errorState: {
                  field: "maxConsumption",
                  msg: "max spending needs to be less than next min spending",
                },
              }
            : prevLevel,
        );
      } else {
        return state.map((prevLevel) =>
          prevLevel.id === action.payload.levelId
            ? {
                ...prevLevel,
                errorState: null,
                disabled: true,
                saveToDb: action.payload.saveToDB,
              }
            : prevLevel,
        );
      }
    }
    case "reset-error-state": {
      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? { ...prevLevel, errorState: null }
          : prevLevel,
      );
    }
    case "add-new-level": {
      const prevLevel = state.at(-1);
      let newMinConsumption = "";

      if (prevLevel && prevLevel.maxConsumption)
        newMinConsumption = toLocaleNumber(
          parseLocaleNumber(prevLevel.maxConsumption) + 1,
        );

      const newLevel: Level = {
        id: payload.levelId,
        minConsumption: newMinConsumption,
        maxConsumption: "",
        canAppointDays: "10",
        errorState: null,
        snapshot: {
          minConsumption: newMinConsumption,
          maxConsumption: "",
          canAppointDays: "10",
        },
        disabled: false,
        saveToDb: false,
        toBeDeleted: false,
        isNew: true,
      };
      return [...state, newLevel];
    }
    case "after-post-level": {
      return state.map((prevLevel) =>
        prevLevel.id === action.payload.oldLevelId
          ? ({
              ...prevLevel,
              disabled: true,
              saveToDb: false,
              id: action.payload.newLevelId,
              isNew: false,
            } satisfies Level)
          : prevLevel,
      );
    }
    case "after-patch-level": {
      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? ({
              ...prevLevel,
              disabled: true,
              saveToDb: false,
            } satisfies Level)
          : prevLevel,
      );
    }
    case "prep-delete-levels": {
      return state.map((prevLevel) =>
        action.payload.levelIds.includes(prevLevel.id)
          ? ({
              ...prevLevel,
              toBeDeleted: true,
            } satisfies Level)
          : prevLevel,
      );
    }
    case "delete-levels": {
      return state.filter(
        (prevLevel) => !action.payload.levelIds.includes(prevLevel.id),
      );
    }
    default: {
      assertNever(type);
      return state;
    }
  }
};
