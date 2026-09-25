"use client";

import { useState } from "react";

type Props = {
  draftPt: string;
  translation: string | null;
};

export default function ReplyDraft({ draftPt, translation }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(draftPt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <details className="rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-slate-900">
        Draft reply in Portuguese
      </summary>
      <div className="space-y-4 border-t border-slate-200 px-4 py-4">
        <p className="text-sm text-slate-600">
          Replace [NOME] with your name and [NIF] with your tax number. Send it yourself through
          the official channel.
        </p>
        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Português (Portugal)
          </h4>
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-sans text-sm text-slate-900">
            {draftPt}
          </pre>
          <button
            type="button"
            onClick={copy}
            className="mt-2 min-h-11 rounded-lg bg-azul px-4 text-sm font-semibold text-white hover:bg-azul-dark"
          >
            {copied ? "Copied" : "Copy the Portuguese text"}
          </button>
        </div>
        {translation && (
          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Translation, so you know what you send
            </h4>
            <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-sans text-sm text-slate-700">
              {translation}
            </pre>
          </div>
        )}
      </div>
    </details>
  );
}
