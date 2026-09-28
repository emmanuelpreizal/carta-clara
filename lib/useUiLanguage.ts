"use client";

import { useEffect, useSyncExternalStore } from "react";
import { DEFAULT_UI_LANGUAGE, detectUiLanguage, getMessages, type UiLanguage } from "./i18n";

function subscribe(onChange: () => void) {
  window.addEventListener("languagechange", onChange);
  return () => window.removeEventListener("languagechange", onChange);
}

function readDeviceLanguage(): UiLanguage {
  return detectUiLanguage(navigator.language);
}

function readServerLanguage(): UiLanguage {
  return DEFAULT_UI_LANGUAGE;
}

export function useUiLanguage() {
  const lang = useSyncExternalStore(subscribe, readDeviceLanguage, readServerLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return { lang, t: getMessages(lang) };
}
