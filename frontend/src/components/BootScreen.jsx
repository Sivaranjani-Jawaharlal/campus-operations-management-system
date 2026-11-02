import { LogoMark } from "./ui/Logo";

// Shown while the initial session check is in flight.
export default function BootScreen() {
  return (
    <div className="boot" role="status" aria-live="polite">
      <span className="boot__mark">
        <LogoMark size={44} />
      </span>
      Loading
    </div>
  );
}
