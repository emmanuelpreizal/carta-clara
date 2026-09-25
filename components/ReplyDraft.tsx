"use client";

import { useState } from "react";

type Props = {
  draftPt: string;
  translation: string | null;
  replyEmail: string | null;
  subjectPt: string | null;
};

export default function ReplyDraft({ draftPt, translation, replyEmail, subjectPt }: Props) {
  const [copied, setCopied] = useState(false);

  const mailto = `mailto:${replyEmail ? encodeURIComponent(replyEmail) : ""}?subject=${encodeURIComponent(
    subjectPt ?? "",
  )}&body=${encodeURIComponent(draftPt)}`;

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
          Replace every part in [brackets] with your own details, for example [NOME] (your name)
          and [NIF] (your tax number). Send it yourself through the official channel.
        </p>
        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Português (Portugal)
          </h4>
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-sans text-sm text-slate-900">
            {draftPt}
          </pre>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              className="min-h-11 rounded-lg bg-azul px-4 text-sm font-semibold text-white hover:bg-azul-dark"
            >
              {copied ? "Copied" : "Copy the Portuguese text"}
            </button>
            <a
              href={mailto}
              className="flex min-h-11 items-center rounded-lg border border-azul px-4 text-sm font-semibold text-azul hover:bg-azul-light"
            >
              Open in my email app
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {replyEmail
              ? `The letter gives this email address for replies: ${replyEmail}. Check it on the original before sending.`
              : "The letter gives no email address. Check how to answer (online portal, post or in person) before sending, and add the address yourself."}
          </p>
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
