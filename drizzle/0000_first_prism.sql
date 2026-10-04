CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`service` text NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`preferred_date` text DEFAULT '' NOT NULL,
	`preferred_time` text DEFAULT '' NOT NULL,
	`timezone` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`resource_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`consent_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiries_email_created` ON `inquiries` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `inquiries_user_created` ON `inquiries` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `inquiries_created` ON `inquiries` (`created_at`);