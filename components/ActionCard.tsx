import type { DecodeResult } from "@/lib/types";
import {
  daysLeft,
  daysLeftLabel,
  displayUrgency,
  formatDeadline,
  type DisplayUrgency,
} from "@/lib/dates";
import { buildIcs, downloadIcs } from "@/lib/ics";
import { BETA_NOTICE } from "@/lib/languages";
import ReplyDraft from "./ReplyDraft";

const URGENCY_STYLE: Record<DisplayUrgency, { label: string; className: string }> = {
  overdue: { label: "Overdue", className: "bg-red-700 text-white" },
  high: { label: "Urgent", className: "bg-red-600 text-white" },
  medium: { label: "Soon", className: "bg-amber-400 text-slate-900" },
  low: { label: "No rush", className: "bg-emerald-600 text-white" },
};

type Props = {
  result: DecodeResult;
  beta: boolean;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

function addToCalendar(result: DecodeResult) {
  if (!result.deadline) return;
  const title = `Deadline: ${result.document_type}${result.sender ? ` (${result.sender})` : ""}`;
  const description = [
    result.summary,
    "",
    ...result.actions.map((a, i) => `${i + 1}. ${a}`),
    "",
    result.amount_text ? `Amount: ${result.amount_text}` : "",
    "Check the date on the original letter. Created with Carta Clara. Not legal or tax advice.",
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
  downloadIcs(
    `deadline-${result.deadline}.ics`,
    buildIcs({ deadline: result.deadline, title, description }),
  );
}

function Quote({ text }: { text: string }) {
  return (
    <p className="mt-2 border-l-4 border-slate-300 pl-3 text-sm italic text-slate-600">
      <span className="not-italic font-medium text-slate-500">In the letter: </span>“{text}”
    </p>
  );
}

export default function ActionCard({ result, beta }: Props) {
  const days = daysLeft(result.deadline);
  const urgency = displayUrgency(result.urgency, days);
  const style = URGENCY_STYLE[urgency];
  const deadlineRed = urgency === "high" || urgency === "overdue";

  return (
    <div className="space-y-3">
      {beta && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          This language is in {BETA_NOTICE}.
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${style.className}`}>
            {style.label}
          </span>
          <span className="text-sm text-slate-600">{result.urgency_reason}</span>
        </div>
        <h2 className="mt-3 text-lg font-bold text-slate-900">{result.document_type}</h2>
        {result.sender && <p className="text-sm text-slate-600">From: {result.sender}</p>}
      </div>

      {(result.deadline || result.deadline_relative) && (
        <Section title="Deadline">
          {result.deadline ? (
            <p className={`text-xl font-bold ${deadlineRed ? "text-red-700" : "text-slate-900"}`}>
              {formatDeadline(result.deadline)}
              {days !== null && (
                <span className="ml-2 text-base font-semibold">({daysLeftLabel(days)})</span>
              )}
            </p>
          ) : (
            <p className="text-lg font-semibold text-slate-900">{result.deadline_relative}</p>
          )}
          {!result.deadline && (
            <p className="mt-1 text-sm text-slate-600">
              The exact date depends on when you received the letter. Check the date on the
              envelope or the notification.
            </p>
          )}
          {result.deadline_quote && <Quote text={result.deadline_quote} />}
          {result.deadline && (days === null || days >= 0) && (
            <button
              type="button"
              onClick={() => addToCalendar(result)}
              className="mt-3 min-h-11 rounded-lg border border-azul px-4 text-sm font-semibold text-azul hover:bg-azul-light"
            >
              Add to calendar (reminder 3 days before)
            </button>
          )}
        </Section>
      )}

      {result.amount_text && (
        <Section title="Amount">
          <p className="text-xl font-bold text-slate-900">{result.amount_text}</p>
          {result.amount_quote && <Quote text={result.amount_quote} />}
        </Section>
      )}

      <Section title="In short">
        <p className="text-slate-900">{result.summary}</p>
      </Section>

      <Section title="What to do">
        {result.actions.length > 0 ? (
          <ol className="list-decimal space-y-1 pl-5 text-slate-900">
            {result.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        ) : (
          <p className="text-slate-900">Nothing to do. You can keep this letter for your records.</p>
        )}
      </Section>

      {result.key_terms.length > 0 && (
        <Section title="Key Portuguese words">
          <dl className="space-y-2">
            {result.key_terms.map((t) => (
              <div key={t.pt}>
                <dt className="font-semibold text-slate-900">{t.pt}</dt>
                <dd className="text-sm text-slate-600">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {result.uncertainties.length > 0 && (
        <section className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
            To confirm on the original
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
            {result.uncertainties.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </section>
      )}

      {result.reply_needed && result.reply_draft_pt && (
        <ReplyDraft
          draftPt={result.reply_draft_pt}
          translation={result.reply_draft_translation}
          replyEmail={result.reply_email}
          subjectPt={result.reply_subject_pt}
        />
      )}
    </div>
  );
}
