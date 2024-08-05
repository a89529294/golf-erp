import { useEffect, useRef } from "react";

export function useIsMount() {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = false;
  });

  return mounted.current;
}
