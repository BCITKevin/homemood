ALTER TABLE "room_furniture" RENAME COLUMN "left" TO "x";--> statement-breakpoint
ALTER TABLE "room_furniture" RENAME COLUMN "top" TO "y";--> statement-breakpoint
ALTER TABLE "room_furniture" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "room_furniture" ADD COLUMN "rotate" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "room_furniture" DROP COLUMN IF EXISTS "created_at";