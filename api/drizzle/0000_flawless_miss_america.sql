CREATE TABLE `passwords` (
	`id` int,
	`hash` varchar(255) NOT NULL,
	`salt` varchar(16) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`image` varchar(255),
	`price` double NOT NULL,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL DEFAULT 'pending',
	`role` varchar(255) NOT NULL DEFAULT 'user',
	`firstName` varchar(255),
	`lastName` varchar(255),
	`phone` varchar(255),
	`address` varchar(255),
	`city` varchar(255),
	`state` varchar(255),
	`country` varchar(255),
	`zip` varchar(255),
	`image` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `passwords` ADD CONSTRAINT `passwords_id_users_id_fk` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;