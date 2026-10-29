import type { ContributionDay } from '@/components/ui/contribution-skyline';
export function parseContributions(payload: unknown): ContributionDay[] {
 if (!payload || typeof payload !== 'object' || !('contributions' in payload) || !Array.isArray(payload.contributions)) throw new Error('Invalid contribution response');
 const days = payload.contributions.map((day: unknown) => {
  if (!day || typeof day !== 'object' || !('date' in day) || !('count' in day) || typeof day.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isSafeInteger(day.count) || Number(day.count) < 0 || !Number.isFinite(Date.parse(day.date))) throw new Error('Invalid contribution day');
  return { date: day.date, count: Number(day.count) };
 }).sort((a,b) => a.date.localeCompare(b.date));
 if (!days.length) throw new Error('No activity data returned');
 if (new Set(days.map(day=>day.date)).size !== days.length) throw new Error('Duplicate contribution dates');
 return days;
}
