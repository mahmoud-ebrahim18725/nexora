"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "./api-error";

type ResourceState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  reload: () => void;
};

// Loads data on mount and whenever `key` changes; `reload` refetches in place
// without clearing the current data.
export function useResource<T>(
  load: () => Promise<T>,
  key: string,
): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    let isCurrent = true;
    loadRef
      .current()
      .then((result) => {
        if (isCurrent) {
          setData(result);
          setError(null);
        }
      })
      .catch((caughtError: unknown) => {
        if (isCurrent) {
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error("Something went wrong"),
          );
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [key, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return { data, error, isLoading: !data && !error, reload };
}

export function getErrorMessage(error: unknown) {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong. Please try again.";
}
