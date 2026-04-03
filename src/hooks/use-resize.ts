"use client";

import { RefObject, useEffect } from "react";

export function useResize(
  ref: RefObject<HTMLElement | null>,
  resizeToContent: (el?: HTMLElement | null) => void
) {
  /* Initial resize after mount */
  useEffect(() => {
    if (!ref.current) return;

    const id = requestAnimationFrame(() => {
      resizeToContent(ref.current);
    });

    return () => cancelAnimationFrame(id);
  }, [ref, resizeToContent]);

  /* Observe content size changes */
  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(() => {
      resizeToContent(ref.current);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, resizeToContent]);
}