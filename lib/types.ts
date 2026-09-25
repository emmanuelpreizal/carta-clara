export type Urgency = "high" | "medium" | "low";

export type KeyTerm = {
  pt: string;
  meaning: string;
};

export type DecodeResult = {
  is_official_letter: boolean;
  sender: string | null;
  document_type: string;
  summary: string;
  urgency: Urgency;
  urgency_reason: string;
  deadline: string | null;
  deadline_relative: string | null;
  deadline_quote: string | null;
  amount_text: string | null;
  amount_quote: string | null;
  actions: string[];
  key_terms: KeyTerm[];
  reply_needed: boolean;
  reply_draft_pt: string | null;
  reply_draft_translation: string | null;
  uncertainties: string[];
};
