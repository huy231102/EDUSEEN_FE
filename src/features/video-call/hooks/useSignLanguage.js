import { useEffect, useRef, useContext } from 'react';
import { SocketContext } from 'features/video-call/contexts/SocketContext';

/**
 * Hook gửi khung hình từ videoRef lên AI server WebSocket để nhận phụ đề.
 * @param {Object} videoRef - React ref đến video element
 * @param {Function} setSubtitle - hàm cập nhật phụ đề
 */
// Hằng số cấu hình – có thể đưa vào .env sau này
const FPS = 6; // số khung hình gửi mỗi giây
const INTERVAL = 1000 / FPS;
const RESOLUTION_SCALE = 1; // 1 = giữ nguyên, 0.5 = giảm một nửa
const JPEG_QUALITY = 0.6;  // tăng chất lượng để AI dễ nhận diện

const useSignLanguage = (videoRef, setSubtitle, enabled = true) => {
  const { sendSubtitle } = useContext(SocketContext);
  const wsRef = useRef(null);
  const canvas = useRef(document.createElement('canvas'));

  useEffect(() => {
    if (!enabled) return; // Không khởi tạo WS nếu tắt
    // Xác định URL WebSocket AI
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = process.env.REACT_APP_AI_HOST || window.location.hostname;
    const port = process.env.REACT_APP_AI_PORT || '8001';
    const path = process.env.REACT_APP_AI_SERVER_URL || `${proto}://${host}:${port}/ws/translate`;
    wsRef.current = new WebSocket(path);
    wsRef.current.onmessage = e => {
      const text = e.data;
      setSubtitle(text);      // Cập nhật cho chính mình
      console.log('[AI] subtitle:', text);
      sendSubtitle(text);     // Gửi cho người đối diện
    };
    wsRef.current.onopen = () => console.log('AI WebSocket connected:', path);
    wsRef.current.onerror = err => console.error('AI WebSocket error:', err);
    return () => wsRef.current && wsRef.current.close();
  }, [setSubtitle, enabled]);

  // Gửi khung hình định kỳ ở FPS cố định
  useEffect(() => {
    if (!enabled) return;
    let rafId;
    let lastTime = 0;
    const sendFrame = (now) => {
      const video = videoRef.current;
      if (now - lastTime >= INTERVAL && video && wsRef.current?.readyState === WebSocket.OPEN) {
        lastTime = now;
        const ctx = canvas.current.getContext('2d');
        // Thay đổi độ phân giải theo RESOLUTION_SCALE
        const width = video.videoWidth * RESOLUTION_SCALE;
        const height = video.videoHeight * RESOLUTION_SCALE;
        canvas.current.width = width;
        canvas.current.height = height;
        ctx.drawImage(video, 0, 0, width, height);
        // Mã hóa JPEG với chất lượng đã cấu hình
        const dataUrl = canvas.current.toDataURL('image/jpeg', JPEG_QUALITY);
        wsRef.current.send(dataUrl);
      }
      rafId = requestAnimationFrame(sendFrame);
    };
    rafId = requestAnimationFrame(sendFrame);
    return () => cancelAnimationFrame(rafId);
  }, [videoRef, enabled]);

  // Gửi tín hiệu STOP khi tab bị ẩn nhằm giảm tải server
  useEffect(() => {
    if (!enabled) return;
    const handleVisibility = () => {
      if (document.hidden) {
        wsRef.current?.send('STOP');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [enabled]);
};

export default useSignLanguage;
