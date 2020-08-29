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

  socket.on("createRoomOrJoin", ({ roomId, userName }) => {
    console.log("create or join room ", roomId);
    const myRoom = io.sockets.adapter.rooms[roomId + ""];
    const numClients = myRoom ? myRoom.length : 0;
    console.log("room " + roomId + " has " + numClients + " connected clients");

    if (numClients === 0) {
      socket.join(roomId);
      console.log(socket.id);
      socket.emit("roomCreated");
    } else if (numClients >= 1 && numClients <= 2) {
      socket.join(roomId);
      console.log(myRoom);
      // To new Cleint
      socket.emit("roomJoined");
      // To host Only
      io.to(Object.keys(myRoom.sockets)[0]).emit("newUserJoinedRoom", {
        clientId: socket.id,
        clientName: userName,
      });
    } else {
      console.log(socket.adapter.rooms[roomId + ""]);
      socket.emit("roomFull", roomId);
    }
  });

  // establishing RTC connection in 4 steps and server works as msg farworder only
  socket.on("ready", (roomId) => {
    socket.broadcast.to(roomId).emit("ready");
  });

  socket.on("candidate", (event) => {
    socket.broadcast.to(event.roomId).emit("candidate", event);
  });

  socket.on("offer", (event) => {
    socket.broadcast.to(event.roomId).emit("offer", event.sdp);
  });

  socket.on("answer", (event) => {
    socket.broadcast.to(event.roomId).emit("answer", event.sdp);
  });

  socket.on("disconnect", (err) => {
    console.log("A user disconnected", err);
    console.log(socket);
    console.log(socket.adapter.rooms);
    if (socket.adapter.rooms) {
      console.log("sendin host a user left");
      io.to(Object.keys(socket.adapter.rooms)[0]).emit("AUserLeftRoom", {
        clientId: socket.id,
      });
    }
  });
});
