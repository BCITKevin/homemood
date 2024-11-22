import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { rooms as roomTable, insertRoomsSchema } from "../db/schema/rooms";
import { roomFurniture as roomFurnitureTable } from "../db/schema/room_furniture";
import { furnitures as furnitureTable } from "../db/schema/furniture";
import { eq, desc, and } from "drizzle-orm";
import { createRoomSchema, createRoomFurnitureSch } from "../sharedTypes";

export const roomRoute = new Hono()
    .get('/getAllRooms', getUser, async (c) => {
        const user = c.var.user;

        const rooms = await db.select().from(roomTable).where(and(eq(roomTable.userId, user.id), eq(roomTable.isPrivate, false))).orderBy(desc(roomTable.createdAt)).limit(100);
        
        return c.json({ rooms: rooms });
    })
    .get('/', getUser, async (c) => {
        const publicRooms = await db
        .select({
            roomId: roomTable.id,
            roomTitle: roomTable.title,
            roomWidth: roomTable.width,
            roomHeight: roomTable.height,
            isPrivate: roomTable.isPrivate,
            createdAt: roomTable.createdAt,
            furnitureId: roomFurnitureTable.furnitureId,
            furnitureX: roomFurnitureTable.x,
            furnitureY: roomFurnitureTable.y,
            furnitureRotate: roomFurnitureTable.rotate,
            furnitureName: furnitureTable.name,
            furnitureImageUrl: furnitureTable.imageUrl,
        })
        .from(roomFurnitureTable)
        .innerJoin(roomTable, eq(roomFurnitureTable.roomId, roomTable.id))
        .innerJoin(furnitureTable, eq(roomFurnitureTable.furnitureId, furnitureTable.id))
        .where(eq(roomTable.isPrivate, false))
        .orderBy(desc(roomTable.createdAt));

        const groupedRooms = publicRooms.reduce((acc, row) => {
            const { roomId, roomTitle, roomWidth, roomHeight, isPrivate, createdAt, ...furniture } = row;

            // @ts-ignore
            if (!acc[roomId]) {
                // @ts-ignore
                acc[roomId] = {
                    roomId,
                    roomTitle,
                    roomWidth,
                    roomHeight,
                    isPrivate,
                    createdAt,
                    furnitures: []
                };
            }
            // @ts-ignore
            acc[roomId].furnitures.push(furniture);
            return acc;
        }, {});

        return c.json({ rooms: Object.values(groupedRooms) });
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
    .post('/room-roomFurniture', getUser, zValidator("json", createRoomFurnitureSch), async (c) => {
        const user = c.var.user;
    
        const roomFurniture = await c.req.valid("json");
    
        const data = await db
          .select({
            roomFurnitureId: roomFurnitureTable.id,
            roomId: roomFurnitureTable.roomId,
            furnitureId: roomFurnitureTable.furnitureId,
            x: roomFurnitureTable.x,
            y: roomFurnitureTable.y,
            key: roomFurnitureTable.key,
            rotate: roomFurnitureTable.rotate,
            furnitureName: furnitureTable.name,
            furnitureImageUrl: furnitureTable.imageUrl,
            roomTitle: roomTable.title,
            userId: roomTable.userId,
          })
          .from(roomFurnitureTable)
          .innerJoin(
            furnitureTable,
            eq(roomFurnitureTable.furnitureId, furnitureTable.id)
          )
          .innerJoin(roomTable, eq(roomFurnitureTable.roomId, roomTable.id))
          .where(
            and(
              eq(roomFurnitureTable.roomId, roomFurniture.roomId),
              eq(roomTable.userId, user.id)
            )
          );
    
        if (!data.length) {
          return c.json({ error: "No matching data found." }, 404);
        }
        return c.json({ data }, 200);
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