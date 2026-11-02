import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import Button from "../ui/Button";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <Button variant="ghost" iconOnly className={`theme-toggle ${className}`.trim()} onClick={toggle} aria-pressed={dark} title={dark ? "Switch to light theme" : "Switch to dark theme"}>
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      {dark ? "Use light theme" : "Use dark theme"}
    </Button>
  );
}
