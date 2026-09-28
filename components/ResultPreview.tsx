export default function ResultPreview() {
  return (
    <section aria-labelledby="preview-title">
      <div className="mb-2 flex items-center gap-2">
        <h2 id="preview-title" className="text-sm font-semibold text-slate-900">
          What you will get
        </h2>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
          example
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none space-y-2 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-3 opacity-90"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-600 px-3 py-0.5 text-xs font-bold text-white">
              Urgent
            </span>
            <span className="text-xs text-slate-600">A payment is due soon.</span>
          </div>
          <p className="mt-2 font-bold text-slate-900">Payment notice</p>
          <p className="text-xs text-slate-600">From: Tax office (Finanças)</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Deadline
            </p>
            <p className="font-bold text-red-700">6 October</p>
            <p className="text-xs font-semibold text-red-700">11 days left</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </p>
            <p className="font-bold text-slate-900">248,60 €</p>
            <p className="text-xs text-slate-500">as written in the letter</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            What to do
          </p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-slate-800">
            <li>Pay using the reference in the letter.</li>
            <li>Keep the receipt.</li>
            <li>Contact the office if you think it is a mistake.</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold text-azul">
          <span className="rounded-lg border border-azul px-3 py-1.5">Add to calendar</span>
          <span className="rounded-lg border border-azul px-3 py-1.5">
            Draft reply in Portuguese
          </span>
        </div>
      </div>
    </section>
  );
}
