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
  clients: [],
};
let hostDetails, userDetails, localStream, dataChannel;
const rtcPeerConnectionList = {};

const iceServer = null;

const streamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: false,
  },
  video: {
    width: 250,
    height: 250,
  },
};

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
};

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
  roomDetails.clients.push({
    clientId,
    clientName,
  });
  console.log("New Client details added ", roomDetails.clients);
});

socket.on("AUserLeftRoom", ({ clientId }) => {
  console.log("A user left room ", clientId);
  roomDetails.clients.forEach((client, index) => {
    if (client.clientId === clientId) {
      roomDetails.clients.splice(index, 1);
    }
  });
});

// (HOST) responding to ready request of CLIENT
socket.on("ready", () => {
  console.log("ready event callback handled by HOST");

  // (HOST) Creating new RTC Connection
  rtcPeerConnection = new RTCPeerConnection(iceServer);
  console.log("New rtcPeerConnection Created by HOST");

  rtcPeerConnection.onicecandidate = onIceCandidate;
  rtcPeerConnection.ontrack = onAddStream;

  console.log("Adding localStream Trackes to rtcPeerConnection of HOST");
  rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
  rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);

  // // (HOST) Creating new Data stream
  // dataChannel = rtcPeerConnection.createDataChannel(roomId);
  // console.log(dataChannel);
  // dataChannel.onmessage = (event) => {
  //   h2CallName.innerText = event.data;
  // };

  // (HOST) Sending RTC Connection
  console.log("rtcPeerConnection is creating new offer for CLIENT");
  rtcPeerConnection
    .createOffer(offerOptions)
    .then((_sessionDescription) => {
      sessionDescription = _sessionDescription;

      console.log("Setting rtcPeerConnection Local Description ");
      rtcPeerConnection.setLocalDescription(sessionDescription);
      console.log(
        "raising offer event and sending sessionDescription to CLIENT",
        sessionDescription
      );
      socket.emit("offer", {
        type: "offer",
        sdp: sessionDescription,
        roomId: roomDetails.roomId,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// (HOST) Received Acknowledgement of CLIENT
socket.on("answer", (event) => {
  console.log("answer callback handled by HOST", event);

  console.log(rtcPeerConnection);
  console.log(
    "Setting up remoteDescription in rtcPeerConnection of HOST which is "
  );
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
});

// (HOST & CLIENT) ICEAgent to CLIENT
socket.on("candidate", (event) => {
  console.log("handeling candidate callback");

  console.log(
    "Definig new candidate, data sent from candidate event of candidate"
  );
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  });

  console.log("adding newly defined candidate to rtcPeerConnection", candidate);
  rtcPeerConnection.addIceCandidate(candidate);
});

// (CLIENT & HOST) sending it's data
function onAddStream(event) {
  console.log("adding stream source to HTML video frame");
  console.log("Event and Stream source 0", event);
  if (event.streams[0]) {
    remoteVideo[0].srcObject = event.streams[0];
  }
}

// (CLIENT) cleint requesing to HOST to add me as candidate
function onIceCandidate(event) {
  console.log("Got and ice candidate");
  if (event.candidate) {
    console.log(
      "Sending ice candidate data in candidate event",
      event.candidate
    );
    socket.emit("candidate", {
      type: "candidate",
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
      roomId,
    });
  }
}
