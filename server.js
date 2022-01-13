const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const nsp_main = io.of("/main-namespace");
nsp_main.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

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
