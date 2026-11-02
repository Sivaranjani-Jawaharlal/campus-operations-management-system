import { initials } from "../../utils/format";

export default function Avatar({ name, role, size }) {
  return (
    <span className={`avatar ${size ? `avatar--${size}` : ""}`.trim()} data-role={role} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
