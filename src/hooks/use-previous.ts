import { useEffect, useRef } from "react";

export function usePrevious<K>(v: K) {
  const state = useRef<typeof v | undefined>(undefined);

  useEffect(() => {
    state.current = v;
  }, [v]);

  return state.current;
}
