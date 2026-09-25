export type Language = {
  code: string;
  label: string;
  promptName: string;
  beta: boolean;
};

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", promptName: "English", beta: false },
  { code: "fr", label: "Français", promptName: "French", beta: false },
  { code: "es", label: "Español", promptName: "Spanish (Spain)", beta: true },
  { code: "uk", label: "Українська", promptName: "Ukrainian", beta: true },
  { code: "hi", label: "हिन्दी", promptName: "Hindi", beta: true },
  { code: "zh", label: "中文", promptName: "Simplified Chinese (Mandarin)", beta: true },
];

export const DEFAULT_LANGUAGE = "en";

export const BETA_NOTICE = "beta — not verified by a native speaker";

export function findLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
