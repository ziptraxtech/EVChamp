import { GALLERY } from "../data/f77";

/**
 * Seamless auto-scrolling marquee. The track holds the list twice;
 * the CSS animation translates by -50%, so the loop is invisible.
 * Hover anywhere on the strip to pause.
 */
export default function Gallery() {
  const items = [...GALLERY, ...GALLERY];

  return (
    <section className="section" style={{ paddingInline: 0 }}>
      <div
        className="shell"
        style={{
          padding: "0 clamp(20px,5vw,52px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <div>
          <div className="eyebrow">05 — Gallery</div>
          <h2 className="section-title">Form in motion.</h2>
        </div>
        <span className="gallery-note">
          <span className="led" /> Auto-scrolling · hover to pause
        </span>
      </div>

      <div className="gallery-viewport">
        <div className="gallery-track">
          {items.map((g, idx) => (
            <figure className="g-card" key={idx} aria-hidden={idx >= GALLERY.length}>
              <img src={g.src} alt={idx < GALLERY.length ? g.caption : ""} />
              <div className="g-shade" />
              <figcaption className="g-cap">
                <span className="bar" />
                <span className="txt">{g.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
