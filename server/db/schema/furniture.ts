import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const furnitures = pgTable("furnitures", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
});