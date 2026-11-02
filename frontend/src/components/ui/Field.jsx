import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { passwordStrength } from "../../utils/format";

// Wraps a control with label, hint and error, and wires the aria attributes.
function FieldFrame({ id, label, hint, error, optional, children }) {
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={id}>
          <span>{label}</span>
          {optional && <span className="field__optional">Optional</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field__error" id={`${id}-err`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id, error, hint) {
  return error ? `${id}-err` : hint ? `${id}-hint` : undefined;
}

export function TextField({ label, hint, error, optional, icon: Icon, suggestions, className = "", ...input }) {
  const id = useId();
  const listId = suggestions?.length ? `${id}-list` : undefined;
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className={`control ${error ? "control--invalid" : ""} ${input.disabled ? "control--disabled" : ""} ${className}`}>
        {Icon && (
          <span className="control__icon">
            <Icon size={17} aria-hidden="true" />
          </span>
        )}
        <input
          id={id}
          className="control__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          list={listId}
          {...input}
        />
      </div>
      {listId && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </FieldFrame>
  );
}

export function PasswordField({ label, hint, error, showStrength = false, ...input }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(input.value);
  return (
    <FieldFrame id={id} label={label} hint={showStrength && input.value ? undefined : hint} error={error}>
      <div className={`control ${error ? "control--invalid" : ""}`}>
        <input
          id={id}
          className="control__input"
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          autoCapitalize="none"
          spellCheck={false}
          {...input}
        />
        <span className="control__end">
          <button
            type="button"
            className="btn btn--ghost btn--sm btn--icon"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        </span>
      </div>
      {showStrength && input.value && (
        <>
          <div className="meter" data-level={strength.level} aria-hidden="true">
            <span className="meter__bar" />
            <span className="meter__bar" />
            <span className="meter__bar" />
            <span className="meter__bar" />
          </div>
          <p className="field__hint" aria-live="polite">
            Strength: <strong>{strength.label}</strong>
            {strength.level < 3 && " — longer passwords with mixed characters are harder to guess."}
          </p>
        </>
      )}
    </FieldFrame>
  );
}

export function SelectField({ label, hint, error, optional, children, ...input }) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className={`control ${error ? "control--invalid" : ""}`}>
        <select id={id} className="control__input" aria-describedby={describedBy(id, error, hint)} {...input}>
          {children}
        </select>
      </div>
    </FieldFrame>
  );
}

export function TextAreaField({ label, hint, error, optional, counter, ...input }) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className={`control control--area ${error ? "control--invalid" : ""}`}>
        <textarea
          id={id}
          className="control__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          {...input}
        />
      </div>
      {counter}
    </FieldFrame>
  );
}
