import { Children } from "react";
import { buttonClass } from "./buttonClass";

// variant: default | primary | danger | ghost | subtle   size: sm | lg
export default function Button({
  variant,
  size,
  block,
  iconOnly,
  loading = false,
  loadingText,
  icon: Icon,
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${buttonClass({ variant, size, block, icon: iconOnly })} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : Icon ? <Icon size={size === "sm" ? 15 : 17} aria-hidden="true" /> : null}
      {iconOnly ? Children.map(children, (c) => (typeof c === "string" ? <span className="sr-only">{c}</span> : c)) : loading && loadingText ? loadingText : children}
    </button>
  );
}
