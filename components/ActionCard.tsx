import type { DecodeResult } from "@/lib/types";
import { daysLeft, displayUrgency, type DisplayUrgency } from "@/lib/dates";
import { formatDate, type Messages, type UiLanguage } from "@/lib/i18n";
import { buildIcs, downloadIcs, googleCalendarUrl } from "@/lib/ics";
import ReplyDraft from "./ReplyDraft";

const URGENCY_CLASS: Record<DisplayUrgency, string> = {
  overdue: "bg-red-700 text-white",
  high: "bg-red-600 text-white",
  medium: "bg-amber-400 text-slate-900",
  low: "bg-emerald-600 text-white",
};

type Props = {
  result: DecodeResult;
  beta: boolean;
  lang: UiLanguage;
  t: Messages;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

function calendarEvent(result: DecodeResult, deadline: string, t: Messages) {
  const title = `${t.card.eventPrefix}: ${result.document_type}${
    result.sender ? ` (${result.sender})` : ""
  }`;
  const description = [
    result.summary,
    "",
    ...result.actions.map((a, i) => `${i + 1}. ${a}`),
    "",
    result.amount_text ? `${t.card.eventAmount}: ${result.amount_text}` : "",
    t.card.eventNote,
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
  return { deadline, title, description };
}

function CalendarButtons({
  result,
  deadline,
  t,
}: {
  result: DecodeResult;
  deadline: string;
  t: Messages;
}) {
  const event = calendarEvent(result, deadline, t);
  const buttonClass =
    "flex min-h-11 items-center rounded-lg border border-azul px-4 text-sm font-semibold text-azul hover:bg-azul-light";
  return (
    <div className="mt-3">
      <p className="mb-2 text-sm font-semibold text-slate-900">{t.card.calendarTitle}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          Google Calendar
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(`deadline-${deadline}.ics`, buildIcs(event))}
          className={buttonClass}
        >
          {t.card.icsButton}
        </button>
      </div>
    </div>
  );
}

function Quote({ text, label }: { text: string; label: string }) {
  return (
    <p className="mt-2 border-l-4 border-slate-300 pl-3 text-sm italic text-slate-600">
      <span className="not-italic font-medium text-slate-500">{label} </span>“{text}”
    </p>
  );
}

function daysLabel(days: number, t: Messages): string {
  if (days < 0) return t.card.daysOverdue(Math.abs(days));
  if (days === 0) return t.card.today;
  return t.card.daysLeft(days);
}

export default function ActionCard({ result, beta, lang, t }: Props) {
  const days = daysLeft(result.deadline);
  const urgency = displayUrgency(result.urgency, days);
  const deadlineRed = urgency === "high" || urgency === "overdue";

  return (
    <div className="space-y-3">
      {beta && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {t.card.resultBeta}
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${URGENCY_CLASS[urgency]}`}>
            {t.card.urgency[urgency]}
          </span>
          <span className="text-sm text-slate-600">{result.urgency_reason}</span>
        </div>
        <h2 className="mt-3 text-lg font-bold text-slate-900">{result.document_type}</h2>
        {result.sender && (
          <p className="text-sm text-slate-600">
            {t.card.from} {result.sender}
          </p>
        )}
      </div>

      {(result.deadline || result.deadline_relative) && (
        <Section title={t.card.deadline}>
          {result.deadline ? (
            <p className={`text-xl font-bold ${deadlineRed ? "text-red-700" : "text-slate-900"}`}>
              {formatDate(result.deadline, lang)}
              {days !== null && (
                <span className="ml-2 text-base font-semibold">({daysLabel(days, t)})</span>
              )}
            </p>
          ) : (
            <p className="text-lg font-semibold text-slate-900">{result.deadline_relative}</p>
          )}
          {!result.deadline && (
            <p className="mt-1 text-sm text-slate-600">{t.card.relativeHint}</p>
          )}
          {result.deadline_quote && (
            <Quote text={result.deadline_quote} label={t.card.inTheLetter} />
          )}
          {result.deadline && (days === null || days >= 0) && (
            <CalendarButtons result={result} deadline={result.deadline} t={t} />
          )}
        </Section>
      )}

      {result.amount_text && (
        <Section title={t.card.amount}>
          <p className="text-xl font-bold text-slate-900">{result.amount_text}</p>
          {result.amount_quote && <Quote text={result.amount_quote} label={t.card.inTheLetter} />}
        </Section>
      )}

      <Section title={t.card.inShort}>
        <p className="text-slate-900">{result.summary}</p>
      </Section>

      <Section title={t.card.whatToDo}>
        {result.actions.length > 0 ? (
          <ol className="list-decimal space-y-1 pl-5 text-slate-900">
            {result.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        ) : (
          <p className="text-slate-900">{t.card.nothingToDo}</p>
        )}
      </Section>

      {result.key_terms.length > 0 && (
        <Section title={t.card.keyWords}>
          <dl className="space-y-2">
            {result.key_terms.map((term) => (
              <div key={term.pt}>
                <dt className="font-semibold text-slate-900">{term.pt}</dt>
                <dd className="text-sm text-slate-600">{term.meaning}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {result.uncertainties.length > 0 && (
        <section className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
            {t.card.toConfirm}
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
          key={result.reply_draft_pt}
          draftPt={result.reply_draft_pt}
          translation={result.reply_draft_translation}
          replyEmail={result.reply_email}
          subjectPt={result.reply_subject_pt}
          condition={result.reply_condition}
          t={t}
        />
      )}
    </div>
  );
}
