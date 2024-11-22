import { insertRoomsSchema } from './db/schema/rooms';
import { insertFurnitureSchema } from './db/schema/room_furniture';
import { z } from 'zod';

export const createRoomSchema = insertRoomsSchema.omit({
    userId: true,
    createdAt: true,
    id: true,
});

export const createRoomFurnitureSch = insertFurnitureSchema.omit({
    id: true,
})

export type CreateRoom = z.infer<typeof createRoomSchema>;
export type CreateRoomFurniture = z.infer<typeof createRoomFurnitureSch>;