"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ActionCard from "@/components/ActionCard";
import ResultPreview from "@/components/ResultPreview";
import { BETA_NOTICE, DEFAULT_LANGUAGE, LANGUAGES, findLanguage } from "@/lib/languages";
import { MAX_CHARS } from "@/lib/limits";
import type { DecodeResult } from "@/lib/types";
import { MAX_PDF_BYTES, prepareUpload, type UploadedFile } from "@/lib/upload";

type ErrorState = { message: string; canRetry: boolean };
type InputMode = "file" | "text";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 12h7M9 16h7M9 8h3" />
    </svg>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [resultBeta, setResultBeta] = useState(false);
  const [resultFromFile, setResultFromFile] = useState(false);
  const [upload, setUpload] = useState<UploadedFile | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [mode, setMode] = useState<InputMode>("text");

  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = findLanguage(language);
  const tooLong = text.length > MAX_CHARS;

  useEffect(() => {
    if (loading || result || error) {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, result, error]);

  function clearUpload() {
    setUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onFileChosen(file: File | undefined) {
    if (!file) return;
    setError(null);
    setResult(null);
    setPreparing(true);
    try {
      setUpload(await prepareUpload(file));
    } catch (e) {
      clearUpload();
      const reason = e instanceof Error ? e.message : "";
      setError({
        message:
          reason === "pdf_too_large"
            ? `This PDF is too large (max ${MAX_PDF_BYTES / 1024 / 1024} MB). Paste the text instead.`
            : "This file could not be opened. Use a JPG or PNG photo, a PDF, or paste the text.",
        canRetry: false,
      });
    } finally {
      setPreparing(false);
    }
  }

  async function decode() {
    setError(null);
    const useFile = mode === "file";
    if (useFile && !upload) {
      setError({ message: "Take a photo or choose a file first.", canRetry: false });
      return;
    }
    if (!useFile) {
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
    }
    setLoading(true);
    setResult(null);
    try {
      const payload =
        useFile && upload
          ? { language, file: { data: upload.data, media_type: upload.media_type } }
          : { language, text };
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setError({
          message:
            data?.message ??
            (res.status === 413
              ? "This file is too large. Try a smaller photo or paste the text."
              : "Something went wrong. Please try again."),
          canRetry: (res.status >= 500 || !data) && res.status !== 413,
        });
        return;
      }
      setResult(data as DecodeResult);
      setResultBeta(selected?.beta ?? false);
      setResultFromFile(useFile);
    } catch {
      setError({ message: "No connection. Check your internet and try again.", canRetry: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <a
          href="https://aiflowia.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="AI Flow IA website"
        >
          <Image src="/aiflowia-logo.png" alt="AI Flow IA" width={120} height={30} priority />
        </a>
        <p className="mt-2 text-sm text-slate-600">
          AI tools that make everyday life simpler.
        </p>
      </div>

      <header className="mb-6">
        <p className="mb-2 inline-block rounded-full bg-azul-light px-3 py-1 text-xs font-semibold text-azul">
          For newcomers to Portugal
        </p>
        <h1 className="text-3xl font-bold text-azul">Descodifica</h1>
        <p className="mt-1 text-slate-600">
          Paste an official Portuguese letter. Understand in seconds what it asks, by when, and
          what to do.
        </p>
        <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
          <li>
            <span className="font-bold text-azul">1.</span> Paste or photograph the letter
          </li>
          <li>
            <span className="font-bold text-azul">2.</span> Pick your language
          </li>
          <li>
            <span className="font-bold text-azul">3.</span> Get what to do and by when
          </li>
        </ol>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="mb-2 font-semibold text-slate-900">Your letter</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="How to add your letter">
            {(
              [
                { id: "file", label: "Photo or PDF", icon: <CameraIcon /> },
                { id: "text", label: "Paste text", icon: <TextIcon /> },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => {
                  setMode(m.id);
                  setError(null);
                }}
                className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 px-3 text-base font-semibold transition-colors ${
                  mode === m.id
                    ? "border-azul bg-azul-light text-azul"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div hidden={mode !== "text"}>
          <label htmlFor="letter" className="sr-only">
            Letter text
          </label>
          <textarea
            id="letter"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Paste the text of the letter or email here…"
            className="w-full rounded-lg border border-slate-300 p-3 text-base text-slate-900 focus:border-azul focus:outline-none"
          />
          <div className="mt-1 flex justify-between gap-2 text-xs text-slate-500">
            <span>Hide your name, NIF and address before pasting.</span>
            <span className={tooLong ? "font-semibold text-red-700" : ""}>
              {text.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <div hidden={mode !== "file"}>
          <input
            ref={fileInputRef}
            id="letter-file"
            type="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={(e) => onFileChosen(e.target.files?.[0])}
          />
          {upload ? (
            <div className="flex items-center gap-3 rounded-lg border border-azul bg-azul-light p-3">
              {upload.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={upload.previewUrl}
                  alt="Your photo"
                  className="h-16 w-12 rounded object-cover"
                />
              ) : (
                <span className="flex h-16 w-12 items-center justify-center rounded bg-white text-xs font-bold text-azul">
                  PDF
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{upload.name}</p>
                <p className="text-xs text-slate-600">Ready to decode.</p>
              </div>
              <button
                type="button"
                onClick={clearUpload}
                className="min-h-11 rounded-lg px-3 text-sm font-semibold text-azul hover:bg-white"
              >
                Remove
              </button>
            </div>
          ) : (
            <label
              htmlFor="letter-file"
              className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 px-3 text-center hover:border-azul hover:bg-azul-light"
            >
              <span className="text-azul">
                <CameraIcon />
              </span>
              <span className="font-semibold text-slate-900">
                {preparing ? "Preparing your file…" : "Take a photo or choose a file"}
              </span>
              <span className="text-xs text-slate-500">
                JPG, PNG or PDF. The whole page, flat, in good light.
              </span>
            </label>
          )}
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
          disabled={loading || preparing}
          className="min-h-12 w-full rounded-xl bg-azul text-lg font-bold text-white hover:bg-azul-dark disabled:opacity-60"
        >
          {loading ? "Reading your letter…" : "Decode it"}
        </button>

        <p className="text-xs text-slate-500">
          Not stored by this app. Your text or file is processed by an AI service to produce the
          result.
        </p>
      </section>

      <div ref={outputRef} className="mt-6 scroll-mt-4" aria-live="polite">
        {!result && !loading && !error && <ResultPreview />}
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
        {result && !result.is_readable && (
          <div className="rounded-lg bg-amber-50 px-3 py-3 text-amber-900">
            <p className="font-semibold">We could not read this file clearly.</p>
            <p className="mt-1 text-sm">
              Take a new photo of the whole page, flat, in good light. Or paste the text instead.
            </p>
            {result.uncertainties.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {result.uncertainties.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {result && result.is_readable && !result.is_official_letter && (
          <p className="rounded-lg bg-slate-100 px-3 py-3 text-slate-800">
            This does not look like an official letter. Descodifica works with letters from
            Portuguese public bodies, like the tax office, social security or the city hall.
          </p>
        )}
        {result && result.is_readable && result.is_official_letter && (
          <>
            {resultFromFile && (
              <p className="mb-3 rounded-lg bg-azul-light px-3 py-2 text-sm text-azul">
                Read from your file: compare the dates and amounts with your document.
              </p>
            )}
            <ActionCard result={result} beta={resultBeta} />
          </>
        )}
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
        <p className="font-semibold">This is not legal or tax advice.</p>
      </footer>
    </main>
  );
}
