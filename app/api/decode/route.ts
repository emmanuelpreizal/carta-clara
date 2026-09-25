import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { findLanguage } from "@/lib/languages";
import { MAX_CHARS } from "@/lib/limits";
import { MODEL, SYSTEM_PROMPT, fileMessage, userMessage } from "@/lib/prompt";
import { DecodeSchema } from "@/lib/schema";
import type { DecodeResult } from "@/lib/types";
import { verifyResult } from "@/lib/verify";

export const maxDuration = 60;

const MAX_FILE_BASE64_CHARS = 4_300_000;
const FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
type FileType = (typeof FILE_TYPES)[number];

const client = new Anthropic();

function fail(status: number, error: string, message: string) {
  return Response.json({ error, message }, { status });
}

function buildContent(
  text: string | null,
  file: { data: string; media_type: FileType } | null,
  language: string,
): Anthropic.MessageParam["content"] {
  if (!file) return userMessage(text ?? "", language);
  const block: Anthropic.ContentBlockParam =
    file.media_type === "application/pdf"
      ? {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: file.data },
        }
      : {
          type: "image",
          source: { type: "base64", media_type: file.media_type, data: file.data },
        };
  return [block, { type: "text", text: fileMessage(language) }];
}

async function askClaude(content: Anthropic.MessageParam["content"]): Promise<DecodeResult | null> {
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    output_config: { effort: "low", format: zodOutputFormat(DecodeSchema) },
    messages: [{ role: "user", content }],
  });
  if (response.stop_reason !== "end_turn") return null;
  return response.parsed_output ?? null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(413, "too_large", "This file is too large. Try a smaller photo or paste the text.");
  }

  const { text, language, file } = (body ?? {}) as {
    text?: unknown;
    language?: unknown;
    file?: { data?: unknown; media_type?: unknown };
  };

  const lang = typeof language === "string" ? findLanguage(language) : undefined;
  if (!lang) {
    return fail(400, "bad_request", "Unknown language.");
  }

  let upload: { data: string; media_type: FileType } | null = null;
  if (file) {
    if (
      typeof file.data !== "string" ||
      !file.data ||
      !FILE_TYPES.includes(file.media_type as FileType)
    ) {
      return fail(400, "bad_file", "This file type is not supported. Use a photo (JPG, PNG) or a PDF.");
    }
    if (file.data.length > MAX_FILE_BASE64_CHARS) {
      return fail(413, "too_large", "This file is too large. Try a smaller photo or paste the text.");
    }
    upload = { data: file.data, media_type: file.media_type as FileType };
  } else {
    if (typeof text !== "string" || !text.trim()) {
      return fail(400, "empty", "Paste the text of a letter first.");
    }
    if (text.length > MAX_CHARS) {
      return fail(400, "too_long", `This text is too long. Keep it under ${MAX_CHARS} characters.`);
    }
  }

  const source = upload ? null : (text as string);
  const content = buildContent(source, upload, lang.promptName);

  try {
    let result: DecodeResult | null = null;
    for (let attempt = 0; attempt < 2 && !result; attempt++) {
      try {
        result = await askClaude(content);
      } catch (error) {
        if (error instanceof Anthropic.APIError) throw error;
        result = null;
      }
    }
    if (!result) {
      return fail(502, "invalid_response", "The AI answer could not be read. Please try again.");
    }
    return Response.json(verifyResult(result, source, lang.code));
  } catch (error) {
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    console.error("decode failed", status ?? "unknown");
    if (status === 400 && upload) {
      return fail(400, "bad_file", "This file could not be read. Try another photo or paste the text.");
    }
    return fail(503, "ai_unavailable", "The AI service is not available right now. Please try again.");
  }
}
