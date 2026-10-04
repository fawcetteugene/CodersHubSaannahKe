ALTER TABLE `inquiries` ADD COLUMN `attachment_ids` text DEFAULT '' NOT NULL;
--> statement-breakpoint
CREATE TABLE `customer_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`inquiry_id` text,
	`user_id` text,
	`email` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`due_date` text DEFAULT '' NOT NULL,
	`assigned_expert` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`quote_amount` text DEFAULT '' NOT NULL,
	`currency` text DEFAULT 'KES' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `projects_email_created` ON `customer_projects` (`email`,`created_at`);
--> statement-breakpoint
CREATE INDEX `projects_user_created` ON `customer_projects` (`user_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `project_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text,
	`author_name` text NOT NULL,
	`author_role` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `messages_project_created` ON `project_messages` (`project_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `project_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text,
	`reason` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`created_at` integer NOT NULL,
	`resolved_at` integer
);
--> statement-breakpoint
CREATE INDEX `revisions_project_created` ON `project_revisions` (`project_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `project_files` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`inquiry_id` text,
	`booking_id` text,
	`payment_id` text,
	`application_id` text,
	`user_id` text,
	`email` text DEFAULT '' NOT NULL,
	`filename` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`storage_key` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `files_project` ON `project_files` (`project_id`);
--> statement-breakpoint
CREATE INDEX `files_created` ON `project_files` (`created_at`);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`service_slug` text NOT NULL,
	`service_title` text NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`date` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`timezone` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`meeting_url` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`cancelled_at` integer
);
--> statement-breakpoint
CREATE INDEX `bookings_date_time` ON `bookings` (`date`,`start_time`);
--> statement-breakpoint
CREATE INDEX `bookings_email_created` ON `bookings` (`email`,`created_at`);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`project_id` text,
	`booking_id` text,
	`user_id` text,
	`email` text NOT NULL,
	`amount` text NOT NULL,
	`currency` text DEFAULT 'KES' NOT NULL,
	`kind` text NOT NULL,
	`method` text DEFAULT 'mpesa' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`instructions` text DEFAULT '' NOT NULL,
	`proof_code` text DEFAULT '' NOT NULL,
	`proof_file_id` text,
	`created_at` integer NOT NULL,
	`confirmed_at` integer
);
--> statement-breakpoint
CREATE INDEX `payments_email_created` ON `payments` (`email`,`created_at`);
--> statement-breakpoint
CREATE TABLE `job_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`job_slug` text NOT NULL,
	`job_title` text NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`linkedin` text DEFAULT '' NOT NULL,
	`github` text DEFAULT '' NOT NULL,
	`cover_letter` text NOT NULL,
	`resume_file_id` text,
	`availability` text DEFAULT '' NOT NULL,
	`rate` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `applications_job_created` ON `job_applications` (`job_slug`,`created_at`);
--> statement-breakpoint
CREATE TABLE `group_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`group_slug` text NOT NULL,
	`user_id` text NOT NULL,
	`author_name` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `group_posts_slug_created` ON `group_posts` (`group_slug`,`created_at`);
--> statement-breakpoint
CREATE TABLE `group_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`author_name` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `group_comments_post_created` ON `group_comments` (`post_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `cms_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`meta` text DEFAULT '' NOT NULL,
	`updated_by` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `cms_kind_slug` ON `cms_entries` (`kind`,`slug`);
