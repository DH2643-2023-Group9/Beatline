import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { configureServer } from '../../shared/socketServer';

const PORT = 3001;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
       origin: ["http://localhost", "http://localhost:3000", "https://beatline.vercel.app/"],
       methods: ["GET", "POST"]
    }
 });

// If you have other middleware or routes, set them up here:
// app.use(someMiddleware);
// app.get(someRoute, routeHandler);

configureServer(io);  // Assuming your logic function accepts the io instance

httpServer.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});
