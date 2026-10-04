import { env } from 'cloudflare:workers';
import { database } from '@/lib/database';
import { newId } from '@/lib/api';

const ALLOWED = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'text/markdown',
  'application/zip',
  'application/x-zip-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function bucket(): R2Bucket | null {
  return (env as Cloudflare.Env).BUCKET ?? null;
}

export function isAllowedUpload(contentType: string, filename: string) {
  if (ALLOWED.has(contentType)) return true;
  const lower = filename.toLowerCase();
  return ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.txt', '.md', '.zip', '.doc', '.docx'].some((ext) => lower.endsWith(ext));
}

export async function storeUpload(input: {
  file: File;
  userId?: string | null;
  email?: string;
  projectId?: string | null;
  inquiryId?: string | null;
  bookingId?: string | null;
  paymentId?: string | null;
  applicationId?: string | null;
}) {
  if (input.file.size <= 0) throw new Error('The selected file is empty.');
  if (input.file.size > MAX_UPLOAD_BYTES) throw new Error('Files must be 5 MB or smaller.');
  if (!isAllowedUpload(input.file.contentType || input.file.type, input.file.name)) {
    throw new Error('Allowed file types: PDF, PNG, JPG, WEBP, TXT, MD, ZIP, DOC, DOCX.');
  }

  const r2 = bucket();
  if (!r2) throw new Error('File storage is not configured yet. Share a cloud link instead, or try again later.');

  const id = newId();
  const safeName = input.file.name.replace(/[^\w.\- ()]/g, '_').slice(0, 120) || 'upload.bin';
  const storageKey = `uploads/${new Date().toISOString().slice(0, 10)}/${id}-${safeName}`;
  const bytes = await input.file.arrayBuffer();
  const contentType = input.file.type || 'application/octet-stream';

  await r2.put(storageKey, bytes, {
    httpMetadata: { contentType },
    customMetadata: { filename: safeName, email: input.email || '' },
  });

  const now = Date.now();
  await database()
    .prepare(
      `INSERT INTO project_files (id, project_id, inquiry_id, booking_id, payment_id, application_id, user_id, email, filename, content_type, size, storage_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.projectId ?? null,
      input.inquiryId ?? null,
      input.bookingId ?? null,
      input.paymentId ?? null,
      input.applicationId ?? null,
      input.userId ?? null,
      (input.email || '').toLowerCase(),
      safeName,
      contentType,
      input.file.size,
      storageKey,
      now,
    )
    .run();

  return { id, filename: safeName, contentType, size: input.file.size, storageKey };
}

export async function readUpload(fileId: string) {
  const row = await database()
    .prepare('SELECT * FROM project_files WHERE id = ?')
    .bind(fileId)
    .first<{
      id: string;
      email: string;
      user_id: string | null;
      filename: string;
      content_type: string;
      storage_key: string;
    }>();
  if (!row) return null;
  const r2 = bucket();
  if (!r2) return null;
  const object = await r2.get(row.storage_key);
  if (!object) return null;
  return { row, object };
}
