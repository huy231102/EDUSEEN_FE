import { useState, useEffect } from 'react';

/**
 * Custom hook để quản lý việc lazy loading của video call components
 * Chỉ load các components khi người dùng thực sự cần sử dụng video call
 */
export const useLazyVideoCall = () => {
  const [isVideoCallLoaded, setIsVideoCallLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load video call components khi cần thiết
  const loadVideoCall = async () => {
    if (isVideoCallLoaded) return;
    
    setIsLoading(true);
    
    try {
      // Simulate loading time (có thể thay bằng dynamic import thực tế)
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsVideoCallLoaded(true);
    } catch (error) {
      console.error('Error loading video call components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load khi component mount (optional)
  useEffect(() => {
    // Có thể thêm logic để auto-load dựa trên user behavior
    // Ví dụ: nếu user thường xuyên sử dụng video call
  }, []);

  return {
    isVideoCallLoaded,
    isLoading,
    loadVideoCall,
  };
};

export default useLazyVideoCall; 