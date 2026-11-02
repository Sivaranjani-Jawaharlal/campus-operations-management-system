// Small, dependency-free formatting helpers shared across the UI.

export function initials(name = "") {
  const parts = String(name).trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function greetingFor(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function parseDate(value) {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

export function formatDateTime(value) {
  const d = parseDate(value);
  return d
    ? d.toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })
    : "";
}

export function formatToday(date = new Date()) {
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function relativeTime(value, now = new Date()) {
  const d = parseDate(value);
  if (!d) return "";
  const diff = Math.round((now - d) / 1000);
  if (diff < 45) return "just now";
  if (diff < 3600) return `${Math.max(1, Math.round(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} hr ago`;
  if (diff < 86400 * 7) return `${Math.round(diff / 86400)} d ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: d.getFullYear() === now.getFullYear() ? undefined : "numeric" });
}

export function dayParts(value) {
  const d = parseDate(value);
  if (!d) return { day: "–", month: "" };
  return { day: String(d.getDate()).padStart(2, "0"), month: d.toLocaleDateString(undefined, { month: "short" }) };
}

// Buckets notices into "Today / This week / Earlier" for the feed.
export function groupByRecency(items, now = new Date()) {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = startOfToday - 6 * 86400000;
  const groups = [
    { key: "today", label: "Today", items: [] },
    { key: "week", label: "This week", items: [] },
    { key: "earlier", label: "Earlier", items: [] },
  ];
  for (const item of items) {
    const t = parseDate(item.createdAt)?.getTime() ?? 0;
    if (t >= startOfToday) groups[0].items.push(item);
    else if (t >= weekAgo) groups[1].items.push(item);
    else groups[2].items.push(item);
  }
  return groups.filter((g) => g.items.length > 0);
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function plural(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

// 0–4 advisory score. Purely a UI hint; the server owns real validation.
export function passwordStrength(pw = "") {
  if (!pw) return { level: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const level = pw.length < 6 ? 1 : Math.max(1, Math.min(4, score));
  return { level, label: ["", "Weak", "Fair", "Good", "Strong"][level] };
}

export function distinct(values) {
  return [...new Set(values.map((v) => (v == null ? "" : String(v).trim())).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}
