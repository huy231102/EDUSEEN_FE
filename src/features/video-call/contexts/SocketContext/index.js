import React, { createContext, useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

// Khởi tạo Context
export const SocketContext = createContext();

// Xác định protocol và host cho Socket.IO (HTTPS/WSS hoặc HTTP/WS)
// Sử dụng http/https cho Socket.IO thay vì ws/wss
const defaultProtocol = window.location.protocol === 'https:' ? 'https' : 'http';
const socketHost = process.env.REACT_APP_SOCKET_HOST || window.location.hostname;
const socketPort = process.env.REACT_APP_SOCKET_PORT || '5000';
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || `${defaultProtocol}://${socketHost}:${socketPort}`;
console.log(`SocketContext: connecting to Socket.IO at ${SOCKET_SERVER_URL}`);

export const ContextProvider = ({ children }) => {
  // State
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [me, setMe] = useState('');
  const [name, setName] = useState('');
  const [stream, setStream] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState({});
  const [partnerName, setPartnerName] = useState('');
  const [mySubtitles, setMySubtitles] = useState('');
  const [partnerSubtitles, setPartnerSubtitles] = useState('');

  // Hàm gửi phụ đề tới người đối diện
  const sendSubtitle = (text) => {
    console.log('[Socket] muốn gửi subtitle:', text, 'socket?', !!socketRef.current);
    if (!socketRef.current) {
      console.warn('[Socket] Chưa có kết nối, thử initializeSocket');
      initializeSocket();
    }
    if (socketRef.current) {
      console.log('[Socket] emit subtitle:', text);
      socketRef.current.emit('subtitle', text);
    } else {
      console.error('[Socket] Không thể gửi subtitle – socket vẫn null');
    }
  };

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // Khởi tạo socket khi cần
  const initializeSocket = () => {
    if (!socketRef.current) {
      const newSocket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
      });
      socketRef.current = newSocket;
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

      // Lắng nghe phụ đề đến từ người đối diện
      newSocket.on('subtitle', (text) => {
        console.log('[Socket] received partner subtitle:', text);
        setPartnerSubtitles(text);
      });

      // Lắng nghe sự kiện kết thúc cuộc gọi từ server
      newSocket.on('callEnded', () => {
        setCallEnded(true);
        if (connectionRef.current) connectionRef.current.destroy();
      });
    }
  };

  // Thêm hàm ngắt kết nối WebSocket/Socket.IO
  const cleanupSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
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

    // Tạo peer ở phía người NHẬN cuộc gọi (initiator: false)
    const peer = new Peer({ initiator: false, trickle: false, stream });

    // Khi peer tạo ra signal => gửi lên server để chuyển cho người GỌI
    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', { signal: data, to: call.from, name });
    });

    // Khi nhận được stream từ người GỌI => hiển thị lên video
    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    // Tiếp nhận signal của người GỌI đã gửi kèm trong sự kiện 'callUser'
    peer.signal(call.signal);

    // Lưu tên đối tác (người gọi)
    setPartnerName(call.name);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    // Thông báo cho server biết người dùng chủ động kết thúc cuộc gọi
    if (socketRef.current) {
      socketRef.current.emit('endCall');
    }

    // Kết thúc peer connection
    if (connectionRef.current) connectionRef.current.destroy();

    // Dừng stream local (tắt camera/mic)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Reset các state liên quan
    setCallEnded(true);
    setCallAccepted(false);
    setPartnerName('');
    setCall({});

    // Ngắt socket
    cleanupSocket();
  };

  const callUser = (id, callerName) => {
    if (!socketRef.current) initializeSocket();
    if (!socketRef.current) return;

    setPartnerName(''); // reset tên đối tác, sẽ cập nhật sau khi kết nối thành công

    // Tạo peer ở phía NGƯỜI GỌI (initiator: true)
    const peer = new Peer({ initiator: true, trickle: false, stream });

    // Khi peer sinh ra signal => gửi kèm trong sự kiện callUser tới server
    peer.on('signal', (data) => {
      socketRef.current.emit('callUser', { userToCall: id, signalData: data, from: socketRef.current.id, name: callerName });
    });

    // Khi nhận stream từ người nhận => hiển thị
    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    // Lắng nghe sự kiện khi cuộc gọi được chấp nhận
    socketRef.current.on('callAccepted', ({ signal, name: calleeName }) => {
      setCallAccepted(true);
      // Cập nhật tên đối tác nếu backend gửi, fallback id
      setPartnerName(calleeName || id);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // Tự động kết nối khi mount và hủy kết nối khi unmount
  useEffect(() => {
    initializeSocket();
    return () => cleanupSocket();
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
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
        mySubtitles,
        setMySubtitles,
        partnerSubtitles,
        setPartnerSubtitles,
        sendSubtitle,
        answerCall,
        leaveCall,
        callUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
