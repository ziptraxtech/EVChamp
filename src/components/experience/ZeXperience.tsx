import { useState } from "react";
import { Helmet } from "react-helmet-async";
import "./experience.css";
import AnnounceBar from "./components/AnnounceBar";
import Navbar from "./components/Navbar";
import Hero360 from "./components/Hero360";
import Finishes from "./components/Finishes";
import Performance from "./components/Performance";
import DesignDetails from "./components/DesignDetails";
import Technology from "./components/Technology";
import Gallery from "./components/Gallery";
import Specs from "./components/Specs";
import CTA from "./components/CTA";
import RegisterModal, { type ModalMode } from "./components/RegisterModal";
import Footer from "../../Footer";

/**
 * Ze.Xperience page — the Ultraviolette F77 360° product experience
 * (originally the standalone z.experience Vite app) ported into EVChamp.
 * The `.ze-xperience` wrapper scopes all styling so it cannot leak into the
 * rest of the site (same pattern as the EV Marketplace port).
 */
export default function ZeXperience() {
  const [modal, setModal] = useState<ModalMode>(null);

  return (
    <>
      <div className="ze-xperience">
        <Helmet>
          <title>Ze.Xperience — Ultraviolette F77 360° | EVChamp</title>
          <meta
            name="description"
            content="A full 360° study of the Ultraviolette F77 — drag to rotate through every degree, explore finishes, performance and the engineering beneath the surface."
          />
        </Helmet>
        <div className="page">
          {/* F77-themed announcement strip, mirrors the EV Showcase offers bar. */}
          <AnnounceBar onAction={() => setModal("interest")} />
          {/* Page-local sub-navbar, sticks just below EVChamp's global header. */}
          <Navbar onRegister={() => setModal("interest")} />
          <Hero360 />
          <Finishes />
          <Performance />
          {/* Design comes right after Performance, per the product spec */}
          <DesignDetails />
          <Technology />
          <Gallery />
          <Specs />
          <CTA onRegister={() => setModal("interest")} />
          <RegisterModal mode={modal} onClose={() => setModal(null)} />
        </div>
      </div>
      {/* Shared EVChamp site footer, rendered outside the scoped wrapper so it
          matches the rest of the site (same pattern as the EV Marketplace port). */}
      <Footer />
    </>
  );
}
