"use client";

import { useState } from "react";
import type { Messages } from "@/lib/i18n";

type Props = {
  draftPt: string;
  translation: string | null;
  replyEmail: string | null;
  subjectPt: string | null;
  condition: string | null;
  t: Messages;
};

const textareaClass =
  "w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 focus:border-azul focus:bg-white focus:outline-none";

export default function ReplyDraft({
  draftPt,
  translation,
  replyEmail,
  subjectPt,
  condition,
  t,
}: Props) {
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
        setUpdateError(
          data?.error === "ai_unavailable"
            ? t.errors.aiUnavailable
            : data?.error === "invalid_response"
              ? t.errors.invalidResponse
              : t.errors.generic,
        );
        return;
      }
      setPtText(data.draft_pt);
      setSyncedOwnText(ownText);
    } catch {
      setUpdateError(t.errors.noConnection);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <details className="rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-slate-900">
        {t.reply.title}
        {condition && (
          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900">
            {t.reply.optional}
          </span>
        )}
      </summary>
      <div className="space-y-5 border-t border-slate-200 px-4 py-4">
        {condition && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <span className="font-semibold">{t.reply.onlyUseful} </span>
            {condition}
          </p>
        )}
        <p className="text-sm text-slate-600">{t.reply.placeholders}</p>

        {translation !== null && (
          <div>
            <label
              htmlFor="reply-own"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              {t.reply.ownLabel}
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
              {updating ? t.reply.translating : t.reply.update}
            </button>
            {outOfSync && !updating && (
              <p className="mt-2 text-xs font-semibold text-amber-800">
                {t.reply.outOfSync}
              </p>
            )}
            {updateError && (
              <p className="mt-2 text-xs text-red-700" role="alert">
                {updateError}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              {t.reply.aiNote}
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="reply-pt"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {translation !== null ? "2. " : ""}
            {t.reply.ptLabel}
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
              {copied ? t.reply.copied : t.reply.copy}
            </button>
            <a
              href={mailto}
              aria-disabled={updating}
              className={`flex min-h-11 items-center rounded-lg border border-azul px-4 text-sm font-semibold text-azul hover:bg-azul-light ${
                updating ? "pointer-events-none opacity-40" : ""
              }`}
            >
              {t.reply.openEmail}
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {replyEmail ? t.reply.emailGiven(replyEmail) : t.reply.noEmail}
          </p>
        </div>
      </div>
    </details>
  );
}
