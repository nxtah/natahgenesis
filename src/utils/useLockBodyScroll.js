import { useLayoutEffect } from "react";

// Prevent body scroll when menu/modal is open
export default function useLockBodyScroll(lock = false) {
  useLayoutEffect(() => {
    if (!lock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [lock]);
}
