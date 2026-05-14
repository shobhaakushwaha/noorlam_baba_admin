import { useRef, useCallback, useEffect } from "react";

export function useTemporaryDisable(delay = 2000) {
  const ref = useRef(null);
  const timerRef = useRef(null);

  const disable = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Prevent re-triggering
    if (el.dataset.disabled === "true") return;

    el.dataset.disabled = "true";

    // Handle form elements
    if ("disabled" in el) {
      el.disabled = true;
    } else {
      el.style.pointerEvents = "none";
      el.style.opacity = "0.6";
      el.setAttribute("aria-disabled", "true");
    }

    timerRef.current = setTimeout(() => {
      if (!el) return;

      delete el.dataset.disabled;

      if ("disabled" in el) {
        el.disabled = false;
      } else {
        el.style.pointerEvents = "";
        el.style.opacity = "";
        el.removeAttribute("aria-disabled");
      }
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return [ref, disable];
}
