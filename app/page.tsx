"use client";

import { useState } from "react";
import ActionCard from "@/components/ActionCard";
import { BETA_NOTICE, DEFAULT_LANGUAGE, LANGUAGES, findLanguage } from "@/lib/languages";
import { MOCK_RESULT } from "@/lib/mock";
import type { DecodeResult } from "@/lib/types";

const MAX_CHARS = 6000;

export default function Home() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);

  const selected = findLanguage(language);
  const tooLong = text.length > MAX_CHARS;

  async function decode() {
    setError(null);
    if (!text.trim()) {
      setError("Paste the text of a letter first.");
      return;
    }
    if (tooLong) {
      setError(`This text is too long. Keep it under ${MAX_CHARS} characters.`);
      return;
    }
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    setResult(MOCK_RESULT);
    setLoading(false);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Carta Clara</h1>
        <p className="mt-1 text-slate-600">
          Paste an official Portuguese letter. Understand in seconds what it asks, by when, and
          what to do.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <label htmlFor="letter" className="mb-1 block font-semibold text-slate-900">
            Letter text
          </label>
          <textarea
            id="letter"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste the text of the letter or email here…"
            className="w-full rounded-lg border border-slate-300 p-3 text-base text-slate-900 focus:border-slate-900 focus:outline-none"
          />
          <div className="mt-1 flex justify-between gap-2 text-xs text-slate-500">
            <span>Hide your name, NIF and address before pasting.</span>
            <span className={tooLong ? "font-semibold text-red-700" : ""}>
              {text.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="language" className="mb-1 block font-semibold text-slate-900">
            Explain it in
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.beta ? `${l.label} (${BETA_NOTICE})` : l.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={decode}
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-slate-900 text-lg font-bold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Reading your letter…" : "Decode it"}
        </button>

        <p className="text-xs text-slate-500">
          Not stored by this app. Your text is processed by an AI service to produce the result.
        </p>
      </section>

      <div className="mt-6" aria-live="polite">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-red-800" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <p className="animate-pulse text-center text-slate-600">
            Finding the sender, the deadline and what you need to do…
          </p>
        )}
        {result && <ActionCard result={result} beta={selected?.beta ?? false} />}
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
        <p className="font-semibold">This is not legal or tax advice.</p>
      </footer>
    </main>
  );
}
