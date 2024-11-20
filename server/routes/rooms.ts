import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { rooms as roomTable, insertRoomsSchema } from "../db/schema/rooms";
import { eq, desc, and } from "drizzle-orm";
import { createRoomSchema } from "../sharedTypes";

export const roomRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;

        const rooms = await db.select().from(roomTable).where(and(eq(roomTable.userId, user.id), eq(roomTable.isPrivate, false))).orderBy(desc(roomTable.createdAt)).limit(100);
        
        return c.json({ rooms: rooms });
    })
    .post('/', getUser, zValidator("json", createRoomSchema), async (c) => {
        const room = await c.req.valid('json');
        const user = c.var.user;

        const validatedRooms = insertRoomsSchema.parse({
            ...room,
            userId: user.id
        });

        const result = await db.insert(roomTable).values(validatedRooms).returning().then((res) => res[0]);

        c.status(201) 
        return c.json(result);
    })
    .get('/room-amount', getUser, async (c) => {
        const user = c.var.user;
        const rooms = (await db.select().from(roomTable).where(eq(roomTable.isPrivate, false))).length;
        
        return c.json({ rooms });
    })
    .get('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const user = c.var.user;

        const room = await db.select().from(roomTable).where(and(eq(roomTable.userId, user.id), eq(roomTable.id, id))).then(res => res[0]);

        if (!room) {
            return c.notFound();
        }
        return c.json({ room });
    })
    .delete('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const user = c.var.user;

        const room = await db.delete(roomTable).where(and(eq(roomTable.userId, user.id), eq(roomTable.id, id))).returning().then(res => res[0]);

        if (!room) {
            return c.notFound();
        }

        return c.json({ room: room });
    })