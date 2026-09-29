"use client";

import { useCallback, useEffect, useState } from "react";

export type ResourceState<T> =
  | { status: "loading"; data: null; error: "" }
  | { status: "ready"; data: T; error: "" }
  | { status: "error"; data: null; error: string };

export function useAsyncResource<T>(load: () => Promise<T>) {
  const [state, setState] = useState<ResourceState<T>>({ status: "loading", data: null, error: "" });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(load)
      .then((data) => { if (active) setState({ status: "ready", data, error: "" }); })
      .catch((reason: unknown) => { if (active) setState({ status: "error", data: null, error: reason instanceof Error ? reason.message : "Could not load this data." }); });
    return () => { active = false; };
  }, [load, revision]);
  const reload = useCallback(() => {
    setState({ status: "loading", data: null, error: "" });
    setRevision((value) => value + 1);
  }, []);
  const setData = useCallback((data: T) => setState({ status: "ready", data, error: "" }), []);
  return { ...state, reload, setData };
}
