import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { furnitures } from "../db/schema/furniture";
import { rooms } from "../db/schema/rooms";
import { createRoomFurnitureSch } from "../sharedTypes";
import { insertFurnitureSchema } from "../db/schema/room_furniture";
import { and, eq, desc } from "drizzle-orm";

export const furnitureRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;

        const funitures = await db.select().from(furnitures);

        return c.json({ funitures: funitures });
    })