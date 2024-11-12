import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from 'zod';


const roomSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(2).max(30),
    username: z.string().min(3).max(17),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
})

type Room = z.infer<typeof roomSchema>

const createRoomSchema = roomSchema.omit({id: true});

const fakeRoom = [
    { id: 1, title: "Tattoo shop st", username: "Flora", width: 3, height: 4 },
    { id: 2, title: "just ordinary room", username: "Jin", width: 6, height: 5 },
    { id: 3, title: "Teenager room", username: "Kevin02", width: 5, height: 2 },
    { id: 3, title: "Luxury room", username: "Han", width: 7, height: 4 },
]

export const roomRoute = new Hono()
    .get('/', async (c) => {
        // await new Promise((r) => setTimeout(r, 10000));
        return c.json({ rooms: fakeRoom });
    })
    .post('/', zValidator("json", createRoomSchema), async (c) => {
        const room = await c.req.valid('json');
        fakeRoom.push({ ...room, id: fakeRoom.length + 1 });
        c.status(201) 
        return c.json(room);
    })
    .get('/room-amount', async (c) => {
        const rooms = fakeRoom.length;
        return c.json({ rooms });
    })
    .get('/:id{[0-9]+}', async (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const room = fakeRoom.find(room => room.id === id);

        if (!room) {
            return c.notFound();
        }
        return c.json({ room });
    })
    .delete('/:id{[0-9]+}', async (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const index = fakeRoom.findIndex(room => room.id === id);

        if (index === -1) {
            return c.notFound();
        }

        const deleteRoom = fakeRoom.splice(index, 1)[0];
        return c.json({ room: deleteRoom });
    })