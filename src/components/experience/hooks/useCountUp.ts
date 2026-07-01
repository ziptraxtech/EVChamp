import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 → target once the element scrolls into view.
 * Returns a ref to attach and the current display string.
 */
export function useCountUp(target: number, decimals: number, duration = 1500) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState("0");
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue((target * eased).toFixed(decimals));
        if (p < 1) requestAnimationFrame(tick);
        else setValue(target.toFixed(decimals));
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            animate();
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, decimals, duration]);

  return { ref, value };
}
