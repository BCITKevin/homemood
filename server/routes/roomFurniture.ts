import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { roomFurniture as furnitureTable } from "../db/schema/room_furniture";
import { rooms } from "../db/schema/rooms";
import { createRoomFurnitureSch } from "../sharedTypes";
import { insertFurnitureSchema } from "../db/schema/room_furniture";
import { and, eq, desc } from "drizzle-orm";

export const roomFurnitureRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;

        const furnitures = await db
            .select({
                roomId: furnitureTable.roomId,
                furnitureId: furnitureTable.furnitureId,
                x: furnitureTable.x,
                y: furnitureTable.y,
                key: furnitureTable.key,
                rotate: furnitureTable.rotate,
            })
            .from(furnitureTable)
            .innerJoin(rooms, eq(furnitureTable.roomId, rooms.id))
            .where(
                and(
                eq(rooms.userId, user.id),
                eq(rooms.isPrivate, false)
                )
            )
            .orderBy(desc(rooms.createdAt))
            .limit(100);
        
        return c.json({ furniture: furnitures });
    })
    .post('/', getUser, zValidator("json", createRoomFurnitureSch), async (c) => {
        const data = await c.req.valid('json');
        const user = c.var.user;

        const validateRoomFurniture = insertFurnitureSchema.parse({
            ...data,
            userId: user.id,
        })

        const result = await db.insert(furnitureTable).values(validateRoomFurniture).returning().then((res) => res[0]);

        c.status(201);
        return c.json(result);
    })