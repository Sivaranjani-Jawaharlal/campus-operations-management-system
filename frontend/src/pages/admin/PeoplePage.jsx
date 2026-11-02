import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search, SearchX, TriangleAlert, UserCheck, UserX, Users } from "lucide-react";
import { updateAccountStatus } from "../../api/admin";
import { useAuth } from "../../hooks/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useToast } from "../../hooks/useToast";
import { useUsers } from "../../hooks/useUsers";
import { ROLE_LABELS } from "../../utils/roles";
import { plural } from "../../utils/format";
import Avatar from "../../components/ui/Avatar";
import { RoleBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/Dialog";
import EmptyState from "../../components/ui/EmptyState";
import { TextField } from "../../components/ui/Field";
import PageHeader from "../../components/ui/PageHeader";
import { RowsSkeleton } from "../../components/ui/Skeleton";

const PAGE_SIZE = 12;
const ROLE_FILTERS = ["ALL", "STUDENT", "STAFF", "LAB_ASSISTANT", "ADMIN"];

export const PeoplePage = () => {
  useDocumentTitle("People");
  const { user: me } = useAuth();
  const toast = useToast();
  const { users, status, error, reload, patch } = useUsers();

  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");
  const [state, setState] = useState("ALL"); // ALL | ACTIVE | INACTIVE
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null); // { user, next }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => (role === "ALL" || u.role === role) && (state === "ALL" || u.accountStatus === state))
      .filter((u) => !q || [u.username, u.email, u.department, u.academicYear].some((v) => v && String(v).toLowerCase().includes(q)))
      .sort((a, b) => String(a.username).localeCompare(String(b.username)));
  }, [users, query, role, state]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const roleCount = (r) => (r === "ALL" ? users.length : users.filter((u) => u.role === r).length);

  const confirmChange = async () => {
    const updated = await updateAccountStatus(target.user.id, target.next);
    patch(updated && updated.id ? updated : { id: target.user.id, accountStatus: target.next });
    toast.success(`${target.user.username} is now ${target.next === "ACTIVE" ? "active" : "inactive"}.`);
    setTarget(null);
  };

  const filtersActive = query || role !== "ALL" || state !== "ALL";
  const clear = () => {
    setQuery("");
    setRole("ALL");
    setState("ALL");
    setPage(1);
  };

  const deactivating = target?.next === "INACTIVE";

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        number="02"
        title="People"
        description="Every account on campus. Set someone inactive when they leave and they keep read access but can no longer create, edit or delete."
        actions={
          <Button icon={RefreshCw} onClick={reload} disabled={status === "loading"}>
            Refresh
          </Button>
        }
      />

      <div className="toolbar">
        <div className="toolbar__search">
          <TextField
            icon={Search}
            type="search"
            placeholder="Search name, email, department"
            aria-label="Search people"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="segmented" role="group" aria-label="Filter by role">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              type="button"
              className="segmented__btn"
              aria-pressed={role === r}
              onClick={() => {
                setRole(r);
                setPage(1);
              }}
            >
              {r === "ALL" ? "All" : ROLE_LABELS[r]}
              <span className="segmented__count">{roleCount(r)}</span>
            </button>
          ))}
        </div>
        <div className="segmented" role="group" aria-label="Filter by status">
          {[
            ["ALL", "Any status"],
            ["ACTIVE", "Active"],
            ["INACTIVE", "Inactive"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="segmented__btn"
              aria-pressed={state === key}
              onClick={() => {
                setState(key);
                setPage(1);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel panel--flush rise rise-1">
        <div className="panel__body">
          {status === "loading" && <RowsSkeleton />}

          {status === "error" && (
            <EmptyState
              tone="error"
              icon={TriangleAlert}
              title="Couldn't load people"
              actions={
                <Button icon={RefreshCw} onClick={reload}>
                  Try again
                </Button>
              }
            >
              {error}
            </EmptyState>
          )}

          {status === "ready" && users.length === 0 && (
            <EmptyState icon={Users} title="No accounts yet">
              Upload the student roster so students can register, and invite your staff and lab assistants.
            </EmptyState>
          )}

          {status === "ready" && users.length > 0 && filtered.length === 0 && (
            <EmptyState icon={SearchX} title="No one matches" actions={filtersActive && <Button onClick={clear}>Clear filters</Button>}>
              Try a different search or filter.
            </EmptyState>
          )}

          {status === "ready" && rows.length > 0 && (
            <>
              <div className="table-wrap">
                <table className="table table--stack">
                  <caption className="sr-only">User accounts</caption>
                  <thead>
                    <tr>
                      <th scope="col">Person</th>
                      <th scope="col">Role</th>
                      <th scope="col">Department</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="table__right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u) => {
                      const isMe = u.id === me.id;
                      const active = u.accountStatus === "ACTIVE";
                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="cell-user">
                              <Avatar name={u.username} role={u.role} />
                              <div style={{ minWidth: 0 }}>
                                <div className="cell-user__name">
                                  {u.username}
                                  {isMe && <span className="muted" style={{ fontWeight: 500 }}> (you)</span>}
                                </div>
                                <div className="cell-user__sub">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td data-label="Role">
                            <RoleBadge role={u.role} />
                          </td>
                          <td data-label="Department">
                            {u.department || <span className="muted">—</span>}
                            {u.academicYear && <span className="muted"> · Year {u.academicYear}</span>}
                          </td>
                          <td data-label="Status">
                            <span className="status-dot" data-status={u.accountStatus}>
                              {active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="table__right">
                            <div className="row-actions">
                              <Button
                                size="sm"
                                variant={active ? "default" : "subtle"}
                                icon={active ? UserX : UserCheck}
                                disabled={isMe}
                                title={isMe ? "You can't change your own status" : undefined}
                                onClick={() => setTarget({ user: u, next: active ? "INACTIVE" : "ACTIVE" })}
                              >
                                {active ? "Deactivate" : "Reactivate"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="pager">
                <span>
                  Showing {(current - 1) * PAGE_SIZE + 1}–{(current - 1) * PAGE_SIZE + rows.length} of {plural(filtered.length, "person", "people")}
                </span>
                {pages > 1 && (
                  <div className="cluster" style={{ gap: "var(--s-2)" }}>
                    <Button size="sm" icon={ChevronLeft} disabled={current === 1} onClick={() => setPage(current - 1)}>
                      Prev
                    </Button>
                    <span className="mono" style={{ fontSize: "var(--text-xs)" }}>
                      {current} / {pages}
                    </span>
                    <Button size="sm" disabled={current === pages} onClick={() => setPage(current + 1)}>
                      Next
                      <ChevronRight size={15} aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        tone={deactivating ? "danger" : "default"}
        icon={deactivating ? UserX : UserCheck}
        title={deactivating ? `Deactivate ${target?.user.username}?` : `Reactivate ${target?.user.username}?`}
        description={
          deactivating
            ? "They'll keep read access but won't be able to create, edit or delete anything."
            : "They'll regain the ability to create, edit and delete according to their role."
        }
        confirmLabel={deactivating ? "Deactivate" : "Reactivate"}
        busyLabel="Saving…"
        onConfirm={confirmChange}
        onCancel={() => setTarget(null)}
      >
        {target && (
          <div className="cell-user" style={{ padding: "var(--s-2) 0" }}>
            <Avatar name={target.user.username} role={target.user.role} />
            <div>
              <div className="cell-user__name">{target.user.username}</div>
              <div className="cell-user__sub">{target.user.email}</div>
            </div>
            <span style={{ marginLeft: "auto" }}>
              <RoleBadge role={target.user.role} />
            </span>
          </div>
        )}
      </ConfirmDialog>
    </>
  );
};
