const express = require("express");
const app = express();
let http = require("http").Server(app);

let io = require("socket.io")(http);

const port = process.env.PORT || 3000;

app.use(express.static("public"));

http.listen(port, () => {
  console.log("listening on port " + port);
});

io.on("connection", (socket) => {
  console.log("A User Connected");

  socket.on("create or join", (room) => {
    console.log("create or join room " + room);
    const myRoom = io.sockets.adapter.rooms[room] || { length: 0 };

    const numClients = myRoom.length;
    console.log(room + " has " + numClients + " connected clients");

    if (numClients === 0) {
      socket.join(room);
      socket.emit("created", room);
    } else if (numClients === 1) {
      socket.join(room);
      socket.emit("joined", room);
    } else {
      socket.emit("full", room);
    }
  });

  // establishing RTC connection in 4 steps and server works as msg farworder only
  socket.on("ready", (room) => {
    socket.broadcast.to(room).emit("ready");
  });

  socket.on("candidate", (event) => {
    socket.broadcast.to(event.room).emit("candidate", event);
  });

  socket.on("offer", (event) => {
    socket.broadcast.to(event.room).emit("offer", event.sdp);
  });

  socket.on("answer", (event) => {
    socket.broadcast.to(event.room).emit("answer", event.sdp);
  });
});
