import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data/f77";

/**
 * Ze.Xperience page sub-navbar. Renders as a secondary bar that sticks just
 * below EVChamp's global site header (see experience.css `.nav`).
 */
export default function Navbar({ onRegister }: { onRegister: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav__brand">
        <span className="gradient-text">Ze.Xperience</span>
      </div>
      <div className="nav__links">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <button className="btn btn--primary btn--nav" onClick={onRegister}>
        Register
      </button>
    </nav>
  );
}
