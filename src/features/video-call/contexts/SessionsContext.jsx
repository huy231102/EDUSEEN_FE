import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionsContext = createContext();

export const useSessions = () => {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
};

export const SessionsProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data cho lịch sử cuộc gọi (tối đa 2 người tham gia)
  const mockSessions = [
          {
        id: 1,
        date: '2025-07-11',
        startTime: '14:00',
        endTime: '15:30',
        duration: '1 giờ 30 phút',
        participants: [
          { name: 'Nguyễn Văn Toán', role: 'Giáo viên Toán' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Toán học',
        status: 'completed',
        notes: 'Ôn tập chương Đại số',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 2,
        date: '2025-07-10',
        startTime: '09:00',
        endTime: '10:15',
        duration: '1 giờ 15 phút',
        participants: [
          { name: 'Trần Thị Vật Lý', role: 'Giáo viên Vật lý' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Vật lý',
        status: 'completed',
        notes: 'Thực hành thí nghiệm ảo',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 3,
        date: '2025-07-09',
        startTime: '16:00',
        endTime: '16:45',
        duration: '45 phút',
        participants: [
          { name: 'Lê Văn Tư Vấn', role: 'Cố vấn học tập' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Tư vấn',
        status: 'completed',
        notes: 'Thảo luận về kế hoạch học tập',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 4,
        date: '2025-07-08',
        startTime: '13:00',
        endTime: '14:00',
        duration: '1 giờ',
        participants: [
          { name: 'Phạm Thị Anh', role: 'Giáo viên Tiếng Anh' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Tiếng Anh',
        status: 'completed',
        notes: 'Luyện tập phát âm và giao tiếp',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 5,
        date: '2025-07-07',
        startTime: '10:00',
        endTime: '11:30',
        duration: '1 giờ 30 phút',
        participants: [
          { name: 'Hoàng Văn Hóa', role: 'Giáo viên Hóa học' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Hóa học',
        status: 'completed',
        notes: 'Giải bài tập về phản ứng hóa học',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 6,
        date: '2025-07-06',
        startTime: '15:00',
        endTime: '16:00',
        duration: '1 giờ',
        participants: [
          { name: 'Vũ Thị Sinh', role: 'Giáo viên Sinh học' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Sinh học',
        status: 'completed',
        notes: 'Học về hệ tuần hoàn',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 7,
        date: '2025-07-05',
        startTime: '11:00',
        endTime: '11:30',
        duration: '30 phút',
        participants: [
          { name: 'Học sinh B', role: 'Học sinh' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Học nhóm',
        status: 'completed',
        notes: 'Ôn tập bài tập về nhà',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 8,
        date: '2025-07-04',
        startTime: '08:30',
        endTime: '09:30',
        duration: '1 giờ',
        participants: [
          { name: 'Nguyễn Văn Toán', role: 'Giáo viên Toán' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Toán học',
        status: 'completed',
        notes: 'Giải bài tập về hình học',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 9,
        date: '2025-07-03',
        startTime: '14:30',
        endTime: '15:00',
        duration: '30 phút',
        participants: [
          { name: 'Phạm Thị Anh', role: 'Giáo viên Tiếng Anh' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Tiếng Anh',
        status: 'completed',
        notes: 'Kiểm tra từ vựng',
        recordingUrl: null,
        transcript: null
      },
      {
        id: 10,
        date: '2025-07-02',
        startTime: '16:30',
        endTime: '17:30',
        duration: '1 giờ',
        participants: [
          { name: 'Trần Thị Vật Lý', role: 'Giáo viên Vật lý' },
          { name: 'Học sinh A', role: 'Học sinh' }
        ],
        subject: 'Vật lý',
        status: 'completed',
        notes: 'Ôn tập chương Điện học',
        recordingUrl: null,
        transcript: null
      }
  ];

  // Load sessions from localStorage or use mock data
  useEffect(() => {
    const loadSessions = () => {
      setLoading(true);
      try {
        const savedSessions = localStorage.getItem('videoSessions');
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions);
          // Kiểm tra xem dữ liệu cũ có cấu trúc participants cũ không (array of strings)
          const hasOldData = parsedSessions.some(session => 
            Array.isArray(session.participants) && 
            session.participants.length > 0 && 
            typeof session.participants[0] === 'string'
          );
          if (hasOldData) {
            // Nếu có dữ liệu cũ, reset về dữ liệu mới
            setSessions(mockSessions);
            localStorage.setItem('videoSessions', JSON.stringify(mockSessions));
          } else {
            setSessions(parsedSessions);
          }
        } else {
          setSessions(mockSessions);
          localStorage.setItem('videoSessions', JSON.stringify(mockSessions));
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        setSessions(mockSessions);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Save sessions to localStorage
  const saveSessions = (newSessions) => {
    try {
      localStorage.setItem('videoSessions', JSON.stringify(newSessions));
      setSessions(newSessions);
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  // Add new session
  const addSession = (session) => {
    const newSession = {
      ...session,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      // Đảm bảo participants có cấu trúc đúng
      participants: session.participants.map(p => 
        typeof p === 'string' ? { name: p, role: 'Học sinh' } : p
      )
    };
    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);
  };

  // Update session
  const updateSession = (id, updates) => {
    const updatedSessions = sessions.map(session =>
      session.id === id ? { ...session, ...updates } : session
    );
    saveSessions(updatedSessions);
  };

  // Delete session
  const deleteSession = (id) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    saveSessions(updatedSessions);
  };

  // Reset sessions to mock data
  const resetSessions = () => {
    saveSessions(mockSessions);
  };

  // Get sessions by date range
  const getSessionsByDateRange = (startDate, endDate) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  // Get sessions by subject
  const getSessionsBySubject = (subject) => {
    return sessions.filter(session => 
      session.subject.toLowerCase().includes(subject.toLowerCase())
    );
  };

  // Generate call title based on participants' roles
  const generateCallTitle = (participants) => {
    if (participants.length !== 2) return 'Cuộc gọi không xác định';
    
    const [person1, person2] = participants;
    
    // Nếu một người là học sinh và người kia là giáo viên/cố vấn
    if (person1.role === 'Học sinh' && person2.role !== 'Học sinh') {
      return `Cuộc gọi với ${person2.role}`;
    }
    if (person2.role === 'Học sinh' && person1.role !== 'Học sinh') {
      return `Cuộc gọi với ${person1.role}`;
    }
    
    // Nếu cả hai đều là học sinh
    if (person1.role === 'Học sinh' && person2.role === 'Học sinh') {
      return `Cuộc gọi với ${person1.name}`;
    }
    
    // Trường hợp khác
    return `Cuộc gọi với ${person1.role}`;
  };

  // Get statistics
  const getStatistics = () => {
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((total, session) => {
      const duration = session.duration;
      const hours = duration.match(/(\d+)\s*giờ/)?.[1] || 0;
      const minutes = duration.match(/(\d+)\s*phút/)?.[1] || 0;
      return total + parseInt(hours) * 60 + parseInt(minutes);
    }, 0);
    
    const totalHours = Math.floor(totalDuration / 60);
    const remainingMinutes = totalDuration % 60;
    
    // Vì mỗi cuộc gọi chỉ có 2 người (1 giáo viên + 1 học sinh)
    const averageParticipants = 2;

    const subjects = [...new Set(sessions.map(session => session.subject))];

    return {
      totalSessions,
      totalDuration: `${totalHours}h ${remainingMinutes}m`,
      averageParticipants,
      subjects
    };
  };

  const value = {
    sessions,
    loading,
    addSession,
    updateSession,
    deleteSession,
    resetSessions,
    getSessionsByDateRange,
    getSessionsBySubject,
    getStatistics,
    generateCallTitle
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}; 