import type { DecodeResult } from "./types";

const NOT_CONFIRMED: Record<string, { deadline: string; amount: string }> = {
  en: {
    deadline: "The deadline could not be confirmed in the text. Check it on the original letter.",
    amount: "The amount could not be confirmed in the text. Check it on the original letter.",
  },
  fr: {
    deadline: "L'échéance n'a pas pu être confirmée dans le texte. Vérifiez-la sur le courrier original.",
    amount: "Le montant n'a pas pu être confirmé dans le texte. Vérifiez-le sur le courrier original.",
  },
  es: {
    deadline: "No se pudo confirmar el plazo en el texto. Compruébalo en la carta original.",
    amount: "No se pudo confirmar el importe en el texto. Compruébalo en la carta original.",
  },
  uk: {
    deadline: "Не вдалося підтвердити термін у тексті. Перевірте його в оригіналі листа.",
    amount: "Не вдалося підтвердити суму в тексті. Перевірте її в оригіналі листа.",
  },
  hi: {
    deadline: "पाठ में समय-सीमा की पुष्टि नहीं हो सकी। मूल पत्र में इसकी जाँच करें।",
    amount: "पाठ में राशि की पुष्टि नहीं हो सकी। मूल पत्र में इसकी जाँच करें।",
  },
  zh: {
    deadline: "无法在文本中确认截止日期。请在原始信件上核对。",
    amount: "无法在文本中确认金额。请在原始信件上核对。",
  },
};

function normalize(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[“”«»"]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function appearsIn(quote: string | null, source: string): boolean {
  if (!quote) return false;
  const q = normalize(quote);
  return q.length > 0 && normalize(source).includes(q);
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function verifyResult(
  result: DecodeResult,
  source: string | null,
  languageCode: string,
): DecodeResult {
  const messages = NOT_CONFIRMED[languageCode] ?? NOT_CONFIRMED.en;
  const out: DecodeResult = {
    ...result,
    actions: result.actions.slice(0, 3),
    key_terms: result.key_terms.slice(0, 3),
    uncertainties: [...result.uncertainties],
  };

  if (out.deadline && !isRealDate(out.deadline)) {
    out.deadline = null;
  }

  if (out.reply_email) {
    const email = out.reply_email.trim();
    const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const inText = source === null || normalize(source).includes(normalize(email));
    out.reply_email = looksValid && inText ? email : null;
  }

  if (!out.reply_needed) {
    out.reply_subject_pt = null;
    out.reply_draft_pt = null;
    out.reply_draft_translation = null;
  }

  if (source === null) return out;

  const hasDeadline = Boolean(out.deadline || out.deadline_relative);
  if (hasDeadline && !appearsIn(out.deadline_quote, source)) {
    out.deadline = null;
    out.deadline_relative = null;
    out.deadline_quote = null;
    out.uncertainties.push(messages.deadline);
  }

  if (out.amount_text && !appearsIn(out.amount_quote, source)) {
    out.amount_text = null;
    out.amount_quote = null;
    out.uncertainties.push(messages.amount);
  }

  return out;
}
