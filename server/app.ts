import { Hono } from 'hono'
import { logger } from 'hono/logger';
import { roomRoute } from './routes/rooms';

const app = new Hono()

app.use('*', logger());

app.get("/test", c => {
    return c.json({"message": "test"});
})

app.route("/api/rooms", roomRoute);

export default app