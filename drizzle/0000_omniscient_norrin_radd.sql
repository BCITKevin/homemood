CREATE TABLE IF NOT EXISTS "furnitures" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_furniture" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"furniture_id" integer NOT NULL,
	"left" integer NOT NULL,
	"top" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"user_id" text NOT NULL,
	"width" numeric(3, 2) NOT NULL,
	"height" numeric(3, 2) NOT NULL,
	"is_private" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_furniture" ADD CONSTRAINT "room_furniture_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_furniture" ADD CONSTRAINT "room_furniture_furniture_id_furnitures_id_fk" FOREIGN KEY ("furniture_id") REFERENCES "public"."furnitures"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "rooms" USING btree ("user_id");