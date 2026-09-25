"use client";

import { useState } from "react";
import ActionCard from "@/components/ActionCard";
import { BETA_NOTICE, DEFAULT_LANGUAGE, LANGUAGES, findLanguage } from "@/lib/languages";
import { MAX_CHARS } from "@/lib/limits";
import { SAMPLES } from "@/lib/samples";
import type { DecodeResult } from "@/lib/types";

type ErrorState = { message: string; canRetry: boolean };

export default function Home() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [resultBeta, setResultBeta] = useState(false);

  const selected = findLanguage(language);
  const tooLong = text.length > MAX_CHARS;

  async function decode() {
    setError(null);
    if (!text.trim()) {
      setError({ message: "Paste the text of a letter first.", canRetry: false });
      return;
    }
    if (tooLong) {
      setError({
        message: `This text is too long. Keep it under ${MAX_CHARS} characters.`,
        canRetry: false,
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setError({
          message: data?.message ?? "Something went wrong. Please try again.",
          canRetry: res.status >= 500 || !data,
        });
        return;
      }
      setResult(data as DecodeResult);
      setResultBeta(selected?.beta ?? false);
    } catch {
      setError({ message: "No connection. Check your internet and try again.", canRetry: true });
    } finally {
      setLoading(false);
    }
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
          <p className="mb-2 text-sm font-semibold text-slate-900">
            Try a sample{" "}
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
              demo data, fictional letters
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setText(s.text);
                  setResult(null);
                  setError(null);
                }}
                className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm text-slate-800 hover:bg-slate-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

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
          <div className="rounded-lg bg-red-50 px-3 py-3 text-red-800" role="alert">
            <p>{error.message}</p>
            {error.canRetry && (
              <button
                type="button"
                onClick={decode}
                className="mt-2 min-h-11 rounded-lg bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800"
              >
                Try again
              </button>
            )}
          </div>
        )}
        {loading && (
          <p className="animate-pulse text-center text-slate-600">
            Finding the sender, the deadline and what you need to do…
          </p>
        )}
        {result && !result.is_official_letter && (
          <p className="rounded-lg bg-slate-100 px-3 py-3 text-slate-800">
            This does not look like an official letter. Carta Clara works with letters from
            Portuguese public bodies, like the tax office, social security or the city hall.
          </p>
        )}
        {result && result.is_official_letter && <ActionCard result={result} beta={resultBeta} />}
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
        <p className="font-semibold">This is not legal or tax advice.</p>
      </footer>
    </main>
  );
}
