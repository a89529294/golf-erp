export function onChange(
  e: React.ChangeEvent<HTMLInputElement>,
  time: string,
  setTime: React.Dispatch<React.SetStateAction<string>>,
  type: "start" | "end",
  start: string,
  end: string,
  endRef: React.RefObject<HTMLInputElement>,
  feeRef: React.RefObject<HTMLInputElement>,
) {
  const value = e.target.value;

  switch (value.length) {
    case 0:
      setTime("");
      break;
    case 1:
      if (+value >= 0 && +value <= 2) {
        if (type === "start") setTime(value);
        else if (+value >= +start[0]) setTime(value);
      }
      break;
    case 2:
      if (
        (+value[0] === 0 || +value[0] === 1) &&
        +value[1] >= 0 &&
        +value[1] <= 9
      ) {
        if (type === "start") {
          time.length === 1 && setTime(value + ":");
          time.length === 3 && setTime(value);
        } else if (+value >= +start.substring(0, 2)) {
          time.length === 1 && setTime(value + ":");
          time.length === 3 && setTime(value);
        }
      } else if (+value[0] === 2 && +value[1] >= 0 && +value[1] <= 3) {
        if (type === "start") {
          time.length === 1 && setTime(value + ":");
          time.length === 3 && setTime(value);
        } else if (+value >= +start.substring(0, 2)) {
          time.length === 1 && setTime(value + ":");
          time.length === 3 && setTime(value);
        }
      }
      break;
    case 3: {
      const value2 = value[2];

      if (value2 === ":") setTime(e.target.value);
      else if (+value2 >= 0 && +value2 <= 5) {
        if (type === "start") setTime(value[0] + value[1] + ":" + value2);
        else if (+value2 >= +start[3])
          setTime(value[0] + value[1] + ":" + value2);
      }
      break;
    }
    case 4:
      if (+value[3] >= 0 && +value[3] <= 5) {
        if (type === "start") setTime(value);
        else {
          if (+end.substring(0, 2) > +start.substring(0, 2)) setTime(value);
          else if (+value[3] >= +start[3]) setTime(value);
        }
      }
      break;
    case 5:
      if (+value[4] >= 0 && +value[4] <= 9) {
        if (type === "start") {
          setTime(value);
          endRef.current?.focus();
        } else {
          if (+end.substring(0, 2) > +start.substring(0, 2)) {
            setTime(value);
            feeRef.current?.focus();
          } else if (+value.substring(3) > +start.substring(3)) {
            setTime(value);
            feeRef.current?.focus();
          }
        }
      }
      break;
  }
}
