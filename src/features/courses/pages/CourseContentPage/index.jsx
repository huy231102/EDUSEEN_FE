import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from 'features/courses/data/courseData';
import './style.css';
import YouTube from 'react-youtube';
import { useMyCourses } from 'features/courses/contexts/MyCoursesContext';

const CourseContentPage = () => {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === parseInt(courseId));
  const { markLectureCompleted, enrollCourse } = useMyCourses();

  const [currentLecture, setCurrentLecture] = useState(null);
  const [openSections, setOpenSections] = useState([]);

  // Điều khiển thứ tự bài giảng
  const flattenedLectures = course ? course.sections.flatMap((s) => s.lectures) : [];
  const [allowedIndex, setAllowedIndex] = useState(0); // chỉ số lecture tối đa được phép học

  // Trạng thái liên quan tới video & bài tập
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'assignment'

  useEffect(() => {
    // Tự động mở section đầu tiên và chọn bài giảng đầu tiên
    if (course?.sections?.[0]?.lectures?.[0]) {
      setCurrentLecture(course.sections[0].lectures[0]);
      setOpenSections([0]); // Mở section đầu tiên
      setAllowedIndex(0);
    }
  }, [course]);

  // Khi đổi bài giảng thì reset trạng thái liên quan tới video/bài tập
  useEffect(() => {
    setVideoCompleted(false);
    setAssignmentFile(null);
    setCommentInput('');
    setComments(currentLecture?.assignment?.comments || []);
    setSubmitted(false);
    setActiveTab('video');
  }, [currentLecture]);

  if (!course) {
    return <div>Đang tải...</div>;
  }

  const handleLectureSelect = (lecture, sectionIndex, globalIndex) => {
    if (globalIndex > allowedIndex) return; // chưa được phép
    setCurrentLecture(lecture);
    markLectureCompleted(course.id, lecture.title);
    // Đảm bảo section của bài giảng được chọn luôn mở
    if (!openSections.includes(sectionIndex)) {
      setOpenSections([...openSections, sectionIndex]);
    }
  };
  
  const toggleSection = (sectionIndex) => {
    setOpenSections(prevOpenSections => {
      const isOpen = prevOpenSections.includes(sectionIndex);
      if (isOpen) {
        return prevOpenSections.filter(index => index !== sectionIndex);
      } else {
        return [...prevOpenSections, sectionIndex];
      }
    });
  };

  const handleTabClick = (tab) => {
    if (tab === 'assignment' && !videoCompleted) return;
    setActiveTab(tab);
  };

  return (
    <div className="course-content-page">
      {/* Cột trái: Danh sách bài giảng */}
      <div className="content-sidebar">
        <Link to={`/courses/${courseId}`} className='back-link'>
          <i className="fa fa-arrow-left"></i> Quay lại trang chi tiết
        </Link>
        <h2 className="course-title">{course.name}</h2>
        <div className="sections-accordion">
          {course.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section-item">
              <div className="section-header" onClick={() => toggleSection(sectionIndex)}>
                <span>{section.title}</span>
                <i className={`fa fa-chevron-down ${openSections.includes(sectionIndex) ? 'open' : ''}`}></i>
              </div>
              {openSections.includes(sectionIndex) && (
                <ul className="lectures-list">
                  {section.lectures.map((lecture, lectureIndex) => (
                    <li 
                      key={lectureIndex}
                      className={`lecture-item ${currentLecture?.title === lecture.title ? 'active' : ''} ${flattenedLectures.findIndex(l=>l.title===lecture.title) > allowedIndex ? 'disabled': ''}`}
                      onClick={() => handleLectureSelect(lecture, sectionIndex, flattenedLectures.findIndex(l => l.title===lecture.title))}
                    >
                      <i className="fa fa-play-circle"></i> {lecture.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Nội dung bài giảng */}
      <div className="content-main">
        {currentLecture ? (
          <>
            {/* TAB HEADER */}
            <div className="tabs-header">
              <button
                className={`tab-item ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => handleTabClick('video')}
              >
                Bài học
              </button>
              {currentLecture.assignment && (
                <button
                  className={`tab-item ${activeTab === 'assignment' ? 'active' : ''} ${!videoCompleted ? 'disabled' : ''}`}
                  onClick={() => handleTabClick('assignment')}
                  disabled={!videoCompleted}
                >
                  Bài tập
                </button>
              )}
            </div>

            {activeTab === 'video' && (
          <>
            <h1 className="lecture-title">{currentLecture.title}</h1>
            <div className="video-player-wrapper">
                  {/* Sử dụng react-youtube để bắt sự kiện kết thúc video */}
                  <YouTube
                    videoId={(() => {
                      const match = currentLecture.videoUrl.match(/embed\/([^?]+)/);
                      return match ? match[1] : '';
                    })()}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 0,
                      },
                    }}
                    onEnd={() => {
                      setVideoCompleted(true);
                      if (!currentLecture.assignment) {
                        const currentIdx = flattenedLectures.findIndex(l => l.title === currentLecture.title);
                        if (currentIdx === allowedIndex) {
                          setAllowedIndex(allowedIndex + 1);
                        }
                      }
                    }}
                  />
                </div>
              </>
            )}

            {activeTab === 'assignment' && currentLecture.assignment && videoCompleted && (
              <div className="assignment-section">
                {/* LEFT - Nội dung đề bài */}
                <div className="assignment-content">
                  <div className="assignment-header">
                    <div className="assignment-icon">
                      <i className="fa fa-clipboard-list"></i>
                    </div>
                    <div className="assignment-info">
                      <h1 className="assignment-title">{currentLecture.assignment.title}</h1>
                      <div className="assignment-meta">
                        <span className="points">
                          <i className="fa fa-star"></i> {currentLecture.assignment.maxScore} điểm
                        </span>
                        <span className="due-date">
                          <i className="fa fa-calendar"></i> Đến hạn {currentLecture.assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="assignment-description">
                    <h3><i className="fa fa-info-circle"></i> Yêu cầu bài tập</h3>
                    <p>{currentLecture.assignment.description}</p>
                  </div>

                  {/* Attachment mẫu (nếu có) */}
                  {currentLecture.assignment.attachments?.length > 0 && (
                    <div className="attachment-section">
                      <h3><i className="fa fa-paperclip"></i> Tài liệu tham khảo</h3>
                      <div className="attachment-list">
                      {currentLecture.assignment.attachments.map((att, idx) => (
                        <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="attachment-item">
                          <div className="attachment-icon">
                            <i className="fa fa-file-excel"></i>
                          </div>
                          <div className="attachment-info">
                            <span className="attachment-name">{att.name}</span>
                            <span className="attachment-type">Microsoft Excel</span>
                          </div>
                          <i className="fa fa-download"></i>
                        </a>
                      ))}
                      </div>
                    </div>
                  )}

                  {/* Bình luận lớp học */}
                  <div className="comment-section">
                    <h3><i className="fa fa-comments"></i> Thảo luận lớp học</h3>
                    <div className="comment-container">
                      {comments.length > 0 ? (
                        <div className="comment-list">
                          {comments.map((c, idx) => (
                            <div key={idx} className="comment-item">
                              <div className="comment-avatar">
                                <i className="fa fa-user-circle"></i>
                              </div>
                              <div className="comment-content">
                                <span className="comment-author">Học viên</span>
                                <p className="comment-text">{c}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-comments">
                          <i className="fa fa-comment-slash"></i>
                          <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                        </div>
                      )}
                      
                      <div className="comment-input-section">
                        <div className="comment-input-wrapper">
                          <textarea
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Chia sẻ suy nghĩ của bạn về bài tập này..."
                            rows="3"
                          />
                          <button
                            className="comment-send-btn"
                            onClick={() => {
                              if (!commentInput.trim()) return;
                              setComments([...comments, commentInput.trim()]);
                              setCommentInput('');
                            }}
                            disabled={!commentInput.trim()}
                          >
                            <i className="fa fa-paper-plane"></i> Gửi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT - Bài tập của bạn */}
                <div className="assignment-sidebar">
                  <div className="sidebar-header">
                    <h3><i className="fa fa-user-edit"></i> Bài tập của bạn</h3>
                    <div className={`submission-status ${submitted ? 'submitted' : 'pending'}`}>
                      <i className={`fa ${submitted ? 'fa-check-circle' : 'fa-clock'}`}></i>
                      {submitted ? 'Đã nộp' : 'Chưa nộp'}
                    </div>
                  </div>

                  <div className="submission-area">
                    {/* Hiển thị file đã chọn */}
                    {assignmentFile && (
                      <div className="submission-file-item">
                        <div className="file-icon">
                          <i className="fa fa-file-alt"></i>
                        </div>
                        <div className="file-info">
                          <span className="file-name">{assignmentFile.name}</span>
                          <span className="file-size">{(assignmentFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                        {!submitted && (
                          <button 
                            className="remove-file-btn"
                            onClick={() => setAssignmentFile(null)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        )}
                      </div>
                    )}

                    {!assignmentFile && !submitted && (
                      <label className="file-input-label">
                        <div className="upload-icon">
                          <i className="fa fa-cloud-upload-alt"></i>
                        </div>
                        <span>Thêm hoặc tạo file</span>
                        <small>Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX</small>
                        <input type="file" onChange={(e) => setAssignmentFile(e.target.files[0])} />
                      </label>
                    )}

                    {/* Nút nộp / hủy nộp */}
                    <div className="action-buttons">
                      {!submitted ? (
                        <button
                          className="submit-btn"
                          disabled={!assignmentFile}
                          onClick={() => {
                            if (!assignmentFile) return;
                            setSubmitted(true);
                            const currentIdx = flattenedLectures.findIndex(l=>l.title===currentLecture.title);
                            if (currentIdx === allowedIndex) {
                              setAllowedIndex(allowedIndex + 1);
                            }
                          }}
                        >
                          <i className="fa fa-paper-plane"></i> Nộp bài
                        </button>
                      ) : (
                        <button
                          className="unsubmit-btn"
                          onClick={() => {
                            setSubmitted(false);
                            setAssignmentFile(null);
                          }}
                        >
                          <i className="fa fa-undo"></i> Hủy nộp bài
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Điểm số */}
                  <div className="score-section">
                    <h4><i className="fa fa-chart-line"></i> Kết quả</h4>
                    {currentLecture.assignment.score !== null ? (
                      <div className="score-display">
                        <span className="score-value">{currentLecture.assignment.score}/{currentLecture.assignment.maxScore}</span>
                        <span className="score-label">điểm</span>
                      </div>
                    ) : (
                      <div className="score-pending">
                        <i className="fa fa-hourglass-half"></i>
                        <span>Đang chờ chấm điểm</span>
                      </div>
                    )}
                  </div>

                  {/* Nhận xét riêng tư (đơn giản) */}
                  <div className="private-comment">
                    <h4><i className="fa fa-lock"></i> Nhận xét riêng tư</h4>
                    <textarea placeholder="Gửi nhận xét riêng tư cho giáo viên..." rows="3" />
                    <button className="private-comment-btn">
                      <i className="fa fa-paper-plane"></i> Gửi
                    </button>
                  </div>
                </div>
            </div>
            )}
          </>
        ) : (
          <div className="no-lecture-selected">
            <h2>Vui lòng chọn một bài giảng để bắt đầu học</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentPage; 