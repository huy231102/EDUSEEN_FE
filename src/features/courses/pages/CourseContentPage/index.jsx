import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import courseApi from 'services/courseApi';
import assignmentApi from 'services/assignmentApi';
import './style.css';
import YouTube from 'react-youtube';
import { useMyCourses } from 'features/courses/contexts/MyCoursesContext';

const CourseContentPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!location.state?.course);
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
  const [assignment, setAssignment] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  useEffect(() => {
    if (!course) {
      setLoading(true);
      courseApi.getCourseDetail(courseId)
        .then(data => {
          const mappedCourse = {
            id: data.courseId,
            name: data.title,
            cover: data.cover,
            description: data.description,
            trainerName: data.teacherName,
            trainerJob: 'Giảng viên',
            teacherAvatarUrl: data.teacherAvatarUrl,
            totalTime: Math.round(data.sections?.reduce((totalHours, section) => {
              const sectionMinutes = section.lectures?.reduce((total, lecture) =>
                total + (lecture.duration || 0), 0) || 0;
              return totalHours + (sectionMinutes / 60);
            }, 0) * 100) / 100 || 0,
            rating: data.rating || 0,
            isEnrolled: data.isEnrolled || false,
            sections: data.sections?.map(section => ({
              id: section.sectionId,
              title: section.title,
              order: section.order,
              lectures: section.lectures?.map(lecture => ({
                id: lecture.lectureId,
                title: lecture.title,
                contentType: lecture.contentType,
                contentUrl: lecture.contentUrl,
                duration: lecture.duration,
                order: lecture.order,
                isCompleted: lecture.isCompleted || false,
                assignmentId: lecture.assignmentId || null
              })) || []
            })) || [],
            reviews: data.reviews?.map(review => ({
              id: Date.now() + Math.random(),
              userName: review.userName,
              courseName: review.courseName,
              courseDescription: review.comment,
              userAvatarUrl: review.userAvatarUrl || '/images/testo/t1.webp',
              rating: review.rating,
              createdAt: review.createdAt
            })) || []
          };
          setCourse(mappedCourse);
        })
        .catch(() => setCourse(null))
        .finally(() => setLoading(false));
    }
  }, [courseId, course]);

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
    setComments([]);
    setSubmitted(false);
    setActiveTab('video');
    setAssignment(null);
    
    // Fetch thông tin bài tập nếu có assignmentId
    if (currentLecture?.assignmentId) {
      setAssignmentLoading(true);
      assignmentApi.getDetail(currentLecture.assignmentId)
        .then(data => {
          setAssignment({
            id: data.assignmentId,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            maxScore: 10, // Giá trị mặc định, có thể cập nhật sau
            score: data.grade,
            attachments: [], // Có thể cập nhật sau nếu có attachment
            comments: []
          });
        })
        .catch(err => {
          console.error('Lỗi khi tải thông tin bài tập:', err);
          setAssignment(null);
        })
        .finally(() => {
          setAssignmentLoading(false);
        });
    }
  }, [currentLecture]);

  if (loading) return <div>Đang tải...</div>;
  if (!course) return <div>Không tìm thấy khoá học.</div>;

  const handleLectureSelect = (lecture, sectionIndex, globalIndex) => {
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
                      className={`lecture-item ${currentLecture?.title === lecture.title ? 'active' : ''}`}
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
            <div className="tab-row">
              <button
                className={`tab-item ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => handleTabClick('video')}
              >
                Bài học
              </button>
              {currentLecture.assignmentId && (
                <button
                  className={`tab-item ${activeTab === 'assignment' ? 'active' : ''} ${!videoCompleted ? 'disabled' : ''}`}
                  onClick={() => handleTabClick('assignment')}
                  disabled={!videoCompleted}
                >
                  Bài tập
                </button>
              )}
            </div>
            <hr className="tab-divider" />

            {activeTab === 'video' && (
              <>
                <h1 className="lecture-title">{currentLecture.title}</h1>
                <div className="video-player-wrapper">
                  {currentLecture.contentUrl && (currentLecture.contentUrl.includes('youtube.com') || currentLecture.contentUrl.includes('youtu.be')) ? (
                    <YouTube
                      videoId={(() => {
                        // Lấy videoId từ nhiều dạng link YouTube (watch?v=, youtu.be/, embed/)
                        const url = currentLecture.contentUrl;
                        const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]+)/);
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
                  ) : currentLecture.contentUrl ? (
                    <video
                      src={currentLecture.contentUrl}
                      controls
                      width="100%"
                      style={{ maxHeight: 400, background: '#000' }}
                      onEnded={() => {
                        setVideoCompleted(true);
                        if (!currentLecture.assignment) {
                          const currentIdx = flattenedLectures.findIndex(l => l.title === currentLecture.title);
                          if (currentIdx === allowedIndex) {
                            setAllowedIndex(allowedIndex + 1);
                          }
                        }
                      }}
                    />
                  ) : (
                    <div>Không có video cho bài giảng này.</div>
                  )}
                </div>
              </>
            )}

                        {activeTab === 'assignment' && currentLecture.assignmentId && videoCompleted && (
              <div className="assignment-section">
                {assignmentLoading ? (
                  <div className="assignment-loading">
                    <p>Đang tải thông tin bài tập...</p>
                  </div>
                ) : assignment ? (
                  <>
                    {/* LEFT - Nội dung đề bài */}
                    <div className="assignment-content">
                      <div className="assignment-header">
                        <div className="assignment-icon">
                          <i className="fa fa-clipboard-list"></i>
                        </div>
                        <div className="assignment-info">
                          <h1 className="assignment-title">{assignment?.title || 'Đang tải...'}</h1>
                          <div className="assignment-meta">
                            <span className="points">
                              <i className="fa fa-star"></i> {assignment?.maxScore || 10} điểm
                            </span>
                            <span className="due-date">
                              <i className="fa fa-calendar"></i> Đến hạn {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="assignment-description">
                        <h3><i className="fa fa-info-circle"></i> Yêu cầu bài tập</h3>
                        <p>{assignment?.description || 'Đang tải mô tả bài tập...'}</p>
                      </div>

                      {/* Attachment mẫu (nếu có) */}
                      {assignment?.attachments?.length > 0 && (
                        <div className="attachment-section">
                          <h3><i className="fa fa-paperclip"></i> Tài liệu tham khảo</h3>
                          <div className="attachment-list">
                          {assignment.attachments.map((att, idx) => (
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
                        {assignment?.score !== null && assignment?.score !== undefined ? (
                          <>
                            <div className="score-display">
                              <span className="score-value">{assignment.score}/{assignment.maxScore}</span>
                              <span className="score-label">điểm</span>
                            </div>
                            {assignment?.teacherComment && (
                              <div className="teacher-comment">
                                <i className="fa fa-comments"></i> Nhận xét của giáo viên: <span>{assignment.teacherComment}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="score-pending">
                            <i className="fa fa-hourglass-half"></i>
                            <span>Đang chờ chấm điểm</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="assignment-error">
                    <p>Không thể tải thông tin bài tập</p>
                  </div>
                )}
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