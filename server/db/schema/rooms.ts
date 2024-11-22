import { pgTable, serial, varchar, text, numeric, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const rooms = pgTable('rooms', {
    id: serial('id').primaryKey(),
    title: text("title").notNull().notNull(),
    userId: text('user_id').notNull(),
    width: numeric("width", { precision: 3, scale: 2 }).notNull(),
    height: numeric("height", { precision: 3, scale: 2 }).notNull(),
    isPrivate: boolean("is_private").default(false),
    createdAt: timestamp("created_at").defaultNow(),
}, (rooms) => {
    return {
        userIndex: index('name_idx').on(rooms.userId),
    }
});

export const insertRoomsSchema = createInsertSchema(rooms, {
    title: z.string().min(2, {message: "Title must be at least 2 characters"}),
    width: z.string().regex(/^\d+(\.\d{1,2})?$/, {message: "The width must be postive"}),
    height: z.string().regex(/^\d+(\.\d{1,2})?$/, {message: "The height must be postive"}),
    isPrivate: z.boolean(),
})

export const selectRoomsSchema = createSelectSchema(rooms)