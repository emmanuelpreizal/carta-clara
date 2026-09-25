import type { DecodeResult } from "./types";

export const MOCK_RESULT: DecodeResult = {
  is_official_letter: true,
  sender: "Autoridade Tributária e Aduaneira (Finanças)",
  document_type: "Payment notice",
  summary:
    "The tax office says you have an unpaid municipal property tax. You must pay the amount before the deadline. If you do not pay, extra charges may be added.",
  urgency: "high",
  urgency_reason: "A payment is due soon.",
  deadline: "2026-10-05",
  deadline_relative: null,
  deadline_quote: "O pagamento deve ser efetuado até 05/10/2026.",
  amount_text: "248,60 €",
  amount_quote: "Valor a pagar: 248,60 €",
  actions: [
    "Pay 248,60 € using the payment reference in the letter.",
    "Keep the payment receipt.",
    "Contact the tax office if you think this is a mistake.",
  ],
  key_terms: [
    { pt: "Nota de cobrança", meaning: "Payment notice" },
    { pt: "Referência de pagamento", meaning: "Payment reference used at an ATM or bank" },
    { pt: "Juros de mora", meaning: "Late payment interest" },
  ],
  reply_needed: true,
  reply_draft_pt:
    "Exmos. Senhores,\n\nVenho por este meio solicitar esclarecimentos sobre a nota de cobrança recebida, no valor de 248,60 €.\n\nCom os melhores cumprimentos,\n[NOME]\nNIF: [NIF]",
  reply_draft_translation:
    "Dear Sir or Madam,\n\nI am writing to ask for clarification about the payment notice I received, for the amount of 248,60 €.\n\nKind regards,\n[NOME]\nNIF: [NIF]",
  uncertainties: ["The payment reference number is not fully readable."],
};
