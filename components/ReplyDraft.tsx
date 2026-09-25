"use client";

import { useState } from "react";

type Props = {
  draftPt: string;
  translation: string | null;
  replyEmail: string | null;
  subjectPt: string | null;
};

const textareaClass =
  "w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 focus:border-azul focus:bg-white focus:outline-none";

export default function ReplyDraft({ draftPt, translation, replyEmail, subjectPt }: Props) {
  const [ptText, setPtText] = useState(draftPt);
  const [ownText, setOwnText] = useState(translation ?? "");
  const [syncedOwnText, setSyncedOwnText] = useState(translation ?? "");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const outOfSync = translation !== null && ownText !== syncedOwnText;

  const mailto = `mailto:${replyEmail ? encodeURIComponent(replyEmail) : ""}?subject=${encodeURIComponent(
    subjectPt ?? "",
  )}&body=${encodeURIComponent(ptText)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(ptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function updatePortuguese() {
    setUpdateError(null);
    setUpdating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ownText }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.draft_pt) {
        setUpdateError(data?.message ?? "Something went wrong. Please try again.");
        return;
      }
      setPtText(data.draft_pt);
      setSyncedOwnText(ownText);
    } catch {
      setUpdateError("No connection. Check your internet and try again.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <details className="rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-slate-900">
        Draft reply in Portuguese
      </summary>
      <div className="space-y-5 border-t border-slate-200 px-4 py-4">
        <p className="text-sm text-slate-600">
          Replace every part in [brackets] with your own details, for example [NOME] (your name)
          and [NIF] (your tax number). Send it yourself through the official channel.
        </p>

        {translation !== null && (
          <div>
            <label
              htmlFor="reply-own"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              1. Your reply in your language — you can edit it
            </label>
            <textarea
              id="reply-own"
              value={ownText}
              onChange={(e) => setOwnText(e.target.value)}
              rows={9}
              className={textareaClass}
            />
            <button
              type="button"
              onClick={updatePortuguese}
              disabled={!outOfSync || updating || !ownText.trim()}
              className="mt-2 min-h-11 rounded-lg bg-azul px-4 text-sm font-semibold text-white hover:bg-azul-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {updating ? "Translating…" : "Update the Portuguese version"}
            </button>
            {outOfSync && !updating && (
              <p className="mt-2 text-xs font-semibold text-amber-800">
                You changed your reply. Update the Portuguese version before sending.
              </p>
            )}
            {updateError && (
              <p className="mt-2 text-xs text-red-700" role="alert">
                {updateError}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              The AI translates what you write, without adding anything.
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="reply-pt"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {translation !== null ? "2. " : ""}Português (Portugal) — this is what you send
          </label>
          <textarea
            id="reply-pt"
            value={ptText}
            onChange={(e) => setPtText(e.target.value)}
            rows={9}
            className={`${textareaClass} ${updating ? "opacity-50" : ""}`}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              disabled={updating}
              className="min-h-11 rounded-lg bg-azul px-4 text-sm font-semibold text-white hover:bg-azul-dark disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy the Portuguese text"}
            </button>
            <a
              href={mailto}
              aria-disabled={updating}
              className={`flex min-h-11 items-center rounded-lg border border-azul px-4 text-sm font-semibold text-azul hover:bg-azul-light ${
                updating ? "pointer-events-none opacity-40" : ""
              }`}
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
      </div>
    </details>
  );
}
