import { z } from "zod";

export const DecodeSchema = z.object({
  is_official_letter: z.boolean(),
  sender: z.string().nullable(),
  document_type: z.string(),
  summary: z.string(),
  urgency: z.enum(["high", "medium", "low"]),
  urgency_reason: z.string(),
  deadline: z.string().nullable(),
  deadline_relative: z.string().nullable(),
  deadline_quote: z.string().nullable(),
  amount_text: z.string().nullable(),
  amount_quote: z.string().nullable(),
  actions: z.array(z.string()),
  key_terms: z.array(z.object({ pt: z.string(), meaning: z.string() })),
  reply_needed: z.boolean(),
  reply_draft_pt: z.string().nullable(),
  reply_draft_translation: z.string().nullable(),
  uncertainties: z.array(z.string()),
});
