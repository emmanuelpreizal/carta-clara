import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { findLanguage } from "@/lib/languages";
import { MAX_CHARS } from "@/lib/limits";
import { MODEL, SYSTEM_PROMPT, userMessage } from "@/lib/prompt";
import { DecodeSchema } from "@/lib/schema";
import type { DecodeResult } from "@/lib/types";
import { verifyAgainstText } from "@/lib/verify";

export const maxDuration = 60;

const client = new Anthropic();

function fail(status: number, error: string, message: string) {
  return Response.json({ error, message }, { status });
}

async function askClaude(letter: string, language: string): Promise<DecodeResult | null> {
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    output_config: { effort: "low", format: zodOutputFormat(DecodeSchema) },
    messages: [{ role: "user", content: userMessage(letter, language) }],
  });
  if (response.stop_reason !== "end_turn") return null;
  return response.parsed_output ?? null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "bad_request", "The request could not be read.");
  }

  const { text, language } = (body ?? {}) as { text?: unknown; language?: unknown };
  if (typeof text !== "string" || !text.trim()) {
    return fail(400, "empty", "Paste the text of a letter first.");
  }
  if (text.length > MAX_CHARS) {
    return fail(400, "too_long", `This text is too long. Keep it under ${MAX_CHARS} characters.`);
  }
  const lang = typeof language === "string" ? findLanguage(language) : undefined;
  if (!lang) {
    return fail(400, "bad_request", "Unknown language.");
  }

  try {
    let result: DecodeResult | null = null;
    for (let attempt = 0; attempt < 2 && !result; attempt++) {
      try {
        result = await askClaude(text, lang.promptName);
      } catch (error) {
        if (error instanceof Anthropic.APIError) throw error;
        result = null;
      }
    }
    if (!result) {
      return fail(502, "invalid_response", "The AI answer could not be read. Please try again.");
    }
    return Response.json(verifyAgainstText(result, text, lang.code));
  } catch (error) {
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    console.error("decode failed", status ?? "unknown");
    return fail(503, "ai_unavailable", "The AI service is not available right now. Please try again.");
  }
}
