import { insertRoomsSchema } from './db/schema/rooms';
import { z } from 'zod';

export const createRoomSchema = insertRoomsSchema.omit({
    userId: true,
    createdAt: true,
    id: true,
});

export type CreateRoom = z.infer<typeof createRoomSchema>;