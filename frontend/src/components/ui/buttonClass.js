// Shared class builder so <Link> and <a> can look like buttons without a wrapper component.
export function buttonClass({ variant = "default", size, block, icon } = {}) {
  return [
    "btn",
    variant !== "default" && `btn--${variant}`,
    size && `btn--${size}`,
    block && "btn--block",
    icon && "btn--icon",
  ]
    .filter(Boolean)
    .join(" ");
}
