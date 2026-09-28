"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ActionCard from "@/components/ActionCard";
import ResultPreview from "@/components/ResultPreview";
import type { Messages } from "@/lib/i18n";
import { LANGUAGES, findLanguage } from "@/lib/languages";
import { MAX_CHARS } from "@/lib/limits";
import type { DecodeResult } from "@/lib/types";
import { MAX_PDF_BYTES, prepareUpload, type UploadedFile } from "@/lib/upload";
import { useUiLanguage } from "@/lib/useUiLanguage";

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

function SmallIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function trustItems(t: Messages) {
  return [
    {
      label: t.nothingStored,
      icon: (
        <SmallIcon>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </SmallIcon>
      ),
    },
    {
      label: t.languagesCount(LANGUAGES.length),
      icon: (
        <SmallIcon>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </SmallIcon>
      ),
    },
    {
      label: t.notLegalAdvice,
      icon: (
        <SmallIcon>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </SmallIcon>
      ),
    },
  ];
}

function apiErrorMessage(code: unknown, status: number, t: Messages): string {
  switch (code) {
    case "empty":
      return t.errors.needText;
    case "too_long":
      return t.errors.tooLong(MAX_CHARS);
    case "too_large":
      return t.errors.fileTooLarge;
    case "bad_file":
      return t.errors.badFile;
    case "invalid_response":
      return t.errors.invalidResponse;
    case "ai_unavailable":
      return t.errors.aiUnavailable;
    default:
      return status === 413 ? t.errors.fileTooLarge : t.errors.generic;
  }
}

export default function Home() {
  const { lang, t } = useUiLanguage();
  const [text, setText] = useState("");
  const [languageChoice, setLanguageChoice] = useState<string | null>(null);
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

  const language = languageChoice ?? lang;
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
            ? t.errors.pdfTooLarge(MAX_PDF_BYTES / 1024 / 1024)
            : t.errors.fileUnopenable,
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
      setError({ message: t.errors.needFile, canRetry: false });
      return;
    }
    if (!useFile) {
      if (!text.trim()) {
        setError({ message: t.errors.needText, canRetry: false });
        return;
      }
      if (tooLong) {
        setError({ message: t.errors.tooLong(MAX_CHARS), canRetry: false });
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
          message: apiErrorMessage(data?.error, res.status, t),
          canRetry: (res.status >= 500 || !data) && res.status !== 413,
        });
        return;
      }
      setResult(data as DecodeResult);
      setResultBeta(selected?.beta ?? false);
      setResultFromFile(useFile);
    } catch {
      setError({ message: t.errors.noConnection, canRetry: true });
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
        <p className="mt-2 text-sm text-slate-600">{t.tagline}</p>
      </div>

      <header className="mb-6">
        <p className="mb-2 inline-block rounded-full bg-azul-light px-3 py-1 text-xs font-semibold text-azul">
          {t.audienceBadge}
        </p>
        <h1 className="text-3xl font-bold text-azul">Descodifica</h1>
        <p className="mt-1 text-slate-600">{t.intro}</p>
        <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
          {t.steps.map((step, i) => (
            <li key={step}>
              <span className="font-bold text-azul">{i + 1}.</span> {step}
            </li>
          ))}
        </ol>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="mb-2 font-semibold text-slate-900">{t.yourLetter}</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={t.howToAdd}>
            {(
              [
                { id: "file", label: t.modeFile, icon: <CameraIcon /> },
                { id: "text", label: t.modeText, icon: <TextIcon /> },
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
            {t.letterText}
          </label>
          <textarea
            id="letter"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder={t.placeholder}
            className="w-full rounded-lg border border-slate-300 p-3 text-base text-slate-900 focus:border-azul focus:outline-none"
          />
          <div className="mt-1 flex justify-between gap-2 text-xs text-slate-500">
            <span>{t.hideData}</span>
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
                  alt={t.yourPhoto}
                  className="h-16 w-12 rounded object-cover"
                />
              ) : (
                <span className="flex h-16 w-12 items-center justify-center rounded bg-white text-xs font-bold text-azul">
                  PDF
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{upload.name}</p>
                <p className="text-xs text-slate-600">{t.readyToDecode}</p>
              </div>
              <button
                type="button"
                onClick={clearUpload}
                className="min-h-11 rounded-lg px-3 text-sm font-semibold text-azul hover:bg-white"
              >
                {t.remove}
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
                {preparing ? t.preparingFile : t.takePhoto}
              </span>
              <span className="text-xs text-slate-500">{t.photoHint}</span>
            </label>
          )}
        </div>

        <div>
          <label htmlFor="language" className="mb-1 block font-semibold text-slate-900">
            {t.explainIn}
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguageChoice(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.beta ? `${l.label} (${t.betaNotice})` : l.label}
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
          {loading ? t.reading : t.decode}
        </button>

        <ul className="flex flex-wrap justify-center gap-2" aria-label={t.goodToKnow}>
          {trustItems(t).map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <span className="text-azul">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>

        <p className="text-center text-xs text-slate-500">{t.privacy}</p>
      </section>

      <div ref={outputRef} className="mt-6 scroll-mt-4" aria-live="polite">
        {!result && !loading && !error && <ResultPreview lang={lang} t={t} />}
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-3 text-red-800" role="alert">
            <p>{error.message}</p>
            {error.canRetry && (
              <button
                type="button"
                onClick={decode}
                className="mt-2 min-h-11 rounded-lg bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800"
              >
                {t.errors.tryAgain}
              </button>
            )}
          </div>
        )}
        {loading && <p className="animate-pulse text-center text-slate-600">{t.loading}</p>}
        {result && !result.is_readable && (
          <div className="rounded-lg bg-amber-50 px-3 py-3 text-amber-900">
            <p className="font-semibold">{t.unreadableTitle}</p>
            <p className="mt-1 text-sm">{t.unreadableHint}</p>
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
          <p className="rounded-lg bg-slate-100 px-3 py-3 text-slate-800">{t.notOfficial}</p>
        )}
        {result && result.is_readable && result.is_official_letter && (
          <>
            {resultFromFile && (
              <p className="mb-3 rounded-lg bg-azul-light px-3 py-2 text-sm text-azul">
                {t.readFromFile}
              </p>
            )}
            <ActionCard result={result} beta={resultBeta} lang={lang} t={t} />
          </>
        )}
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
        <p className="font-semibold">{t.footer}</p>
        {t.uiBeta && <p className="mt-1 text-xs">{t.uiBetaNote}</p>}
      </footer>
    </main>
  );
}
