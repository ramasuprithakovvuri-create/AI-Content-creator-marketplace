import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

// Keeps demo data across page refreshes (swap for a real database in production).
export function usePersistentState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full: ignore */ }
  }, [key, value]);
  return [value, setValue];
}
