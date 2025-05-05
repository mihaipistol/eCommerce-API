CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`image` varchar(255),
	`price` double NOT NULL,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
