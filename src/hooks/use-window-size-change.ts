import { useEffect, useRef } from "react";

export function useWindowSizeChange(cb: () => void) {
  const ref = useRef(cb);
  useEffect(() => {
    const fixedCb = ref.current;
    fixedCb();
    setTimeout(() => {
      fixedCb();
    }, 500);
    window.addEventListener("resize", fixedCb);

    return () => window.removeEventListener("resize", fixedCb);
  }, [cb]);
}
