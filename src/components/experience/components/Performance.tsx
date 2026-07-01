import { PERFORMANCE_STATS, type Stat } from "../data/f77";
import { useCountUp } from "../hooks/useCountUp";

function PerfCard({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp(stat.target, stat.decimals);
  return (
    <div className="perf-card">
      <div className="row">
        <span ref={ref} className="big gradient-text">
          {value}
        </span>
        <span className="unit">{stat.unit}</span>
      </div>
      <div className="lbl">{stat.label}</div>
    </div>
  );
}

export default function Performance() {
  return (
    <section id="performance" className="section section--panel">
      <div className="shell">
        <div className="perf-head">
          <div>
            <div className="eyebrow">02 — Performance</div>
            <h2 className="section-title" style={{ maxWidth: "14ch" }}>
              Super sonic performance.
            </h2>
          </div>
          <p>
            An aviation-derived electric drivetrain, delivering uncompromising performance across
            every condition.
          </p>
        </div>

        <div className="perf-grid">
          {PERFORMANCE_STATS.map((s) => (
            <PerfCard key={s.label} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
