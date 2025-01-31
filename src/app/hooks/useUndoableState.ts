import { UndoableState } from "@/constants/types";
import { useState, useCallback } from "react";

export default function useUndoableState<T>(
  initialState: T
): [T, (newState: T) => void, UndoableState] {
  const [state, setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback(
    (newState: T) => {
      setPast((prev) => [...prev, state]);
      setState(newState);
      setFuture([]);
    },
    [state]
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setState(previous);
    setFuture([state, ...future]);
  }, [state, past, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setFuture(newFuture);
    setState(next);
    setPast([...past, state]);
  }, [state, past, future]);

  return [
    state,
    set,
    {
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
    },
  ];
}
