import { TECH } from "../data/f77";

export default function Technology() {
  const { power, smart, safety } = TECH;

  return (
    <section id="features" className="section">
      <div className="shell">
        <div style={{ marginBottom: 44 }}>
          <div className="eyebrow">04 — Technology</div>
          <h2 className="section-title" style={{ maxWidth: "16ch" }}>
            A host of all-new breakthrough features.
          </h2>
        </div>

        {/* Power module */}
        <div className="feat">
          <div className="feat-media">
            <span className="tag">Fig. 02 — Power module</span>
            <img src={power.img} alt="Boost charger" />
          </div>
          <div>
            <div className="kicker">{power.kicker}</div>
            <h3>{power.title}</h3>
            <p>{power.body}</p>
            <div className="feat-rows">
              {power.rows.map(([k, v, accent]) => (
                <div key={k} className={`r${accent ? " accent" : ""}`}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart ride (reversed) */}
        <div className="feat reverse">
          <div>
            <div className="kicker">{smart.kicker}</div>
            <h3>{smart.title}</h3>
            <p>{smart.body}</p>
            <div className="feat-grid">
              {smart.grid.map(([v, k, accent]) => (
                <div key={k} className={`feat-tile${accent ? " accent" : ""}`}>
                  <div className="v">{v}</div>
                  <div className="k">{k}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="feat-media">
            <span className="tag">Fig. 03 — Smart ride</span>
            <img src={smart.img} alt="Smart ride" />
          </div>
        </div>

        {/* Safety */}
        <div className="feat">
          <div className="feat-media">
            <span className="tag">Fig. 04 — Safety</span>
            <img src={safety.img} alt="Chassis detail" />
          </div>
          <div>
            <div className="kicker">{safety.kicker}</div>
            <h3>{safety.title}</h3>
            <p>{safety.body}</p>
            <div className="chips">
              {safety.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
