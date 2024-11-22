import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { rooms } from "./rooms";
import { furnitures } from "./furniture";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const roomFurniture = pgTable("room_furniture", {
    id: serial("id").primaryKey(),
    roomId: integer("room_id")
      .notNull()
      .references(() => rooms.id),
    furnitureId: integer("furniture_id")
      .notNull()
      .references(() => furnitures.id),
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    key: text('key').notNull(),
    rotate: integer('rotate').notNull(),
});

export const insertFurnitureSchema = createInsertSchema(roomFurniture, {
  furnitureId: z.number(),
  x: z.number(),
  y: z.number(),
  key: z.string(),
  rotate: z.number(),
  roomId: z.number(),
})