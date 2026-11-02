import { useMemo, useState } from "react";
import { ArrowRight, GraduationCap, TrendingUp, Users } from "lucide-react";
import { graduateStudents, promoteStudents } from "../../api/admin";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useToast } from "../../hooks/useToast";
import { useUsers } from "../../hooks/useUsers";
import { distinct, plural } from "../../utils/format";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/Dialog";
import { TextField } from "../../components/ui/Field";
import PageHeader from "../../components/ui/PageHeader";
import Panel from "../../components/ui/Panel";

export const AcademicYearPage = () => {
  useDocumentTitle("Academic year");
  const toast = useToast();
  const { users, status } = useUsers();

  const students = useMemo(() => users.filter((u) => u.role === "STUDENT"), [users]);
  const departments = useMemo(() => distinct(students.map((s) => s.department)), [students]);
  const years = useMemo(() => distinct(students.map((s) => s.academicYear)), [students]);
  const cohort = (dept, year) => students.filter((s) => s.department === dept.trim() && s.academicYear === year.trim());

  const [promote, setPromote] = useState({ department: "", fromYear: "", toYear: "" });
  const [promoteResult, setPromoteResult] = useState(null);
  const [promoteError, setPromoteError] = useState("");
  const [confirmPromote, setConfirmPromote] = useState(false);

  const [grad, setGrad] = useState({ department: "", academicYear: "" });
  const [gradResult, setGradResult] = useState(null);
  const [gradError, setGradError] = useState("");
  const [confirmGrad, setConfirmGrad] = useState(false);

  const promoteCount = cohort(promote.department, promote.fromYear).length;
  const gradCount = cohort(grad.department, grad.academicYear).length;
  const knowsCohorts = status === "ready";

  const submitPromote = (e) => {
    e.preventDefault();
    setPromoteError("");
    setPromoteResult(null);
    if (promote.fromYear.trim() === promote.toYear.trim()) {
      setPromoteError("The new year must be different from the current year.");
      return;
    }
    setConfirmPromote(true);
  };

  const runPromote = async () => {
    const res = await promoteStudents({
      department: promote.department.trim(),
      fromYear: promote.fromYear.trim(),
      toYear: promote.toYear.trim(),
    });
    setPromoteResult(res);
    toast.success(res.message);
    setConfirmPromote(false);
  };

  const submitGrad = (e) => {
    e.preventDefault();
    setGradError("");
    setGradResult(null);
    setConfirmGrad(true);
  };

  const runGraduate = async () => {
    const res = await graduateStudents({ department: grad.department.trim(), academicYear: grad.academicYear.trim() });
    setGradResult(res);
    toast.success(res.message);
    setConfirmGrad(false);
  };

  const cohortHint = (count) =>
    !knowsCohorts ? undefined : count === 0 ? "No students currently match this department and year." : `${plural(count, "student")} currently match.`;

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        number="05"
        title="Academic year"
        description="Year-end housekeeping. Move a cohort up a year, or graduate it — graduated accounts stay readable but can no longer make changes."
      />

      <div className="two-col">
        <Panel icon={TrendingUp} title="Promote a cohort" description="Moves every student in a department from one academic year to the next. Account status isn't touched.">
          <form className="stack" onSubmit={submitPromote}>
            {promoteError && <Alert tone="error">{promoteError}</Alert>}
            {promoteResult && (
              <Alert tone="success" title="Promotion complete">
                {promoteResult.message}
              </Alert>
            )}
            <TextField label="Department" required suggestions={departments} value={promote.department} onChange={(e) => setPromote({ ...promote, department: e.target.value })} placeholder="e.g. Computer Science" />
            <div className="field-row">
              <TextField label="From year" required suggestions={years} value={promote.fromYear} onChange={(e) => setPromote({ ...promote, fromYear: e.target.value })} placeholder="e.g. 2" />
              <TextField label="To year" required suggestions={years} value={promote.toYear} onChange={(e) => setPromote({ ...promote, toYear: e.target.value })} placeholder="e.g. 3" />
            </div>
            {promote.department && promote.fromYear && cohortHint(promoteCount) && (
              <p className="field__hint" aria-live="polite">
                <Users size={13} aria-hidden="true" style={{ display: "inline", verticalAlign: "-2px" }} /> {cohortHint(promoteCount)}
              </p>
            )}
            <div>
              <Button type="submit" variant="primary" icon={TrendingUp}>
                Review promotion
              </Button>
            </div>
          </form>
        </Panel>

        <Panel icon={GraduationCap} warn title="Graduate a cohort" description="Marks every student in a department and year inactive. They keep read access; they can no longer create or change anything.">
          <form className="stack" onSubmit={submitGrad}>
            {gradError && <Alert tone="error">{gradError}</Alert>}
            {gradResult && (
              <Alert tone="success" title="Graduation complete">
                {gradResult.message}
              </Alert>
            )}
            <TextField label="Department" required suggestions={departments} value={grad.department} onChange={(e) => setGrad({ ...grad, department: e.target.value })} placeholder="e.g. Computer Science" />
            <TextField label="Academic year" required suggestions={years} value={grad.academicYear} onChange={(e) => setGrad({ ...grad, academicYear: e.target.value })} placeholder="e.g. 4" />
            {grad.department && grad.academicYear && cohortHint(gradCount) && (
              <p className="field__hint" aria-live="polite">
                <Users size={13} aria-hidden="true" style={{ display: "inline", verticalAlign: "-2px" }} /> {cohortHint(gradCount)}
              </p>
            )}
            <div>
              <Button type="submit" variant="danger" icon={GraduationCap}>
                Review graduation
              </Button>
            </div>
          </form>
        </Panel>
      </div>

      <ConfirmDialog
        open={confirmPromote}
        tone="default"
        icon={TrendingUp}
        title="Promote this cohort?"
        description="Every matching student's academic year will change."
        confirmLabel="Promote students"
        busyLabel="Promoting…"
        onConfirm={runPromote}
        onCancel={() => setConfirmPromote(false)}
      >
        <div className="stack">
          <div className="cluster" style={{ fontSize: "var(--text-md)", fontFamily: "var(--font-display)" }}>
            <strong>{promote.department.trim()}</strong>
            <span className="chip">Year {promote.fromYear.trim()}</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span className="chip chip--brand">Year {promote.toYear.trim()}</span>
          </div>
          {knowsCohorts && (
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              {promoteCount === 0 ? "No students currently match — nothing will change." : `About ${plural(promoteCount, "student")} will move up.`}
            </p>
          )}
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmGrad}
        tone="danger"
        icon={GraduationCap}
        title="Graduate this cohort?"
        description="Their accounts become read-only. You can reactivate individuals later from People."
        confirmLabel="Graduate students"
        busyLabel="Graduating…"
        onConfirm={runGraduate}
        onCancel={() => setConfirmGrad(false)}
      >
        <div className="stack">
          <div className="cluster" style={{ fontSize: "var(--text-md)", fontFamily: "var(--font-display)" }}>
            <strong>{grad.department.trim()}</strong>
            <span className="chip chip--accent">Year {grad.academicYear.trim()}</span>
          </div>
          {knowsCohorts && (
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              {gradCount === 0 ? "No students currently match — nothing will change." : `About ${plural(gradCount, "student")} will become read-only.`}
            </p>
          )}
          <Alert tone="warning">This affects every matching student at once.</Alert>
        </div>
      </ConfirmDialog>
    </>
  );
};
