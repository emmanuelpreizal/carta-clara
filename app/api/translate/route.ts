import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { MODEL, TRANSLATE_SYSTEM_PROMPT, translateMessage } from "@/lib/prompt";

export const maxDuration = 60;

const MAX_REPLY_CHARS = 4000;

const TranslateSchema = z.object({ draft_pt: z.string() });

const client = new Anthropic();

function fail(status: number, error: string, message: string) {
  return Response.json({ error, message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "bad_request", "The request could not be read.");
  }

  const { text } = (body ?? {}) as { text?: unknown };
  if (typeof text !== "string" || !text.trim()) {
    return fail(400, "empty", "Write your reply first.");
  }
  if (text.length > MAX_REPLY_CHARS) {
    return fail(400, "too_long", `Your reply is too long. Keep it under ${MAX_REPLY_CHARS} characters.`);
  }

  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.messages.parse({
          model: MODEL,
          max_tokens: 4000,
          system: TRANSLATE_SYSTEM_PROMPT,
          output_config: { effort: "low", format: zodOutputFormat(TranslateSchema) },
          messages: [{ role: "user", content: translateMessage(text) }],
        });
        const draft = response.stop_reason === "end_turn" ? response.parsed_output?.draft_pt : null;
        if (draft) return Response.json({ draft_pt: draft });
      } catch (error) {
        if (error instanceof Anthropic.APIError) throw error;
      }
    }
    return fail(502, "invalid_response", "The translation could not be read. Please try again.");
  } catch (error) {
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    console.error("translate failed", status ?? "unknown");
    return fail(503, "ai_unavailable", "The AI service is not available right now. Please try again.");
  }
}
