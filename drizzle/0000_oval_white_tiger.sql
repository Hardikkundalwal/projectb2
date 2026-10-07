CREATE TABLE `ai_feedback_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`node_id` text NOT NULL,
	`model` text NOT NULL,
	`prompt_version` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `assessment_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`module` text,
	`score` real,
	`status` text DEFAULT 'started' NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
CREATE TABLE `attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_attempt_id` text NOT NULL,
	`user_id` text NOT NULL,
	`node_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`answer_index` integer NOT NULL,
	`correct` integer NOT NULL,
	`score` real NOT NULL,
	`is_transfer` integer DEFAULT false NOT NULL,
	`error_code` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attempt_client_id_unique` ON `attempts` (`client_attempt_id`);--> statement-breakpoint
CREATE INDEX `attempt_user_node_idx` ON `attempts` (`user_id`,`node_id`);--> statement-breakpoint
CREATE TABLE `mastery` (
	`user_id` text NOT NULL,
	`node_id` text NOT NULL,
	`state` text DEFAULT 'unseen' NOT NULL,
	`score` real DEFAULT 0 NOT NULL,
	`observations` integer DEFAULT 0 NOT NULL,
	`transfer_seen` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `node_id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text,
	`display_name` text DEFAULT 'Lokales Profil' NOT NULL,
	`content_version` text NOT NULL,
	`english_help` integer DEFAULT true NOT NULL,
	`ai_writing_enabled` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `review_queue` (
	`user_id` text NOT NULL,
	`node_id` text NOT NULL,
	`interval_step` integer DEFAULT 0 NOT NULL,
	`due_at` text NOT NULL,
	`reason` text DEFAULT 'practice' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `node_id`)
);
--> statement-breakpoint
CREATE INDEX `review_due_idx` ON `review_queue` (`user_id`,`due_at`);--> statement-breakpoint
CREATE TABLE `rubric_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text,
	`node_id` text NOT NULL,
	`task_fulfilment` integer NOT NULL,
	`organisation` integer NOT NULL,
	`vocabulary` integer NOT NULL,
	`grammar` integer NOT NULL,
	`register_score` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
