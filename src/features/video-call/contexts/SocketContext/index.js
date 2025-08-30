import React, { createContext, useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

// Khởi tạo Context
export const SocketContext = createContext();

// Xác định protocol và host cho Socket.IO (HTTPS/WSS hoặc HTTP/WS)
const defaultProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socketHost = process.env.REACT_APP_SOCKET_HOST || window.location.hostname;
const socketPort = process.env.REACT_APP_SOCKET_PORT || '5000';
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || `${defaultProtocol}://${socketHost}:${socketPort}`;
console.log(`SocketContext: connecting to Socket.IO at ${SOCKET_SERVER_URL}`);

export const ContextProvider = ({ children }) => {
  // State
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [me, setMe] = useState('');
  const [name, setName] = useState('');
  const [stream, setStream] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState({});
  const [partnerName, setPartnerName] = useState('');
  const [subtitles, setSubtitles] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // Khởi tạo socket khi cần
  const initializeSocket = () => {
    if (!socket) {
      const newSocket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsSocketConnected(true);
        setMe(newSocket.id);
      });

      newSocket.on('disconnect', () => {
        setIsSocketConnected(false);
      });

      // Lắng nghe sự kiện cuộc gọi đến
      newSocket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }
  };

  // Thêm hàm ngắt kết nối WebSocket/Socket.IO
  const cleanupSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsSocketConnected(false);
    }
  };

  // Yêu cầu quyền truy cập camera + mic
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error('getUserMedia error:', err));
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    // Ở đây bạn có thể thêm logic peer connection
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.close();
    window.location.reload();
  };

  const callUser = (id, callerName) => {
    if (!socket) initializeSocket();
    if (!socket) return;

    setPartnerName(callerName);
    // Gửi sự kiện gọi tới người nhận
    socket.emit('callUser', { userToCall: id, signalData: {}, from: socket.id, name: callerName });
  };

  // Tự động kết nối khi mount và hủy kết nối khi unmount
  useEffect(() => {
    initializeSocket();
    return () => cleanupSocket();
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        initializeSocket,
        cleanupSocket,  // expose cleanupSocket
        me,
        setMe,
        name,
        setName,
        callAccepted,
        myVideo,
        userVideo,
        callEnded,
        stream,
        call,
        partnerName,
        subtitles,
        setSubtitles,
        answerCall,
        leaveCall,
        callUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
