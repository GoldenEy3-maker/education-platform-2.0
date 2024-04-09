import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

export const usePersistedQueryState = <T extends string>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const router = useRouter();

  const [state, set] = useState(defaultValue);
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const query = useMemo(() => router.query[key] as T, [router.query, key]);

  const setState: React.Dispatch<React.SetStateAction<T>> = (arg) => {
    set(arg);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = undefined;
    }

    timeoutIdRef.current = setTimeout(() => {
      router
        .replace(
          {
            query: {
              ...router.query,
              [key]: typeof arg === "function" ? arg(state) : arg,
            },
          },
          {
            query: {
              ...router.query,
              [key]: typeof arg === "function" ? arg(state) : arg,
            },
          },
          {
            scroll: false,
          },
        )
        .then((val) => val)
        .catch((error) => console.error(error));
    }, 500);
  };

  useEffect(() => {
    if (query) set(query);
  }, [query]);

  return [state, setState];
};
