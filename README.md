# Carta Clara

Understand official Portuguese letters in seconds.

Paste the text of a letter from the tax office (Finanças), social security (Segurança Social)
or the city hall, and get a clear action card in your language: who is writing, how urgent it
is, the deadline with days left and the original sentence, the amount, what to do, and a draft
reply in European Portuguese with its translation.

Built solo at the AI Hacker House: Equinox Edition (Lisbon, 25 September 2026), Social Good track.

## How the AI is used

One call to Claude (Anthropic) per letter, from a server route. Claude returns strict JSON.
The app then checks that the deadline and amount sentences really appear in the pasted text,
and computes the days left in the browser. Dates and amounts are never invented: if they are
not clearly written, they are left empty and listed under "To confirm on the original".

## Limits

- This is not legal or tax advice.
- Tested only with fictional letters.
- English and French are verified. Spanish, Ukrainian, Hindi and Chinese are in beta.
- Nothing is stored by the app. The text is processed by an AI service to produce the result.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Claude API (Anthropic), Vercel.

## Run locally

```bash
npm install
echo "ANTHROPIC_API_KEY=your-key" > .env.local
npm run dev
```
