import { pgTable, serial, timestamp, integer } from 'drizzle-orm/pg-core';
import { rooms } from "./rooms";
import { furnitures } from "./furniture";

export const roomFurniture = pgTable("room_furniture", {
    id: serial("id").primaryKey(),
    roomId: integer("room_id")
      .notNull()
      .references(() => rooms.id),
    furnitureId: integer("furniture_id")
      .notNull()
      .references(() => furnitures.id),
    left: integer("left").notNull(),
    top: integer("top").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});