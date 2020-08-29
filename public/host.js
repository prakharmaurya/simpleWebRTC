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
const rtcPeerConnectionList = {};

const iceServer = {
  iceServer: [
    { url: "stun:stun.services.mozilla.org" },
    { url: "stun:stun01.sipphone.com" },
    { url: "stun:stun.ekiga.net" },
    { url: "stun:stun.fwdnet.net" },
    { url: "stun:stun.ideasip.com" },
    { url: "stun:stun.iptel.org" },
    { url: "stun:stun.rixtelecom.se" },
    { url: "stun:stun.schlund.de" },
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun1.l.google.com:19302" },
    { url: "stun:stun2.l.google.com:19302" },
    { url: "stun:stun3.l.google.com:19302" },
    { url: "stun:stun4.l.google.com:19302" },
    { url: "stun:stunserver.org" },
    { url: "stun:stun.softjoys.com" },
    { url: "stun:stun.voiparound.com" },
    { url: "stun:stun.voipbuster.com" },
    { url: "stun:stun.voipstunt.com" },
    { url: "stun:stun.voxgratia.org" },
    { url: "stun:stun.xten.com" },
    { url: "stun:stun.wtfismyip.com" },
    { url: "stun:stun.1und1.de" },
    { url: "stun:stun.gmx.net" },
    { url: "stun:stun.l.google.com:19305" },
    { url: "stun:stun1.l.google.com:19305" },
    { url: "stun:stun2.l.google.com:19305" },
    { url: "stun:stun3.l.google.com:19305" },
    { url: "stun:stun4.l.google.com:19305" },
    { url: "stun:stun.jappix.com:3478" },
    { url: "stun:stun.services.mozilla.com" },
    { url: "stun:stun.counterpath.com" },
    { url: "stun:stun.stunprotocol.prg" },
    { url: "stun:s1.taraba.net" },
    { url: "stun:s2.taraba.net" },
    { url: "stun:s1.voipstation.jp" },
    { url: "stun:s2.voipstation.jp" },
    { url: "stun:stun.sipnet.net:3478" },
    { url: "stun:stun.sipnet.ru:3478" },
    { url: "stun:stun.stunprotocol.org:3478" },
    { url: "stun:stun.1und1.de:3478" },
    { url: "stun:stun.gmx.net:3478" },
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun1.l.google.com:19302" },
    { url: "stun:stun2.l.google.com:19302" },
    { url: "stun:stun3.l.google.com:19302" },
    { url: "stun:stun4.l.google.com:19302" },
    { url: "stun:23.21.150.121:3478" },
    { url: "stun:iphone-stun.strato-iphone.de:3478" },
    { url: "stun:numb.viagenie.ca:3478" },
    { url: "stun:stun.12connect.com:3478" },
    { url: "stun:stun.12voip.com:3478" },
    { url: "stun:stun.1und1.de:3478" },
    { url: "stun:stun.2talk.co.nz:3478" },
    { url: "stun:stun.2talk.com:3478" },
    { url: "stun:stun.3clogic.com:3478" },
    { url: "stun:stun.3cx.com:3478" },
    { url: "stun:stun.a-mm.tv:3478" },
    { url: "stun:stun.aa.net.uk:3478" },
    { url: "stun:stun.acrobits.cz:3478" },
    { url: "stun:stun.actionvoip.com:3478" },
    { url: "stun:stun.advfn.com:3478" },
    { url: "stun:stun.aeta-audio.com:3478" },
    { url: "stun:stun.aeta.com:3478" },
    { url: "stun:stun.altar.com.pl:3478" },
    { url: "stun:stun.annatel.net:3478" },
    { url: "stun:stun.antisip.com:3478" },
    { url: "stun:stun.arbuz.ru:3478" },
    { url: "stun:stun.avigora.fr:3478" },
    { url: "stun:stun.awa-shima.com:3478" },
    { url: "stun:stun.b2b2c.ca:3478" },
    { url: "stun:stun.bahnhof.net:3478" },
    { url: "stun:stun.barracuda.com:3478" },
    { url: "stun:stun.bluesip.net:3478" },
    { url: "stun:stun.bmwgs.cz:3478" },
    { url: "stun:stun.botonakis.com:3478" },
    { url: "stun:stun.budgetsip.com:3478" },
    { url: "stun:stun.cablenet-as.net:3478" },
    { url: "stun:stun.callromania.ro:3478" },
    { url: "stun:stun.callwithus.com:3478" },
    { url: "stun:stun.chathelp.ru:3478" },
    { url: "stun:stun.cheapvoip.com:3478" },
    { url: "stun:stun.ciktel.com:3478" },
    { url: "stun:stun.cloopen.com:3478" },
    { url: "stun:stun.comfi.com:3478" },
    { url: "stun:stun.commpeak.com:3478" },
    { url: "stun:stun.comtube.com:3478" },
    { url: "stun:stun.comtube.ru:3478" },
    { url: "stun:stun.cope.es:3478" },
    { url: "stun:stun.counterpath.com:3478" },
    { url: "stun:stun.counterpath.net:3478" },
    { url: "stun:stun.datamanagement.it:3478" },
    { url: "stun:stun.dcalling.de:3478" },
    { url: "stun:stun.demos.ru:3478" },
    { url: "stun:stun.develz.org:3478" },
    { url: "stun:stun.dingaling.ca:3478" },
    { url: "stun:stun.doublerobotics.com:3478" },
    { url: "stun:stun.dus.net:3478" },
    { url: "stun:stun.easycall.pl:3478" },
    { url: "stun:stun.easyvoip.com:3478" },
    { url: "stun:stun.ekiga.net:3478" },
    { url: "stun:stun.epygi.com:3478" },
    { url: "stun:stun.etoilediese.fr:3478" },
    { url: "stun:stun.faktortel.com.au:3478" },
    { url: "stun:stun.freecall.com:3478" },
    { url: "stun:stun.freeswitch.org:3478" },
    { url: "stun:stun.freevoipdeal.com:3478" },
    { url: "stun:stun.gmx.de:3478" },
    { url: "stun:stun.gmx.net:3478" },
    { url: "stun:stun.gradwell.com:3478" },
    { url: "stun:stun.halonet.pl:3478" },
    { url: "stun:stun.hellonanu.com:3478" },
    { url: "stun:stun.hoiio.com:3478" },
    { url: "stun:stun.hosteurope.de:3478" },
    { url: "stun:stun.ideasip.com:3478" },
    { url: "stun:stun.infra.net:3478" },
    { url: "stun:stun.internetcalls.com:3478" },
    { url: "stun:stun.intervoip.com:3478" },
    { url: "stun:stun.ipcomms.net:3478" },
    { url: "stun:stun.ipfire.org:3478" },
    { url: "stun:stun.ippi.fr:3478" },
    { url: "stun:stun.ipshka.com:3478" },
    { url: "stun:stun.irian.at:3478" },
    { url: "stun:stun.it1.hr:3478" },
    { url: "stun:stun.ivao.aero:3478" },
    { url: "stun:stun.jumblo.com:3478" },
    { url: "stun:stun.justvoip.com:3478" },
    { url: "stun:stun.kanet.ru:3478" },
    { url: "stun:stun.kiwilink.co.nz:3478" },
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun.linea7.net:3478" },
    { url: "stun:stun.linphone.org:3478" },
    { url: "stun:stun.liveo.fr:3478" },
    { url: "stun:stun.lowratevoip.com:3478" },
    { url: "stun:stun.lugosoft.com:3478" },
    { url: "stun:stun.lundimatin.fr:3478" },
    { url: "stun:stun.magnet.ie:3478" },
    { url: "stun:stun.mgn.ru:3478" },
    { url: "stun:stun.mit.de:3478" },
    { url: "stun:stun.mitake.com.tw:3478" },
    { url: "stun:stun.miwifi.com:3478" },
    { url: "stun:stun.modulus.gr:3478" },
    { url: "stun:stun.myvoiptraffic.com:3478" },
    { url: "stun:stun.mywatson.it:3478" },
    { url: "stun:stun.nas.net:3478" },
    { url: "stun:stun.neotel.co.za:3478" },
    { url: "stun:stun.netappel.com:3478" },
    { url: "stun:stun.netgsm.com.tr:3478" },
    { url: "stun:stun.nfon.net:3478" },
    { url: "stun:stun.noblogs.org:3478" },
    { url: "stun:stun.noc.ams-ix.net:3478" },
    { url: "stun:stun.nonoh.net:3478" },
    { url: "stun:stun.nottingham.ac.uk:3478" },
    { url: "stun:stun.nova.is:3478" },
    { url: "stun:stun.on.net.mk:3478" },
    { url: "stun:stun.ooma.com:3478" },
    { url: "stun:stun.ooonet.ru:3478" },
    { url: "stun:stun.oriontelekom.rs:3478" },
    { url: "stun:stun.outland-net.de:3478" },
    { url: "stun:stun.ozekiphone.com:3478" },
    { url: "stun:stun.personal-voip.de:3478" },
    { url: "stun:stun.phone.com:3478" },
    { url: "stun:stun.pjsip.org:3478" },
    { url: "stun:stun.poivy.com:3478" },
    { url: "stun:stun.powerpbx.org:3478" },
    { url: "stun:stun.powervoip.com:3478" },
    { url: "stun:stun.ppdi.com:3478" },
    { url: "stun:stun.qq.com:3478" },
    { url: "stun:stun.rackco.com:3478" },
    { url: "stun:stun.rapidnet.de:3478" },
    { url: "stun:stun.rb-net.com:3478" },
    { url: "stun:stun.rixtelecom.se:3478" },
    { url: "stun:stun.rockenstein.de:3478" },
    { url: "stun:stun.rolmail.net:3478" },
    { url: "stun:stun.rynga.com:3478" },
    { url: "stun:stun.schlund.de:3478" },
    { url: "stun:stun.services.mozilla.com:3478" },
    { url: "stun:stun.sigmavoip.com:3478" },
    { url: "stun:stun.sip.us:3478" },
    { url: "stun:stun.sipdiscount.com:3478" },
    { url: "stun:stun.sipgate.net:10000" },
    { url: "stun:stun.sipgate.net:3478" },
    { url: "stun:stun.siplogin.de:3478" },
    { url: "stun:stun.sipnet.net:3478" },
    { url: "stun:stun.sipnet.ru:3478" },
    { url: "stun:stun.siportal.it:3478" },
    { url: "stun:stun.sippeer.dk:3478" },
    { url: "stun:stun.siptraffic.com:3478" },
    { url: "stun:stun.skylink.ru:3478" },
    { url: "stun:stun.sma.de:3478" },
    { url: "stun:stun.smartvoip.com:3478" },
    { url: "stun:stun.smsdiscount.com:3478" },
    { url: "stun:stun.snafu.de:3478" },
    { url: "stun:stun.softjoys.com:3478" },
    { url: "stun:stun.solcon.nl:3478" },
    { url: "stun:stun.solnet.ch:3478" },
    { url: "stun:stun.sonetel.com:3478" },
    { url: "stun:stun.sonetel.net:3478" },
    { url: "stun:stun.sovtest.ru:3478" },
    { url: "stun:stun.speedy.com.ar:3478" },
    { url: "stun:stun.spokn.com:3478" },
    { url: "stun:stun.srce.hr:3478" },
    { url: "stun:stun.ssl7.net:3478" },
    { url: "stun:stun.stunprotocol.org:3478" },
    { url: "stun:stun.symform.com:3478" },
    { url: "stun:stun.symplicity.com:3478" },
    { url: "stun:stun.t-online.de:3478" },
    { url: "stun:stun.tagan.ru:3478" },
    { url: "stun:stun.teachercreated.com:3478" },
    { url: "stun:stun.tel.lu:3478" },
    { url: "stun:stun.telbo.com:3478" },
    { url: "stun:stun.telefacil.com:3478" },
    { url: "stun:stun.tng.de:3478" },
    { url: "stun:stun.twt.it:3478" },
    { url: "stun:stun.u-blox.com:3478" },
    { url: "stun:stun.ucsb.edu:3478" },
    { url: "stun:stun.ucw.cz:3478" },
    { url: "stun:stun.uls.co.za:3478" },
    { url: "stun:stun.unseen.is:3478" },
    { url: "stun:stun.usfamily.net:3478" },
    { url: "stun:stun.veoh.com:3478" },
    { url: "stun:stun.vidyo.com:3478" },
    { url: "stun:stun.vipgroup.net:3478" },
    { url: "stun:stun.viva.gr:3478" },
    { url: "stun:stun.vivox.com:3478" },
    { url: "stun:stun.vline.com:3478" },
    { url: "stun:stun.vo.lu:3478" },
    { url: "stun:stun.vodafone.ro:3478" },
    { url: "stun:stun.voicetrading.com:3478" },
    { url: "stun:stun.voip.aebc.com:3478" },
    { url: "stun:stun.voip.blackberry.com:3478" },
    { url: "stun:stun.voip.eutelia.it:3478" },
    { url: "stun:stun.voiparound.com:3478" },
    { url: "stun:stun.voipblast.com:3478" },
    { url: "stun:stun.voipbuster.com:3478" },
    { url: "stun:stun.voipbusterpro.com:3478" },
    { url: "stun:stun.voipcheap.co.uk:3478" },
    { url: "stun:stun.voipcheap.com:3478" },
    { url: "stun:stun.voipfibre.com:3478" },
    { url: "stun:stun.voipgain.com:3478" },
    { url: "stun:stun.voipgate.com:3478" },
    { url: "stun:stun.voipinfocenter.com:3478" },
    { url: "stun:stun.voipplanet.nl:3478" },
    { url: "stun:stun.voippro.com:3478" },
    { url: "stun:stun.voipraider.com:3478" },
    { url: "stun:stun.voipstunt.com:3478" },
    { url: "stun:stun.voipwise.com:3478" },
    { url: "stun:stun.voipzoom.com:3478" },
    { url: "stun:stun.vopium.com:3478" },
    { url: "stun:stun.voxox.com:3478" },
    { url: "stun:stun.voys.nl:3478" },
    { url: "stun:stun.voztele.com:3478" },
    { url: "stun:stun.vyke.com:3478" },
    { url: "stun:stun.webcalldirect.com:3478" },
    { url: "stun:stun.whoi.edu:3478" },
    { url: "stun:stun.wifirst.net:3478" },
    { url: "stun:stun.wwdl.net:3478" },
    { url: "stun:stun.xs4all.nl:3478" },
    { url: "stun:stun.xtratelecom.es:3478" },
    { url: "stun:stun.yesss.at:3478" },
    { url: "stun:stun.zadarma.com:3478" },
    { url: "stun:stun.zadv.com:3478" },
    { url: "stun:stun.zoiper.com:3478" },
    { url: "stun:stun1.faktortel.com.au:3478" },
    { url: "stun:stun1.l.google.com:19302" },
    { url: "stun:stun1.voiceeclipse.net:3478" },
    { url: "stun:stun2.l.google.com:19302" },
    { url: "stun:stun3.l.google.com:19302" },
    { url: "stun:stun4.l.google.com:19302" },
    { url: "stun:stunserver.org:3478" },
    {
      url: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      url: "turn:192.158.29.39:3478?transport=udp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      url: "turn:192.158.29.39:3478?transport=tcp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
  ],
  iceTransportPolicy: "all",
};

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
