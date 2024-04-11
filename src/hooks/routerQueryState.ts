import { useRouter } from "next/router";
import {
  type DependencyList,
  type Dispatch,
  type EffectCallback,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { useIsClient } from "usehooks-ts";

export const useClient = (
  func: EffectCallback,
  deps: DependencyList | undefined,
) => {
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      func();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export const useRouterQueryState = <T>(
  key: string,
  defaultValue?: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const router = useRouter();

  const serialize = (value: T): string | undefined => {
    return value as string;
  };

  const deserialize = (value: string): T => {
    // default deserializer for number type
    if (typeof defaultValue === "number") {
      const numValue = Number(value === "" ? "r" : value);
      return isNaN(numValue) ? (defaultValue as T) : (numValue as T);
    }
    return value as T;
  };

  const [state, setState] = useState<T>(() => {
    const value = router.query[key];
    if (value === undefined) {
      return defaultValue as T;
    }
    return deserialize(value as string);
  });

  useClient(() => {
    //! Don't manipulate the query parameter directly
    const serializedState = serialize(state);
    const _q = router.query;

    if (serializedState === undefined || serializedState === defaultValue) {
      if (router.query[key]) {
        delete _q[key];
        router.query = _q;

        void router.replace(
          {
            query: router.query,
          },
          undefined,
          { shallow: true },
        );
      }
    } else {
      _q[key] = serializedState;
      router.query = _q;

      void router.replace(
        {
          query: {
            ..._q,
            [key]: router.query[key],
          },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [state, key]);

  useEffect(() => {
    if (router.query?.[key] && router.query[key] !== state) {
      setState(router.query[key] as T);
    }
  }, [router.query, state, key]);

  return [state, setState];
};
