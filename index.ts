import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

const app = express();
const http = createServer(app);

const io = new Server(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("offer", (offer, roomId) => {
    socket.broadcast.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.broadcast.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", (iceCandidate, roomId) => {
    socket.broadcast.to(roomId).emit("ice-candidate", iceCandidate);
  });
});

http.listen(3000, "0.0.0.0", () => {
  console.log("listening on *:3000");
});
