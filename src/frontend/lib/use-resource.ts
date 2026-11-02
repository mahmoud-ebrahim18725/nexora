"use client";

import { useCallback, useEffect, useState } from "react";
import { toApiError, type ApiError } from "./api-client";

type Result<T> = {
  load: () => Promise<T>;
  version: number;
  data?: T;
  error: ApiError | null;
};

// `load` must be stable (wrap it in useCallback); a new function refetches.
export function useResource<T>(load: () => Promise<T>) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    let active = true;
    load().then(
      (data) => {
        if (active) setResult({ load, version, data, error: null });
      },
      (error) => {
        if (active) setResult({ load, version, error: toApiError(error) });
      },
    );
    return () => {
      active = false;
    };
  }, [load, version]);

  const current = result?.load === load && result.version === version;
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return {
    data: result?.data,
    error: current ? result.error : null,
    loading: !current,
    reload,
  };
}
