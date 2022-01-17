import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import TextContainer from "./src/TextContainer.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = path.resolve();
const PORT = 3000;

const textContainer = new TextContainer();

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/public/index_test.html");
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.join("main-room");
  // 새로 접속 시 textContainer에 저장된 텍스트들 방출
  io.to(socket.id).emit("data-start", textContainer.textsJson);

  socket.on("data-voice", (obj) => {
    textContainer.addText(obj);
    io.to("main-room").emit("data-text", obj);
  });

  socket.on("forceDisconnect", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Socket IO server listening on port ${PORT}`);
});

function deleteOldestText(id) {
  io.to("main-room").emit("data-delete", id);
}

export { deleteOldestText };
