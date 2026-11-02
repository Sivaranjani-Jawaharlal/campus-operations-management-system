import NoticeCard from "./NoticeCard";
import { groupByRecency } from "../../utils/format";

// Renders notices grouped by recency (Today / This week / Earlier).
export default function NoticeList({ items, canManage, onEdit, onDelete, grouped = true }) {
  if (!grouped) {
    return (
      <div className="stack">
        {items.map((n, i) => (
          <NoticeCard key={n.id} notice={n} index={i} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    );
  }
  let index = 0;
  return (
    <div>
      {groupByRecency(items).map((group) => (
        <section className="notice-group" key={group.key} aria-label={group.label}>
          <h2 className="notice-group__label">
            {group.label}
            <span className="notice-group__count">{group.items.length}</span>
          </h2>
          {group.items.map((n) => (
            <NoticeCard key={n.id} notice={n} index={index++} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </section>
      ))}
    </div>
  );
}
