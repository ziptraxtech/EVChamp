import { SPECS } from "../data/f77";

export default function Specs() {
  return (
    <section id="specs" className="section section--panel">
      <div className="shell">
        <div style={{ marginBottom: 36 }}>
          <div className="eyebrow">06 — Specifications</div>
          <h2 className="section-title">The full readout.</h2>
        </div>

        <div className="specs-grid">
          {SPECS.map((group) => (
            <div className="spec-card" key={group.title}>
              <h4>{group.title}</h4>
              {group.rows.map(([k, v]) => (
                <div className="r" key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
