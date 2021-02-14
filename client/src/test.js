import { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import "./App.css";
let peer = null;

function App() {
  const [incoming, setIncoming] = useState(null);
  const [outgoing, setOutgoing] = useState(null);
  const [msg, setMsg] = useState("");
  const [stream, setStream] = useState();
  const [screenCastStream, setScreenCastStream] = useState();
  // const userVideo = useRef();

  useEffect(() => {
    initWebRTC();
  }, []);

  const initWebRTC = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        setStream(stream);
        // if (userVideo.current) {
        //   userVideo.current.srcObject = stream;
        // }

        peer = new Peer({
          initiator: window.location.hash === "#admin",
          trickle: false,
          stream: stream,
        });

        peer.on("signal", (data) => {
          console.log(data);
          // when peer has signaling data, give it to peer2 somehow
          // peer2.signal(data)
          setOutgoing(data);
        });

        peer.on("connect", () => {
          // wait for 'connect' event before using the data channel
          // peer.send('hey peer2, how is it going?')
        });

        peer.on("data", (data) => {
          // got a data channel message
          console.log("got a message from peer2: " + data);
        });

        peer.on("stream", (stream) => {
          console.log("stream **** ", stream);
          // got remote video stream, now let's show it in a video tag
          var video = document.querySelector("video");

          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            video.src = window.URL.createObjectURL(stream); // for older browsers
          }

          video.play();
        });
      })
      .catch(() => {});
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setIncoming(e.target.value);
  };

  const handleSubmit = () => {
    peer.signal(JSON.parse(incoming));
  };

  const handleChangeMsg = (e) => {
    setMsg(e.target.value);
  };

  const sendMsg = () => {
    peer.send(`${msg}`);
  };

  const screenShare = () => {
    navigator.mediaDevices
      .getDisplayMedia({ cursor: true })
      .then((screenStream) => {
        peer.replaceTrack(
          stream.getVideoTracks()[0],
          screenStream.getVideoTracks()[0],
          stream
        );
        setScreenCastStream(screenStream);
        // userVideo.current.srcObject = screenStream;
        screenStream.getTracks()[0].onended = () => {
          peer.replaceTrack(
            screenStream.getVideoTracks()[0],
            stream.getVideoTracks()[0],
            stream
          );
          // userVideo.current.srcObject = stream;
        };
      });
  };

  const stopScreenShare = () => {
    screenCastStream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
    peer.replaceTrack(
      screenCastStream.getVideoTracks()[0],
      stream.getVideoTracks()[0],
      stream
    );
  };

  return (
    <div className="App">
      <video src="" controls></video>
      <input onChange={(e) => handleChange(e)} />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <br />
      <br />
      <br />
      <br />
      <input value={JSON.stringify(outgoing)} />

      <br />
      <br />
      <br />
      <br />
      <br />
      <input value={msg} onChange={(e) => handleChangeMsg(e)} />
      <button onClick={sendMsg}>Send</button>
      <button onClick={screenShare}>Share</button>
      <button onClick={stopScreenShare}>Stop Share</button>
    </div>
  );
}

export default App;
