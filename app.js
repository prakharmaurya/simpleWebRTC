const express = require("express");
const app = express();
// const fs = require("fs");

// const options = {
//   key: fs.readFileSync("./cert/key.pem"),
//   cert: fs.readFileSync("./cert/cert.pem"),
// };

// let https = require("https").Server(options, app);
let http = require("http").Server(app);

// let io = require("socket.io")(https);
let io = require("socket.io")(http);

const port = process.env.PORT || 3000;

app.use(express.static("public"));

https.listen(port, () => {
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
    } else if (numClients >= 1 && numClients <= 49) {
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
  socket.on("ready", (event) => {
    console.log("ready called");
    // Sending to HOST only
    io.to(Object.keys(socket.adapter.rooms)[0]).emit("ready", event);
  });

  socket.on("ICEagentFromHost", (event) => {
    console.log("ICE agent data from ");
    io.to(event.roomId).to(event.clientId).emit("ICEagentFromHost", event);
  });

  socket.on("ICEagentFromClient", (event) => {
    console.log("ICE agent data from ");
    io.to(event.roomId)
      .to(Object.keys(socket.adapter.rooms)[0])
      .emit("ICEagentFromClient", event);
  });

  socket.on("offer", (event) => {
    console.log("ready offer");
    // Sending to Client
    io.to(event.clientId).emit("offer", event.sdp);
  });

  socket.on("answer", (event) => {
    console.log("ready answer");
    // Sending to Host only
    io.to(Object.keys(socket.adapter.rooms)[0]).emit("answer", event);
  });

  socket.on("disconnect", (err) => {
    console.log("A user disconnected", err);
    if (socket.adapter.rooms) {
      console.log("sending host a user left");
      io.to(Object.keys(socket.adapter.rooms)[0]).emit("AUserLeftRoom", {
        clientId: socket.id,
      });
    }
  });
});
