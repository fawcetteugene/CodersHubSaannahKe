import { getChatGPTUser, type ChatGPTUser } from '@/app/chatgpt-auth';
import { siteConfig } from '@/lib/site-config';

export function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !!origin && origin === new URL(request.url).origin;
}

export function isOwner(user: ChatGPTUser | null | undefined) {
  return !!user && user.email.toLowerCase() === siteConfig.email.toLowerCase();
}

export async function requireUser() {
  const user = await getChatGPTUser();
  if (!user) return { user: null as ChatGPTUser | null, error: json({ error: 'Please sign in to continue.' }, 401) };
  return { user, error: null as Response | null };
}

export async function requireOwner() {
  const { user, error } = await requireUser();
  if (error) return { user: null as ChatGPTUser | null, error };
  if (!isOwner(user)) return { user: null as ChatGPTUser | null, error: json({ error: 'This action is only available to the site owner.' }, 403) };
  return { user, error: null as Response | null };
}

export function newId() {
  return crypto.randomUUID();
}

export function referenceFrom(id: string, prefix = 'SC') {
  return `${prefix}-${id.replaceAll('-', '').slice(0, 12).toUpperCase()}`;
}

export function validTimezone(value: string) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export const projectStatuses = [
  'draft', 'submitted', 'under_review', 'needs_clarification', 'quoted', 'quote_accepted',
  'deposit_pending', 'active', 'in_review', 'revision_requested', 'completed', 'cancelled', 'refunded',
] as const;

export const revisionStatuses = ['submitted', 'reviewing', 'approved', 'rejected', 'in_progress', 'delivered', 'closed'] as const;
export const bookingStatuses = ['requested', 'confirmed', 'completed', 'cancelled'] as const;
export const paymentStatuses = ['pending', 'awaiting_confirmation', 'paid', 'failed', 'refunded'] as const;
export const applicationStatuses = ['submitted', 'reviewing', 'shortlisted', 'interview', 'hired', 'declined', 'closed'] as const;
