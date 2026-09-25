import type { Urgency } from "./types";

export type DisplayUrgency = Urgency | "overdue";

const URGENT_WITHIN_DAYS = 15;

export function daysLeft(deadline: string | null, today: Date = new Date()): number | null {
  if (!deadline || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return null;
  const [y, m, d] = deadline.split("-").map(Number);
  const due = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((due - now) / 86_400_000);
}

export function displayUrgency(aiUrgency: Urgency, days: number | null): DisplayUrgency {
  if (days !== null && days < 0) return "overdue";
  if (days !== null && days <= URGENT_WITHIN_DAYS) return "high";
  return aiUrgency;
}

export function formatDeadline(deadline: string): string {
  const [y, m, d] = deadline.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function daysLeftLabel(days: number): string {
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? "" : "s"} overdue`;
  if (days === 0) return "today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}
