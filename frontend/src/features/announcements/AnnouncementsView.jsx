import { useMemo, useState } from "react";
import { BellOff, Megaphone, Plus, RefreshCw, Search, SearchX, TriangleAlert } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/Dialog";
import EmptyState from "../../components/ui/EmptyState";
import { TextField } from "../../components/ui/Field";
import { NoticeSkeleton } from "../../components/ui/Skeleton";
import { distinct } from "../../utils/format";
import NoticeComposer from "./NoticeComposer";
import NoticeList from "./NoticeList";

const SCOPES = [
  { key: "all", label: "All" },
  { key: "everyone", label: "Everyone" },
  { key: "targeted", label: "Targeted" },
];

// The full announcements experience: search + filter, grouped feed, and — for staff/admin
// whose account is active — publish / edit / delete. `feed` is the useAnnouncements() result.
export default function AnnouncementsView({ feed, canManage, startComposing = false }) {
  const { user } = useAuth();
  const toast = useToast();
  const { items, status, error, reload, create, update, remove } = feed;

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [composer, setComposer] = useState({ open: canManage && startComposing, notice: null, key: 0 });
  const [toDelete, setToDelete] = useState(null);

  const isTargeted = (n) => Boolean(n.targetDepartment || n.targetAcademicYear);

  const counts = useMemo(
    () => ({ all: items.length, everyone: items.filter((n) => !isTargeted(n)).length, targeted: items.filter(isTargeted).length }),
    [items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (scope === "everyone" && isTargeted(n)) return false;
      if (scope === "targeted" && !isTargeted(n)) return false;
      if (!q) return true;
      return [n.title, n.content, n.targetDepartment, n.targetAcademicYear, n.createdByEmail].some((v) => v && String(v).toLowerCase().includes(q));
    });
  }, [items, query, scope]);

  const suggestions = useMemo(
    () => ({
      departments: distinct([...items.map((n) => n.targetDepartment), user?.department]),
      years: distinct([...items.map((n) => n.targetAcademicYear), user?.academicYear]),
    }),
    [items, user]
  );

  const openComposer = (notice = null) => setComposer((c) => ({ open: true, notice, key: c.key + 1 }));
  const closeComposer = () => setComposer((c) => ({ ...c, open: false }));

  const submit = async (dto) => {
    if (composer.notice) {
      await update(composer.notice.id, dto);
      toast.success("Announcement updated.");
    } else {
      await create(dto);
      toast.success("Announcement published.");
    }
    closeComposer();
  };

  const confirmDelete = async () => {
    await remove(toDelete.id);
    toast.success("Announcement deleted.");
    setToDelete(null);
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar__search">
          <TextField
            icon={Search}
            type="search"
            placeholder="Search announcements"
            aria-label="Search announcements"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="segmented" role="group" aria-label="Filter by audience">
          {SCOPES.map((s) => (
            <button key={s.key} type="button" className="segmented__btn" aria-pressed={scope === s.key} onClick={() => setScope(s.key)}>
              {s.label}
              <span className="segmented__count">{counts[s.key]}</span>
            </button>
          ))}
        </div>
        <span className="toolbar__spacer" />
        {canManage && (
          <Button variant="primary" icon={Plus} onClick={() => openComposer()}>
            New announcement
          </Button>
        )}
      </div>

      {status === "loading" && <NoticeSkeleton />}

      {status === "error" && (
        <div className="panel">
          <EmptyState
            tone="error"
            icon={TriangleAlert}
            title="Couldn't load announcements"
            actions={
              <Button icon={RefreshCw} onClick={() => reload()}>
                Try again
              </Button>
            }
          >
            {error}
          </EmptyState>
        </div>
      )}

      {status === "ready" && items.length === 0 && (
        <div className="panel">
          <EmptyState
            icon={BellOff}
            title="No announcements yet"
            actions={
              canManage && (
                <Button variant="primary" icon={Megaphone} onClick={() => openComposer()}>
                  Publish the first one
                </Button>
              )
            }
          >
            {canManage ? "Announcements you publish will appear here for the audience you choose." : "When your department or the campus posts something, you'll see it here."}
          </EmptyState>
        </div>
      )}

      {status === "ready" && items.length > 0 && visible.length === 0 && (
        <div className="panel">
          <EmptyState
            icon={SearchX}
            title="Nothing matches"
            actions={
              <Button
                onClick={() => {
                  setQuery("");
                  setScope("all");
                }}
              >
                Clear filters
              </Button>
            }
          >
            No announcements fit your search or filter.
          </EmptyState>
        </div>
      )}

      {status === "ready" && visible.length > 0 && <NoticeList items={visible} canManage={canManage} onEdit={openComposer} onDelete={setToDelete} />}

      {canManage && (
        <NoticeComposer key={composer.key} open={composer.open} notice={composer.notice} suggestions={suggestions} onClose={closeComposer} onSubmit={submit} />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this announcement?"
        description="It will disappear for everyone it was visible to. This can't be undone."
        confirmLabel="Delete"
        busyLabel="Deleting…"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        {toDelete && (
          <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", overflowWrap: "anywhere" }}>“{toDelete.title}”</p>
        )}
      </ConfirmDialog>
    </>
  );
}
