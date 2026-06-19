export function Footer() {
  return (
    <footer className="border-t border-line bg-panel-2 px-10 py-7">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4">
        <div className="font-display text-[1.05rem] font-extrabold">
          <span className="text-blue">EV</span>
          <span className="text-green">Champ</span>{" "}
          <span className="font-sans text-[0.82rem] font-medium text-body">· Decision Toolkit</span>
        </div>
        <div className="text-[0.78rem] text-muted">
          Figures are estimates for guidance. Confirm pricing &amp; range at your dealer.
        </div>
      </div>
    </footer>
  );
}
