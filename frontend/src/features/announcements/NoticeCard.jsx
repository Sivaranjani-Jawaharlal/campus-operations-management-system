import { useState } from "react";
import { Building2, CalendarDays, Globe2, Pencil, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { dayParts, formatDateTime, relativeTime } from "../../utils/format";

const CLAMP_AT = 280;

// One announcement, styled as a pinned notice: date stamp on the left, a coloured spine
// that marks whether it's for everyone or targeted, audience chips and author below.
export default function NoticeCard({ notice, index = 0, canManage = false, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const targeted = Boolean(notice.targetDepartment || notice.targetAcademicYear);
  const { day, month } = dayParts(notice.createdAt);
  const long = notice.content.length > CLAMP_AT || notice.content.split("\n").length > 5;

  return (
    <article className={`notice ${targeted ? "notice--targeted" : ""}`} style={{ "--i": Math.min(index, 8) }}>
      <div className="notice__stamp" aria-hidden="true">
        <span className="notice__day">{day}</span>
        <span className="notice__mon">{month}</span>
      </div>
      <div className="notice__body">
        <div className="notice__head">
          <h3 className="notice__title">{notice.title}</h3>
          {canManage && (
            <div className="notice__actions">
              <Button variant="ghost" size="sm" iconOnly onClick={() => onEdit(notice)}>
                <Pencil size={15} aria-hidden="true" />
                Edit “{notice.title}”
              </Button>
              <Button variant="ghost" size="sm" iconOnly onClick={() => onDelete(notice)}>
                <Trash2 size={15} aria-hidden="true" />
                Delete “{notice.title}”
              </Button>
            </div>
          )}
        </div>

        <p className={`notice__content ${long && !expanded ? "notice__content--clamped" : ""}`}>{notice.content}</p>
        {long && (
          <button type="button" className="linkbtn notice__more" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        <div className="notice__meta">
          {targeted ? (
            <>
              {notice.targetDepartment && (
                <span className="chip chip--accent">
                  <Building2 size={12} aria-hidden="true" />
                  {notice.targetDepartment}
                </span>
              )}
              {notice.targetAcademicYear && (
                <span className="chip chip--accent">
                  <CalendarDays size={12} aria-hidden="true" />
                  Year {notice.targetAcademicYear}
                </span>
              )}
            </>
          ) : (
            <span className="chip chip--brand">
              <Globe2 size={12} aria-hidden="true" />
              Everyone
            </span>
          )}
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <span>{notice.createdByEmail}</span>
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <time dateTime={notice.createdAt} title={formatDateTime(notice.createdAt)}>
            {relativeTime(notice.createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
