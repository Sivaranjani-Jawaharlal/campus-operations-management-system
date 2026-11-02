import { useId, useRef } from "react";

// Six single-digit cells that behave like one field: paste, backspace and arrows all work.
// `value` / `onChange` deal in a plain string, so the API payload is unchanged.
export default function OtpInput({ value, onChange, length = 6, label = "Verification code", autoFocus = false, error }) {
  const id = useId();
  const refs = useRef([]);
  const chars = Array.from({ length }, (_, i) => value[i] || "");

  const focusAt = (i) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const setChar = (i, ch) => {
    const next = chars.slice();
    next[i] = ch;
    onChange(next.join("").slice(0, length));
  };

  const handleChange = (i, e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) return;
    if (digits.length > 1) {
      // Autofill / multi-char entry: spread across cells
      const next = chars.slice();
      digits.split("").slice(0, length - i).forEach((d, k) => (next[i + k] = d));
      onChange(next.join(""));
      focusAt(i + digits.length);
      return;
    }
    setChar(i, digits);
    focusAt(i + 1);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (chars[i]) setChar(i, "");
      else {
        setChar(Math.max(0, i - 1), "");
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    e.preventDefault();
    onChange(digits);
    focusAt(digits.length >= length ? length - 1 : digits.length);
  };

  return (
    <div className="field">
      <span className="field__label" id={`${id}-label`}>
        {label}
      </span>
      <div className="otp" role="group" aria-labelledby={`${id}-label`} onPaste={handlePaste}>
        {chars.map((ch, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            className="otp__cell"
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={length}
            value={ch}
            data-filled={ch ? "true" : "false"}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={error ? true : undefined}
            autoFocus={autoFocus && i === 0}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
