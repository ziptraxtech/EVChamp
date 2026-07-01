import { useState } from "react";
import { FINISHES } from "../data/f77";

export default function Finishes() {
  const [i, setI] = useState(0);
  const f = FINISHES[i];

  return (
    <section id="finishes" className="section">
      <div className="shell">
        <div style={{ marginBottom: 30 }}>
          <div className="eyebrow">01 — Finishes</div>
          <h2 className="section-title">Three bold personalities.</h2>
        </div>

        <div className="finishes">
          <div className="finishes__stage">
            <span className="fig-label">Fig. 01 — Finish</span>
            <img
              key={f.img}
              className="finishes__img"
              src={f.img}
              alt={`F77 ${f.name}`}
              style={{ animation: "none" }}
            />
          </div>

          <div className="finishes__panel">
            <div className="kicker">Selected finish</div>
            <div className="finishes__name">{f.name}</div>
            <div className="finishes__tag">{f.tag}</div>

            <div className="swatches">
              {FINISHES.map((fin, idx) => (
                <div
                  key={fin.name}
                  className={`swatch${idx === i ? " active" : ""}`}
                  style={{ background: fin.swatch }}
                  onClick={() => setI(idx)}
                  role="button"
                  aria-label={fin.name}
                />
              ))}
            </div>
            <div className="kicker" style={{ marginBottom: 24 }}>
              {FINISHES.map((f) => f.name).join(" · ")}
            </div>

            <div className="mini-stats">
              <div className="mini-stat">
                <div className="num">
                  231<small> km</small>
                </div>
                <div className="lbl">Range</div>
              </div>
              <div className="mini-stat">
                <div className="num">
                  155<small> km/h</small>
                </div>
                <div className="lbl">Top speed</div>
              </div>
              <div className="mini-stat">
                <div className="num">
                  100<small> Nm</small>
                </div>
                <div className="lbl">Torque</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
