import { ANNOUNCE } from "../data/f77";

/**
 * Full-width announcement strip at the top of the Ze.Xperience page — the
 * F77-themed counterpart to the EV Showcase "offers are live" bar. Clicking it
 * opens the test-ride modal.
 */
export default function AnnounceBar({ onAction }: { onAction: () => void }) {
  return (
    <button type="button" className="announce" onClick={onAction}>
      <span className="announce__msg">
        <span className="announce__led" />
        <span className="announce__lead">{ANNOUNCE.lead}</span>
        <b className="announce__benefit">{ANNOUNCE.benefit}</b>
      </span>
      <span className="announce__pill">
        {ANNOUNCE.cta}
        <span aria-hidden>›</span>
      </span>
    </button>
  );
}
