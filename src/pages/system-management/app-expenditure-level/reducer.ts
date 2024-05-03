function assertNever(arg: never) {
  throw new Error(arg);
}

type Snapshot = {
  minConsumption: number | "";
  maxConsumption: number | "";
  canAppointDays: number | "";
};

export type Level = {
  id: string;
  disabled: boolean;
  errorState: null | {
    field: string;
    msg: string;
  };
  snapshot: Snapshot | null;
} & Snapshot;

export type Action =
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
      };
    }
  | {
      type: "update-edit-status-save";
      payload: {
        levelId: string;
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
    };

export const reducer = (state: Level[], action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case "update-max-consumption":
    case "update-min-consumption": {
      const numericValue = Number(payload.value);
      if (Number.isNaN(numericValue) || numericValue < 0) return state;

      const isMinConsumption = action.type === "update-min-consumption";

      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? {
              ...prevLevel,
              [isMinConsumption ? "minConsumption" : "maxConsumption"]:
                numericValue,
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
      return state.map((prevLevel) =>
        prevLevel.id === action.payload.levelId
          ? {
              ...prevLevel,
              minConsumption: prevLevel.snapshot?.minConsumption ?? "",
              maxConsumption: prevLevel.snapshot?.maxConsumption ?? "",
              disabled: true,
            }
          : prevLevel,
      );
    }
    case "update-edit-status-save": {
      const foundLevelIndex = state.findIndex(
        (prevLevel) => prevLevel.id === action.payload.levelId,
      );
      const foundLevel = state[foundLevelIndex];
      if (foundLevel.minConsumption >= foundLevel.maxConsumption)
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
        state[foundLevelIndex - 1].maxConsumption >= foundLevel.minConsumption
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
        foundLevelIndex <= state.length - 1 &&
        foundLevel.maxConsumption >= state[foundLevelIndex + 1].minConsumption
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
            ? { ...prevLevel, disabled: true, errorState: null }
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
      let newMinConsumption: number | "" = "";

      if (prevLevel && prevLevel.maxConsumption)
        newMinConsumption = prevLevel.maxConsumption + 1;

      const newLevel = {
        id: payload.levelId,
        minConsumption: newMinConsumption,
        maxConsumption: "",
        canAppointDays: "",
        errorState: null,
        snapshot: {
          minConsumption: newMinConsumption,
          maxConsumption: "",
          canAppointDays: "",
        },
        disabled: false,
      } as const;
      return [...state, newLevel];
    }
    default: {
      assertNever(type);
      return state;
    }
  }
};
