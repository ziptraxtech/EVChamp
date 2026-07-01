import { useState } from "react";
import { DETAILS } from "../data/f77";

export default function DesignDetails() {
  const [i, setI] = useState(0);
  const d = DETAILS[i];

  return (
    <section id="detail" className="section">
      <div className="shell">
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow">03 — Design</div>
          <h2 className="section-title">Every line earns its place.</h2>
        </div>

        <div className="detail-grid">
          <div className="detail-stage">
            <img key={d.img} src={d.img} alt={d.name} />
            <div className="detail-cap">
              <div className="idx">
                {String(i + 1).padStart(2, "0")} / {String(DETAILS.length).padStart(2, "0")}
              </div>
              <div className="name">{d.name}</div>
            </div>
          </div>

          <div className="detail-list">
            {DETAILS.map((det, idx) => (
              <button
                key={det.code}
                className={`detail-btn${idx === i ? " active" : ""}`}
                onClick={() => setI(idx)}
                onMouseEnter={() => setI(idx)}
              >
                <div className="code">{det.code}</div>
                <div className="t">{det.name}</div>
                <div className="b">{det.blurb}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
