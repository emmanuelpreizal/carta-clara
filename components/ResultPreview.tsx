import { formatDate, type Messages, type UiLanguage } from "@/lib/i18n";

const PREVIEW_DEADLINE = "2026-10-06";
const PREVIEW_DAYS_LEFT = 11;

export default function ResultPreview({ lang, t }: { lang: UiLanguage; t: Messages }) {
  return (
    <section aria-labelledby="preview-title">
      <div className="mb-2 flex items-center gap-2">
        <h2 id="preview-title" className="text-sm font-semibold text-slate-900">
          {t.preview.title}
        </h2>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
          {t.preview.example}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none space-y-2 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-3 opacity-90"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-600 px-3 py-0.5 text-xs font-bold text-white">
              {t.card.urgency.high}
            </span>
            <span className="text-xs text-slate-600">{t.preview.urgentReason}</span>
          </div>
          <p className="mt-2 font-bold text-slate-900">{t.preview.docType}</p>
          <p className="text-xs text-slate-600">{t.preview.from}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {t.card.deadline}
            </p>
            <p className="font-bold text-red-700">{formatDate(PREVIEW_DEADLINE, lang, false)}</p>
            <p className="text-xs font-semibold text-red-700">
              {t.card.daysLeft(PREVIEW_DAYS_LEFT)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {t.card.amount}
            </p>
            <p className="font-bold text-slate-900">248,60 €</p>
            <p className="text-xs text-slate-500">{t.preview.asWritten}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {t.card.whatToDo}
          </p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-slate-800">
            {t.preview.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold text-azul">
          <span className="rounded-lg border border-azul px-3 py-1.5">
            {t.preview.addToCalendar}
          </span>
          <span className="rounded-lg border border-azul px-3 py-1.5">{t.reply.title}</span>
        </div>
      </div>
    </section>
  );
}
