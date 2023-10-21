import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { configureServer } from "../../shared/socketServer";

const PORT = 3001;
const allowedOrigins = [
   "http://localhost",
   "http://localhost:3000",
   "https://beatline.vercel.app",
   "https://beatline.vercel.app/*",
   "https://beatline-dh2543-group-9.vercel.app",
   "https://beatline-dh2543-group-9.vercel.app/*",
 ]

const app = express();

app.use((req, res, next) => {
   res.on("finish", () => {
     const origin = req.headers.origin;
     console.log(`CORS rejected request from origin ${origin}, allowed origins are ${allowedOrigins}`);
   });
   next();
 });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// If you have other middleware or routes, set them up here:
// app.use(someMiddleware);
// app.get(someRoute, routeHandler);

configureServer(io); // Assuming your logic function accepts the io instance

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
