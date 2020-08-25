//(HOST) This code will be executed on HOST
//(CLIENT) This code will be executed on CLIENT

let divSelectRoom = document.getElementById("selectRoom");
let divConsultingRoom = document.getElementById("consultingRoom");
let inputRoomNumber = document.getElementById("roomNumber");
let btnGoRoom = document.getElementById("goRoom");
let localVideo = document.getElementById("localVideo");
let remoteVideo = document.getElementById("remoteVideo");
let h2CallName = document.getElementById("callName");
let inputCallName = document.getElementById("inputCallName");
let btnSetName = document.getElementById("setCallName");

let roomNumber,
  localStream,
  remoteStream,
  rtcPeerConnection,
  isCaller,
  dataChannel;

const iceServer = {
  iceServer: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const streamConstraints = {
  audio: true,
  video: true,
};

const socket = io();

// Starting Call
btnGoRoom.onclick = () => {
  if (inputRoomNumber.value === "") {
    alert("Please enter room number");
  } else {
    console.log("Requesting to create or join room");
    roomNumber = inputRoomNumber.value;
    socket.emit("create or join", roomNumber);
    divSelectRoom.style = "display: 'none'";
    divConsultingRoom.style = "display: 'block'";
  }
};

// Sending Data
btnSetName.onclick = () => {
  if (inputCallName.value === "") {
    alert("Please enter call name");
  } else {
    h2CallName.innerText = inputCallName.value;
    console.log(dataChannel);
    dataChannel.send(inputCallName.value);
  }
};

// (HOST) Creating new room
socket.on("created", (room) => {
  console.log("New room created");
  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then((stream) => {
      console.log("Showing Camera Feed");
      localStream = stream;
      localVideo.srcObject = stream;
      isCaller = true;
    })
    .catch((error) => {
      console.log("An error occurred while opening your camera");
    });
});

// (CLIENT) Joining room
socket.on("joined", (room) => {
  console.log("joined to room " + room);
  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then((stream) => {
      console.log("Showing Camera Feed");
      localStream = stream;
      localVideo.srcObject = stream;
      socket.emit("ready", roomNumber);
    })
    .catch((error) => {
      console.log("An error occurred while opening your camera");
    });
});

// (HOST) sending ready request
socket.on("ready", (room) => {
  if (isCaller) {
    // (HOST) Creating new RTC Connection
    rtcPeerConnection = new RTCPeerConnection(iceServer);
    rtcPeerConnection.onicecandidate = onIceCandidate;
    rtcPeerConnection.ontrack = onAddStream;
    rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
    rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);

    // (HOST) Creating new Data stream
    dataChannel = rtcPeerConnection.createDataChannel(roomNumber);
    console.log(dataChannel);
    dataChannel.onmessage = (event) => {
      h2CallName.innerText = event.data;
    };

    // (HOST) Sending RTC Connection
    rtcPeerConnection
      .createOffer()
      .then((sessionDescription) => {
        console.log("sending offer ", sessionDescription);
        rtcPeerConnection.setLocalDescription(sessionDescription);
        socket.emit("offer", {
          type: "offer",
          sdp: sessionDescription,
          room: roomNumber,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// (CLIENT) Accepting Connection
socket.on("offer", (event) => {
  if (!isCaller) {
    // (CLIENT) Accepting RTC object provided by HOST
    rtcPeerConnection = new RTCPeerConnection(iceServer);
    rtcPeerConnection.onicecandidate = onIceCandidate;
    rtcPeerConnection.ontrack = onAddStream;
    rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
    rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
    console.log("recived offer ", event);
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
    // (CLIENT) Sending Acknowledgement to HOST
    rtcPeerConnection
      .createAnswer()
      .then((sessionDescription) => {
        console.log("send answer ", sessionDescription);
        rtcPeerConnection.setLocalDescription(sessionDescription);
        socket.emit("answer", {
          type: "answer",
          sdp: sessionDescription,
          room: roomNumber,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // (CLIENT) Checking And Accepting for any dataChannel created by HOST
    console.log(rtcPeerConnection.ondatachannel);
    rtcPeerConnection.ondatachannel = (event) => {
      console.log(event.channel);
      dataChannel = event.channel;
      dataChannel.onmessage = (event) => {
        h2CallName.innerText = event.data;
      };
    };
  }
});

// (HOST) Received Acknowledgement of CLIENT
socket.on("answer", (event) => {
  console.log("recived answer", event);
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
});

// (HOST) Host Accepting cleint as candidate send by CLIENT
socket.on("candidate", (event) => {
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  });
  console.log("recived candidate", candidate);
  rtcPeerConnection.addIceCandidate(candidate);
});

// (CLIENT) cleint sending it's data
function onAddStream(event) {
  remoteVideo.srcObject = event.streams[0];
  remoteStream = event.streams[0];
}

// (CLIENT) cleint requesing to HOST to add me as candidate
function onIceCandidate(event) {
  if (event.candidate) {
    console.log("sending ice candidate ", event.candidate);
    socket.emit("candidate", {
      type: "candidate",
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
      room: roomNumber,
    });
  }
}

// Event Rasied by server because room is full
socket.on("full", (room) => {
  console.log("room " + room + " is full");
});
