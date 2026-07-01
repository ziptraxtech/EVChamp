import { useEffect, useRef, useState } from "react";
import { FINISH_OPTIONS } from "../data/f77";

export type ModalMode = "interest" | "testride" | null;

interface FormData {
  name: string;
  email: string;
  city: string;
  finish: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterModal({
  mode,
  onClose,
}: {
  mode: ModalMode;
  onClose: () => void;
}) {
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    city: "",
    finish: FINISH_OPTIONS[0],
  });
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const open = mode !== null;
  const testride = mode === "testride";

  // reset + focus + lock scroll on open
  useEffect(() => {
    if (!open) return;
    setError(false);
    setDone(false);
    setData((d) => ({ ...d, name: "", email: "", city: "" }));
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => nameRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = () => {
    const valid = data.name.trim().length > 0 && EMAIL_RE.test(data.email.trim());
    if (!valid) {
      setError(true);
      return;
    }
    setError(false);
    // TODO: POST `data` to your API here.
    setDone(true);
  };

  const first = data.name.trim().split(" ")[0];

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel" role="dialog" aria-modal="true">
        <div className="modal__bar" />
        <button className="modal__close" aria-label="Close" onClick={onClose}>
          ✕
        </button>

        {!done ? (
          <div className="modal__form">
            <div className="kicker" style={{ color: "var(--green)" }}>
              {testride ? "Book a test ride" : "Register interest"}
            </div>
            <h3>{testride ? "Feel the 360° in person." : "Step into the F77."}</h3>
            <p>Drop your details and the UV crew will reach out. No payment, no commitment.</p>

            <div className="modal__fields">
              <label className="field">
                <span>Full name</span>
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Your name"
                  value={data.name}
                  onChange={set("name")}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={data.email}
                  onChange={set("email")}
                />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>City</span>
                  <input type="text" placeholder="City" value={data.city} onChange={set("city")} />
                </label>
                <label className="field">
                  <span>Finish</span>
                  <select value={data.finish} onChange={set("finish")}>
                    {FINISH_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>
              {error && (
                <div className="modal__error">Please enter your name and a valid email.</div>
              )}
              <button className="modal__submit" onClick={submit}>
                {testride ? "Book test ride" : "Submit"}
              </button>
            </div>
          </div>
        ) : (
          <div className="modal__success">
            <div className="check">✓</div>
            <h3>You're on the list.</h3>
            <p>
              Thanks <b>{first}</b> — your{" "}
              {testride ? "test ride on the " : "interest in the "}
              <b>{data.finish}</b> is logged. The UV crew will reach out shortly.
            </p>
            <button className="modal__done" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
