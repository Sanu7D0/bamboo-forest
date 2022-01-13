import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import TextHole from "./src/TextHole.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = path.resolve();
const PORT = 3000;

/*const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);*/

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.join("main_room");

  socket.on("test-data", (obj) => {
    console.log(obj.str);
  });

  socket.on("forceDisconnect", () => {
    socket.disconnect();
    f;
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Socket IO server listening on port ${PORT}`);
});

function emitObjectsInfo(obj) {
  io.to("main_room").emit("data-objects", obj);
}

let th = new TextHole();
th.test();

export { emitObjectsInfo };
