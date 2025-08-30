import { useEffect, useRef } from 'react';

/**
 * Hook gửi khung hình từ videoRef lên AI server WebSocket để nhận phụ đề.
 * @param {Object} videoRef - React ref đến video element
 * @param {Function} setSubtitle - hàm cập nhật phụ đề
 */
const useSignLanguage = (videoRef, setSubtitle) => {
  const wsRef = useRef(null);
  const canvas = useRef(document.createElement('canvas'));

  useEffect(() => {
    // Xác định URL WebSocket AI
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = process.env.REACT_APP_AI_HOST || window.location.hostname;
    const port = process.env.REACT_APP_AI_PORT || '8001';
    const path = process.env.REACT_APP_AI_SERVER_URL || `${proto}://${host}:${port}/ws/translate`;
    wsRef.current = new WebSocket(path);
    wsRef.current.onmessage = e => setSubtitle(e.data);
    wsRef.current.onopen = () => console.log('AI WebSocket connected:', path);
    wsRef.current.onerror = err => console.error('AI WebSocket error:', err);
    return () => wsRef.current && wsRef.current.close();
  }, [setSubtitle]);

  useEffect(() => {
    let rafId;
    const sendFrame = () => {
      const video = videoRef.current;
      if (video && wsRef.current?.readyState === WebSocket.OPEN) {
        const ctx = canvas.current.getContext('2d');
        canvas.current.width = video.videoWidth;
        canvas.current.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.current.toDataURL('image/jpeg', 0.6);
        wsRef.current.send(dataUrl);
      }
      rafId = requestAnimationFrame(sendFrame);
    };
    rafId = requestAnimationFrame(sendFrame);
    return () => cancelAnimationFrame(rafId);
  }, [videoRef]);
};

export default useSignLanguage;
