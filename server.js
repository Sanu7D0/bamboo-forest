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

const textHole = new TextHole();

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/public/index_test.html");
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.join("main_room");

  socket.on("data-voice", (obj) => {
    onVoiceData(obj);
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

function onVoiceData(obj) {
  textHole.createTextObject(obj.data, 200, 100);
  textHole.runPhysics(3000); // run physics for 3 sec
}

export { emitObjectsInfo };
