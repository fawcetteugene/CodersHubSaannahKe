import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const inquiries = sqliteTable('inquiries', {
 id: text('id').primaryKey(), reference: text('reference').notNull(),
 userId: text('user_id'), type:text('type').notNull(), name:text('name').notNull(),
 email:text('email').notNull(), phone:text('phone').notNull().default(''),
 service:text('service').notNull(), budget:text('budget').notNull().default(''),
 preferredDate:text('preferred_date').notNull().default(''), preferredTime:text('preferred_time').notNull().default(''),
 timezone:text('timezone').notNull().default(''), message:text('message').notNull(),
 resourceUrl:text('resource_url').notNull().default(''), status:text('status').notNull().default('new'),
 consentAt:integer('consent_at').notNull(), createdAt:integer('created_at').notNull(),
}, table=>[index('inquiries_email_created').on(table.email,table.createdAt),index('inquiries_user_created').on(table.userId,table.createdAt),index('inquiries_created').on(table.createdAt)]);
