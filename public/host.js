//(HOST) This code will be executed on HOST
//(CLIENT) This code will be executed on CLIENT

const divSelectRoom = document.getElementById("selectRoom");
const divConsultingRoom = document.getElementById("consultingRoom");
const inputRoomId = document.getElementById("roomId");
const inputUserName = document.getElementById("userName");
const btnGoRoom = document.getElementById("goRoom");
const localVideo = document.getElementById("localVideo");
const remoteVideo = [
  document.getElementById("remoteVideo0"),
  document.getElementById("remoteVideo1"),
  document.getElementById("remoteVideo2"),
  document.getElementById("remoteVideo3"),
  document.getElementById("remoteVideo4"),
  document.getElementById("remoteVideo5"),
  document.getElementById("remoteVideo6"),
  document.getElementById("remoteVideo7"),
  document.getElementById("remoteVideo8"),
  document.getElementById("remoteVideo9"),
  document.getElementById("remoteVideo10"),
  document.getElementById("remoteVideo11"),
  document.getElementById("remoteVideo12"),
  document.getElementById("remoteVideo13"),
  document.getElementById("remoteVideo14"),
  document.getElementById("remoteVideo15"),
  document.getElementById("remoteVideo16"),
  document.getElementById("remoteVideo17"),
  document.getElementById("remoteVideo18"),
  document.getElementById("remoteVideo19"),
  document.getElementById("remoteVideo20"),
  document.getElementById("remoteVideo21"),
  document.getElementById("remoteVideo22"),
  document.getElementById("remoteVideo23"),
  document.getElementById("remoteVideo24"),
  document.getElementById("remoteVideo25"),
  document.getElementById("remoteVideo26"),
  document.getElementById("remoteVideo27"),
  document.getElementById("remoteVideo28"),
  document.getElementById("remoteVideo29"),
  document.getElementById("remoteVideo30"),
  document.getElementById("remoteVideo31"),
  document.getElementById("remoteVideo32"),
  document.getElementById("remoteVideo33"),
  document.getElementById("remoteVideo34"),
  document.getElementById("remoteVideo35"),
  document.getElementById("remoteVideo36"),
  document.getElementById("remoteVideo37"),
  document.getElementById("remoteVideo38"),
  document.getElementById("remoteVideo39"),
  document.getElementById("remoteVideo40"),
  document.getElementById("remoteVideo41"),
  document.getElementById("remoteVideo42"),
  document.getElementById("remoteVideo43"),
  document.getElementById("remoteVideo44"),
  document.getElementById("remoteVideo45"),
  document.getElementById("remoteVideo46"),
  document.getElementById("remoteVideo47"),
  document.getElementById("remoteVideo48"),
  document.getElementById("remoteVideo49"),
];
// let h2CallName = document.getElementById("callName");
// let inputCallName = document.getElementById("inputCallName");
// let btnSetName = document.getElementById("setCallName");

const roomDetails = {
  roomId: null,
  clients: {},
};
let hostDetails, localStream, dataChannel;

const iceServer = {
  iceServers: [
    {
      urls: ["stun:bn-turn1.xirsys.com"],
    },
    {
      username:
        "HrnKVNzJI5vzkGKcrUbwtjAksYq0bCqgBxiugQwS-Z_e_P_xmC1SRrIc3QFv-ThwAAAAAF9LNl8wMDBleGNlbA==",
      credential: "13c8499c-ea80-11ea-b26e-0242ac140004",
      urls: [
        "turn:bn-turn1.xirsys.com:80?transport=udp",
        "turn:bn-turn1.xirsys.com:3478?transport=udp",
        "turn:bn-turn1.xirsys.com:80?transport=tcp",
        "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        "turns:bn-turn1.xirsys.com:443?transport=tcp",
        "turns:bn-turn1.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
  iceTransportPolicy: "all",
};

const streamConstraints = {
  audio: {
    // echoCancellation: true,
    // noiseSuppression: true,
    // autoGainControl: false,
  },
  video: {
    width: 250,
    height: 250,
  },
};

// const offerOptions = {
//   offerToReceiveAudio: 1,
//   offerToReceiveVideo: 1,
// };

const socket = io();

// Starting Call
btnGoRoom.onclick = () => {
  if (inputRoomId.value === "" || inputUserName.value === "") {
    alert("Please enter both Room ID and Name");
  } else {
    console.log("Requesting to create or join room from Node server");
    roomDetails.roomId = inputRoomId.value;
    userName = inputUserName.value;
    socket.emit("createRoomOrJoin", { roomId: roomDetails.roomId, userName });
    divSelectRoom.style = "display: none";
    divConsultingRoom.style = "display: block";
  }
};

// Sending Data
// btnSetName.onclick = () => {
//   if (inputCallName.value === "") {
//     alert("Please enter call name");
//   } else {
//     h2CallName.innerText = inputCallName.value;
//     console.log(dataChannel);
//     dataChannel.send(inputCallName.value);
//   }
// };

// (HOST) Creating new room
socket.on("roomCreated", () => {
  console.log("New room created");
  hostDetails = { hostId: socket.id, hostName: inputUserName.value };
  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then((stream) => {
      console.log("Showing Camera Feed");
      console.log(stream);
      localStream = stream;
      localVideo.srcObject = stream;
      localVideo.volume = 0;
    })
    .catch((error) => {
      console.log("An error occurred while opening your camera");
    });
});

// (HOST) host finds its clients and manages
socket.on("newUserJoinedRoom", ({ clientId, clientName }) => {
  roomDetails.clients[clientId] = {
    clientId,
    clientName,
    rtcPeerConnection: null,
  };
  console.log("New Client details added ", roomDetails.clients);
});

socket.on("AUserLeftRoom", ({ clientId }) => {
  console.log("A user left room ", clientId);
  if (clientId in roomDetails.clients) {
    delete roomDetails.clients[clientId];
  }
});

// (HOST) responding to ready request of CLIENT
socket.on("ready", ({ roomId, clientId }) => {
  console.log(
    "ready event callback handled by HOST roomId " +
      roomId +
      " clientId " +
      clientId
  );

  // (HOST) Creating new RTC Connection
  roomDetails.clients[clientId].rtcPeerConnection = new RTCPeerConnection(
    iceServer
  );
  console.log("New rtcPeerConnection Created by HOST");

  roomDetails.clients[clientId].rtcPeerConnection.onicecandidate = (event) => {
    onIceCandidate(event, clientId);
  };
  roomDetails.clients[clientId].rtcPeerConnection.ontrack = (event) => {
    onAddStream(event, clientId);
  };

  console.log("Adding localStream Trackes to rtcPeerConnection of HOST");
  roomDetails.clients[clientId].rtcPeerConnection.addTrack(
    localStream.getTracks()[0],
    localStream
  );
  roomDetails.clients[clientId].rtcPeerConnection.addTrack(
    localStream.getTracks()[1],
    localStream
  );

  // // (HOST) Creating new Data stream
  // dataChannel = rtcPeerConnection.createDataChannel(roomId);
  // console.log(dataChannel);
  // dataChannel.onmessage = (event) => {
  //   h2CallName.innerText = event.data;
  // };

  // (HOST) Sending RTC Connection
  console.log("rtcPeerConnection is creating new offer for CLIENT");
  roomDetails.clients[clientId].rtcPeerConnection
    .createOffer(offerOptions)
    .then((_sessionDescription) => {
      sessionDescription = _sessionDescription;

      console.log("Setting rtcPeerConnection Local Description ");
      roomDetails.clients[clientId].rtcPeerConnection.setLocalDescription(
        sessionDescription
      );
      console.log(
        "raising offer event and sending sessionDescription to CLIENT",
        sessionDescription
      );
      socket.emit("offer", {
        type: "offer",
        sdp: sessionDescription,
        roomId: roomDetails.roomId,
        clientId,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// (HOST) Received Acknowledgement of CLIENT
socket.on("answer", (event) => {
  console.log("answer callback handled by HOST", event);

  console.log(roomDetails.clients[event.clientId].rtcPeerConnection);
  console.log(
    "Setting up remoteDescription in rtcPeerConnection of HOST which is "
  );
  roomDetails.clients[event.clientId].rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(event.sdp)
  );
});

// (HOST & CLIENT) ICEAgent to CLIENT
socket.on("ICEagentFromClient", (event) => {
  console.log("handeling candidate callback");

  console.log(
    "Definig new candidate, data sent from candidate event of candidate"
  );
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
    sdpMid: event.id,
  });

  console.log("adding newly defined candidate to rtcPeerConnection", candidate);
  roomDetails.clients[event.clientId].rtcPeerConnection.addIceCandidate(
    candidate
  );
});

// (CLIENT & HOST) sending it's data
function onAddStream(event, clientId) {
  console.log("adding stream source to HTML video frame");
  console.log("Event and Stream source 0", event);
  if (event.streams[0]) {
    remoteVideo[Object.keys(roomDetails.clients).indexOf(clientId)].srcObject =
      event.streams[0];
  }
}

// ICE agent candidate data sending to client
function onIceCandidate(event, clientId) {
  console.log("Got and ice candidate");
  if (event.candidate) {
    console.log("Sending ice candidate data to client", event.candidate);
    socket.emit("ICEagentFromHost", {
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
      roomId,
      clientId,
    });
  }
}
