import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from 'zod';


const roomSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(2).max(30),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
})

type Room = z.infer<typeof roomSchema>

const createRoomSchema = roomSchema.omit({id: true});

const fakeRoom = [
    { id: 1, title: "something", width: 3, height: 4},
    { id: 2, title: "something1", width: 6, height: 5},
    { id: 3, title: "something2", width: 5, height: 2},

]

export const roomRoute = new Hono()
    .get('/', (c) => {
        return c.json({ rooms: [] });
    })
    .post('/', zValidator("json", createRoomSchema), async (c) => {
        const room = await c.req.valid('json');
        fakeRoom.push({ ...room, id: fakeRoom.length + 1 });
        c.status(201) 
        return c.json(room);
    })
    .get('/:id{[0-9]+}', (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const room = fakeRoom.find(room => room.id === id);

        if (!room) {
            return c.notFound();
        }
        return c.json({ room });
    })
    .delete('/:id{[0-9]+}', (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const index = fakeRoom.findIndex(room => room.id === id);

        if (index === -1) {
            return c.notFound();
        }

        const deleteRoom = fakeRoom.splice(index, 1)[0];
        return c.json({ room: deleteRoom });
    })