import { useCallback, useSyncExternalStore } from "react";

const KEY = "campus-theme";
const listeners = new Set();

function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

function read() {
  return document.documentElement.dataset.theme || (systemPrefersDark() ? "dark" : "light");
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Theme is applied to <html data-theme>. An inline script in index.html applies the
// saved choice before first paint so there's no flash.
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light");

  const setTheme = useCallback((next) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this session */
    }
    listeners.forEach((cb) => cb());
  }, []);

  const toggle = useCallback(() => setTheme(read() === "dark" ? "light" : "dark"), [setTheme]);

  return { theme, setTheme, toggle };
}
