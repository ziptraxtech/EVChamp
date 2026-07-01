export default function CTA({ onRegister }: { onRegister: () => void }) {
  return (
    <section id="register" className="section">
      <div className="shell">
        <div className="cta">
          <div className="cta__blob cta__blob--a" />
          <div className="cta__blob cta__blob--b" />
          <div className="cta__inner">
            <div className="badge">
              <span className="dot">●</span> Experience the F77
            </div>
            <h2>See it in person.</h2>
            <p>
              Register your interest and be the first to feel the 360° come alive at a UV
              SpaceStation.
            </p>
            <div className="cta__actions">
              <button className="btn btn--white" onClick={onRegister}>
                Register interest
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
