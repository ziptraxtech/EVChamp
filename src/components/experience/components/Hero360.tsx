import { useCallback, useEffect, useRef, useState } from "react";
import { FRAMES, INITIAL_FRAME, HERO_STATS } from "../data/f77";

const STEP_PX = 36;
const FRAME_COUNT = FRAMES.length;

export default function Hero360() {
  const [frame, setFrame] = useState(INITIAL_FRAME);
  const [auto, setAuto] = useState(false);
  const [dragging, setDragging] = useState(false);
  const autoRef = useRef<number | null>(null);
  const drag = useRef({ active: false, startX: 0, startFrame: 0 });

  const show = useCallback((i: number) => {
    setFrame(((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT);
  }, []);

  // auto-rotate
  useEffect(() => {
    if (auto) {
      autoRef.current = window.setInterval(() => {
        setFrame((f) => (f + 1) % FRAME_COUNT);
      }, 480);
    }
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current);
      autoRef.current = null;
    };
  }, [auto]);

  // drag (mouse + touch) bound to window while active
  useEffect(() => {
    const getX = (e: MouseEvent | TouchEvent) =>
      "touches" in e ? e.touches[0].clientX : e.clientX;

    const move = (e: MouseEvent | TouchEvent) => {
      if (!drag.current.active) return;
      const dx = getX(e) - drag.current.startX;
      const steps = Math.round(dx / STEP_PX);
      show(drag.current.startFrame - steps);
      if ("touches" in e && e.cancelable) e.preventDefault();
    };
    const up = () => {
      drag.current.active = false;
      setDragging(false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [show]);

  const startDrag = (clientX: number) => {
    setAuto(false);
    drag.current = { active: true, startX: clientX, startFrame: frame };
    setDragging(true);
  };

  return (
    <section id="orbit" className="hero">
      <div className="shell">
        <div className="hero__head">
          <div className="badge">
            <span className="dot">●</span> Ultraviolette F77 · SuperStreet
          </div>
          <h1>
            Every angle of the <span className="gradient-text">machine</span>.
          </h1>
          <p className="hero__sub">
            A full 360° study of the F77 — drag to rotate through every degree, and explore the
            engineering beneath the surface.
          </p>
        </div>

        <div className="turntable">
          <div className="turntable__bar">
            <div className="turntable__tag">
              <span className="led" /> 360° View
            </div>
            <div className="turntable__count">
              Frame <b>{frame + 1}</b> / {String(FRAME_COUNT).padStart(2, "0")}
            </div>
          </div>

          <div
            className={`stage${dragging ? " dragging" : ""}`}
            onMouseDown={(e) => startDrag(e.clientX)}
            onTouchStart={(e) => startDrag(e.touches[0].clientX)}
          >
            <div
              className="stage__ring"
              style={{ transform: `translateX(-50%) rotate(${frame * 45}deg)` }}
            />
            <div className="stage__shadow" />

            {FRAMES.map((f, i) => (
              <div
                key={i}
                className={`stage__frame${i === frame ? " active" : ""}${
                  f.flip ? " flip" : ""
                }`}
              >
                <img src={f.src} alt={`F77 at ${i * 45}°`} draggable={false} />
              </div>
            ))}

            <div className="stage__heading">
              <div className="deg">{String(frame * 45).padStart(3, "0")}°</div>
              <div className="lbl">Heading</div>
            </div>
          </div>

          <div className="turntable__controls">
            <span className="hint">
              <span className="ico">↻</span> Drag to rotate
            </span>
            <div className="controls__right">
              <div className="dots">
                {FRAMES.map((_, i) => (
                  <button
                    key={i}
                    className={i === frame ? "active" : ""}
                    aria-label={`Go to frame ${i + 1}`}
                    onClick={() => {
                      setAuto(false);
                      show(i);
                    }}
                  />
                ))}
              </div>
              <button className="auto-btn" onClick={() => setAuto((a) => !a)}>
                <span className="ico">{auto ? "❚❚" : "▶"}</span>
                <span>{auto ? "Pause" : "Auto-rotate"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="stats">
          {HERO_STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="num">
                {s.decimals ? s.target.toFixed(s.decimals) : s.target}
                <small> {s.unit}</small>
              </div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
