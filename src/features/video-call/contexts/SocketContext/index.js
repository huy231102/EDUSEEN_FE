import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
const socket = io(serverUrl);

const peerConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [callPartnerId, setCallPartnerId] = useState('');
  const [subtitles, setSubtitles] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const callAcceptedCallback = useRef();
  const socketAIRef = useRef(null);

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setCall({});
    setPartnerName('');

    if (callPartnerId) {
      socket.emit('hangup', { to: callPartnerId });
    }

    callAcceptedCallback.current = null;

    setCallPartnerId('');

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        // console.error('Error getting media devices.', err);
        // alert('You denied access to your camera and microphone. Please allow access to use the video chat.');
      });

    socket.on('me', (id) => {
      // console.log('Socket event "me" received with id:', id);
      setMe(id);
    });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on('callAccepted', (data) => {
      if (callAcceptedCallback.current) {
        callAcceptedCallback.current(data);
      }
    });

    socket.on('callEnded', () => {
      leaveCall();
    });

    socket.on('iceCandidateReceived', ({ candidate }) => {
      if (connectionRef.current) {
        connectionRef.current.signal({ candidate });
      }
    });
  }, []);

  useEffect(() => {
    socketAIRef.current = new WebSocket('ws://localhost:8001/ws/translate');

    socketAIRef.current.onopen = () => {
      // console.log('AI WebSocket connection established');
    };

    socketAIRef.current.onmessage = (event) => {
      setSubtitles(event.data);
    };

    socketAIRef.current.onerror = (error) => {
      // console.error('AI WebSocket error:', error);
      setSubtitles('AI Server Connection Error');
    };

    socketAIRef.current.onclose = () => {
      // console.log('AI WebSocket connection closed');
    };

    return () => {
      if (socketAIRef.current) {
        socketAIRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    let frameSender;

    if (stream) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      frameSender = setInterval(() => {
        if (myVideo.current && myVideo.current.readyState === 4 && socketAIRef.current && socketAIRef.current.readyState === WebSocket.OPEN) {
          canvas.width = myVideo.current.videoWidth;
          canvas.height = myVideo.current.videoHeight;
          
          if (canvas.width > 0 && canvas.height > 0) {
            context.drawImage(myVideo.current, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg', 0.5); 
            socketAIRef.current.send(imageData);
          }
        }
      }, 500);
    }

    return () => {
      if (frameSender) {
        clearInterval(frameSender);
      }
    };
  }, [stream]);

  const answerCall = () => {
    setCallAccepted(true);
    setCallEnded(false);
    setPartnerName(call.name);
    setCallPartnerId(call.from);

    const peer = new Peer({ initiator: false, trickle: true, stream, config: peerConfig });

    peer.on('signal', (data) => {
      if (data.type === 'answer') {
        socket.emit('answerCall', { signal: data, to: call.from, name });
      } else if (data.candidate) {
        socket.emit('sendIceCandidate', { to: call.from, candidate: data });
      }
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id, currentUserName) => {
    const peer = new Peer({ initiator: true, trickle: true, stream, config: peerConfig });
    setCallEnded(false);
    setCallPartnerId(id);

    peer.on('signal', (data) => {
      if (data.type === 'offer') {
        socket.emit('callUser', { userToCall: id, signalData: data, from: me, name: currentUserName });
      } else if (data.candidate) {
        socket.emit('sendIceCandidate', { to: id, candidate: data });
      }
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    callAcceptedCallback.current = (data) => {
      setCallAccepted(true);
      setPartnerName(data.name);
      peer.signal(data.signal);
      callAcceptedCallback.current = null;
    };

    connectionRef.current = peer;
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      partnerName,
      subtitles,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext }; 