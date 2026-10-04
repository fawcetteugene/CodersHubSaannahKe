import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(),
  reference: text('reference').notNull(),
  userId: text('user_id'),
  type: text('type').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull().default(''),
  service: text('service').notNull(),
  budget: text('budget').notNull().default(''),
  preferredDate: text('preferred_date').notNull().default(''),
  preferredTime: text('preferred_time').notNull().default(''),
  timezone: text('timezone').notNull().default(''),
  message: text('message').notNull(),
  resourceUrl: text('resource_url').notNull().default(''),
  attachmentIds: text('attachment_ids').notNull().default(''),
  status: text('status').notNull().default('new'),
  consentAt: integer('consent_at').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => [
  index('inquiries_email_created').on(table.email, table.createdAt),
  index('inquiries_user_created').on(table.userId, table.createdAt),
  index('inquiries_created').on(table.createdAt),
]);

export const customerProjects = sqliteTable('customer_projects', {
  id: text('id').primaryKey(),
  reference: text('reference').notNull(),
  inquiryId: text('inquiry_id'),
  userId: text('user_id'),
  email: text('email').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull().default('submitted'),
  progress: integer('progress').notNull().default(0),
  dueDate: text('due_date').notNull().default(''),
  assignedExpert: text('assigned_expert').notNull().default(''),
  notes: text('notes').notNull().default(''),
  quoteAmount: text('quote_amount').notNull().default(''),
  currency: text('currency').notNull().default('KES'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
}, (table) => [
  index('projects_email_created').on(table.email, table.createdAt),
  index('projects_user_created').on(table.userId, table.createdAt),
]);

export const projectMessages = sqliteTable('project_messages', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  userId: text('user_id'),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => [index('messages_project_created').on(table.projectId, table.createdAt)]);

export const projectRevisions = sqliteTable('project_revisions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  userId: text('user_id'),
  reason: text('reason').notNull(),
  details: text('details').notNull(),
  status: text('status').notNull().default('submitted'),
  createdAt: integer('created_at').notNull(),
  resolvedAt: integer('resolved_at'),
}, (table) => [index('revisions_project_created').on(table.projectId, table.createdAt)]);

export const projectFiles = sqliteTable('project_files', {
  id: text('id').primaryKey(),
  projectId: text('project_id'),
  inquiryId: text('inquiry_id'),
  bookingId: text('booking_id'),
  paymentId: text('payment_id'),
  applicationId: text('application_id'),
  userId: text('user_id'),
  email: text('email').notNull().default(''),
  filename: text('filename').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  storageKey: text('storage_key').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => [index('files_project').on(table.projectId), index('files_created').on(table.createdAt)]);

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  reference: text('reference').notNull(),
  serviceSlug: text('service_slug').notNull(),
  serviceTitle: text('service_title').notNull(),
  userId: text('user_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull().default(''),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  timezone: text('timezone').notNull(),
  status: text('status').notNull().default('requested'),
  paymentStatus: text('payment_status').notNull().default('unpaid'),
  notes: text('notes').notNull().default(''),
  meetingUrl: text('meeting_url').notNull().default(''),
  createdAt: integer('created_at').notNull(),
  cancelledAt: integer('cancelled_at'),
}, (table) => [
  index('bookings_date_time').on(table.date, table.startTime),
  index('bookings_email_created').on(table.email, table.createdAt),
]);

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  reference: text('reference').notNull(),
  projectId: text('project_id'),
  bookingId: text('booking_id'),
  userId: text('user_id'),
  email: text('email').notNull(),
  amount: text('amount').notNull(),
  currency: text('currency').notNull().default('KES'),
  kind: text('kind').notNull(),
  method: text('method').notNull().default('mpesa'),
  status: text('status').notNull().default('pending'),
  instructions: text('instructions').notNull().default(''),
  proofCode: text('proof_code').notNull().default(''),
  proofFileId: text('proof_file_id'),
  createdAt: integer('created_at').notNull(),
  confirmedAt: integer('confirmed_at'),
}, (table) => [index('payments_email_created').on(table.email, table.createdAt)]);

export const jobApplications = sqliteTable('job_applications', {
  id: text('id').primaryKey(),
  reference: text('reference').notNull(),
  jobSlug: text('job_slug').notNull(),
  jobTitle: text('job_title').notNull(),
  userId: text('user_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull().default(''),
  location: text('location').notNull().default(''),
  linkedin: text('linkedin').notNull().default(''),
  github: text('github').notNull().default(''),
  coverLetter: text('cover_letter').notNull(),
  resumeFileId: text('resume_file_id'),
  availability: text('availability').notNull().default(''),
  rate: text('rate').notNull().default(''),
  status: text('status').notNull().default('submitted'),
  notes: text('notes').notNull().default(''),
  createdAt: integer('created_at').notNull(),
}, (table) => [index('applications_job_created').on(table.jobSlug, table.createdAt)]);

export const groupPosts = sqliteTable('group_posts', {
  id: text('id').primaryKey(),
  groupSlug: text('group_slug').notNull(),
  userId: text('user_id').notNull(),
  authorName: text('author_name').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => [index('group_posts_slug_created').on(table.groupSlug, table.createdAt)]);

export const groupComments = sqliteTable('group_comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull(),
  userId: text('user_id').notNull(),
  authorName: text('author_name').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => [index('group_comments_post_created').on(table.postId, table.createdAt)]);

export const cmsEntries = sqliteTable('cms_entries', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  meta: text('meta').notNull().default(''),
  updatedBy: text('updated_by').notNull().default(''),
  updatedAt: integer('updated_at').notNull(),
  localMarket: integer('local_market').notNull().default(0),
  currency: text('currency').notNull().default('KES'),
  mpesaEnabled: integer('mpesa_enabled').notNull().default(0),
  whatsappEnabled: integer('whatsapp_enabled').notNull().default(0),
  serviceLocation: text('service_location').notNull().default('remote'),
  county: text('county'),
  onSiteAvailable: integer('on_site_available').notNull().default(0),
  remoteAvailable: integer('remote_available').notNull().default(1),
  localPrice: text('local_price'),
  packageType: text('package_type'),
}, (table) => [index('cms_kind_slug').on(table.kind, table.slug)]);
