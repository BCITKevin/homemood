import { Hono } from 'hono'
import { logger } from 'hono/logger';
import { roomRoute } from './routes/rooms';
import { authRoute } from './routes/auth';

const app = new Hono()

app.use('*', logger());

app.get("/test", c => {
    return c.json({"message": "test"});
})

const apiRoutes = app.basePath("/api").route("/rooms", roomRoute).route('/', authRoute);

export default app
export type ApiRoutes = typeof apiRoutes;