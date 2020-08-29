//(HOST) This code will be executed on HOST
//(CLIENT) This code will be executed on CLIENT

const divSelectRoom = document.getElementById("selectRoom");
const divConsultingRoom = document.getElementById("consultingRoom");
const inputRoomId = document.getElementById("roomId");
const inputUserName = document.getElementById("userName");
const btnGoRoom = document.getElementById("goRoom");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
// let h2CallName = document.getElementById("callName");
// let inputCallName = document.getElementById("inputCallName");
// let btnSetName = document.getElementById("setCallName");

let roomId, userName, localStream, dataChannel, sessionDescription;
const rtcPeerConnectionList = {};

const iceServer = null;

const streamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: false,
  },
  video: {
    width: 180,
    height: 180,
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
    roomId = inputRoomId.value;
    userName = inputUserName.value;
    socket.emit("createRoomOrJoin", { roomId, userName });
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

// (CLIENT) Joining room
socket.on("roomJoined", () => {
  console.log("joined to room " + roomId);
  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then((stream) => {
      console.log("Showing Camera Feed");
      localStream = stream;
      localVideo.srcObject = stream;
      // (CLIENT) Sending ready request
      console.log("Raising Ready event");
      socket.emit("ready", roomId);
    })
    .catch((error) => {
      console.log("An error occurred", error);
    });
});

// (CLIENT) Accepting Connection
socket.on("offer", (event) => {
  console.log("offer callback handled by CLIENT");
  // (CLIENT) Accepting RTC object provided by HOST

  rtcPeerConnection = new RTCPeerConnection(iceServer);
  console.log("New rtcPeerConnection created by CLIENT", event);

  rtcPeerConnection.onicecandidate = onIceCandidate;
  rtcPeerConnection.ontrack = onAddStream;

  console.log("adding localStream to rtcPeerConnection of CLIENT");
  rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
  rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);

  console.log(
    "setting up remoteDescription in rtcPeerConnection object of CLIENT"
  );
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
  // (CLIENT) Sending Acknowledgement to HOST

  console.log("Creating rtcPeerConnection Answer by CLIENT");
  rtcPeerConnection
    .createAnswer()
    .then((_sessionDescription) => {
      sessionDescription = _sessionDescription;
      console.log(
        "Setting up local description of rtcPeerConnection by CLIENT"
      );
      rtcPeerConnection.setLocalDescription(sessionDescription);

      console.log("Raising answer event by CLIENT");
      socket.emit("answer", {
        type: "answer",
        sdp: sessionDescription,
        roomId,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // (CLIENT) Checking And Accepting for any dataChannel created by HOST
  // console.log(rtcPeerConnection.ondatachannel);
  // rtcPeerConnection.ondatachannel = (event) => {
  //   console.log(event.channel);
  //   dataChannel = event.channel;
  //   dataChannel.onmessage = (event) => {
  //     h2CallName.innerText = event.data;
  //   };
  // };
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
  console.log("Runs on CLIENT");
  if (event.streams[0]) {
    remoteVideo.srcObject = event.streams[0];
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

// Event Rasied by server because room is full
socket.on("roomFull", (roomId) => {
  console.log("room " + roomId + " is full");
});
