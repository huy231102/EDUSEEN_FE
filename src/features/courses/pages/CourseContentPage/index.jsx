import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import courseApi from 'services/courseApi';
import assignmentApi from 'services/assignmentApi';
import studentAssignmentApi from 'services/studentAssignmentApi';
import './style.css';
import YouTube from 'react-youtube';
import { useMyCourses } from 'features/courses/contexts/MyCoursesContext';
import ContentUpload from 'components/common/ContentUpload';
import { uploadFileToS3 } from 'services/awsS3Upload';

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
  const [assignmentFiles, setAssignmentFiles] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'assignment'
  const [assignment, setAssignment] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showCompletionNotice, setShowCompletionNotice] = useState(true);

  // Ngăn cuộn trang khi hiển thị thông báo hoàn thành
  useEffect(() => {
    const shouldLock = showCompletionNotice && location.state?.nextLecture?.isCompleted;

    const scrollContainers = document.querySelectorAll('.content-main');

    scrollContainers.forEach(el => {
      if (shouldLock) {
        el.classList.add('no-scroll');
      } else {
        el.classList.remove('no-scroll');
      }
    });

    return () => {
      scrollContainers.forEach(el => el.classList.remove('no-scroll'));
    };
  }, [showCompletionNotice, location.state?.nextLecture?.isCompleted]);

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
    // Kiểm tra xem có lecture tiếp theo được truyền từ CourseDetailPage không
    const nextLecture = location.state?.nextLecture;
    
    if (nextLecture && course) {
      // Sử dụng lecture tiếp theo được truyền từ CourseDetailPage
      setCurrentLecture(nextLecture.lecture);
      
      // Tìm index của section chứa lecture này để mở section đó
      const sectionIndex = course.sections.findIndex(section => section.id === nextLecture.sectionId);
      if (sectionIndex !== -1) {
        setOpenSections([sectionIndex]);
      }
      
      // Tính allowedIndex dựa trên lecture tiếp theo
      const flattenedLectures = course.sections.flatMap(section => section.lectures);
      const lectureIndex = flattenedLectures.findIndex(lecture => lecture.id === nextLecture.lecture.id);
      setAllowedIndex(lectureIndex);
      
      // Nếu lecture đã hoàn thành (từ CourseDetailPage), set videoCompleted = true
      if (nextLecture.isCompleted) {
        setVideoCompleted(true);
      }
    } else if (course?.sections?.[0]?.lectures?.[0]) {
      // Fallback: Tự động mở section đầu tiên và chọn bài giảng đầu tiên
      setCurrentLecture(course.sections[0].lectures[0]);
      setOpenSections([0]); // Mở section đầu tiên
      setAllowedIndex(0);
    }
  }, [course, location.state?.nextLecture]);

  // Khi đổi bài giảng thì reset trạng thái liên quan tới video/bài tập
  useEffect(() => {
    // Chỉ reset videoCompleted nếu lecture chưa hoàn thành
    if (!currentLecture?.isCompleted) {
      setVideoCompleted(false);
    }
    setAssignmentFiles([]);
    setCommentInput('');
    setComments([]);
    setSubmitted(false);
    
    // Tự động chuyển sang tab "Bài tập" nếu lecture đã hoàn thành và có bài tập
    if (currentLecture?.isCompleted && currentLecture?.assignmentId) {
      setActiveTab('assignment');
    } else {
      setActiveTab('video');
    }
    
    setAssignment(null);
    
    // Fetch thông tin bài tập nếu có assignmentId
    if (currentLecture?.assignmentId) {
      setAssignmentLoading(true);
      
      // Fetch thông tin bài tập
      assignmentApi.getDetail(currentLecture.assignmentId)
        .then(data => {
          setAssignment({
            id: data.assignmentId,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            maxScore: 10, // Giá trị mặc định, có thể cập nhật sau
            score: data.grade,
            feedback: data.feedback,
            attachments: [], // Có thể cập nhật sau nếu có attachment
            comments: [],
            // Thêm các trường mới từ API response
            createdByName: data.createdByName,
            createdAt: data.createdAt,
            submissionStatus: data.submissionStatus,
            submittedAt: data.submittedAt,
            lectureId: data.lectureId,
            lectureTitle: data.lectureTitle
          });
        })
        .catch(err => {
          console.error('Lỗi khi tải thông tin bài tập:', err);
          setAssignment(null);
        });

      // Kiểm tra xem học sinh đã nộp bài chưa
      studentAssignmentApi.getSubmissionDetail(currentLecture.assignmentId)
        .then(data => {
          setSubmitted(true);
          setSubmissionDetail(data);
          console.log('Đã nộp bài:', data);
        })
        .catch(err => {
          // Nếu lỗi 404 hoặc chưa nộp bài thì giữ trạng thái chưa nộp
          if (err.response?.status === 404) {
            setSubmitted(false);
            setSubmissionDetail(null);
          } else {
            console.error('Lỗi khi kiểm tra trạng thái nộp bài:', err);
          }
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
    // Cho phép chuyển sang tab assignment nếu video đã hoàn thành HOẶC lecture đã hoàn thành
    if (tab === 'assignment' && !videoCompleted && !currentLecture?.isCompleted) return;
    setActiveTab(tab);
  };

  const handleImagePreview = (imageUrl, fileName) => {
    setPreviewImage({ url: imageUrl, name: fileName });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  // Hàm kiểm tra xem bài tập có quá hạn hay không
  const isAssignmentOverdue = () => {
    if (!assignment?.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    return now > dueDate;
  };

  const handleSubmit = async () => {
    if (assignmentFiles.length === 0) {
      alert('Vui lòng chọn ít nhất một file để nộp bài!');
      return;
    }

    try {
      // Upload tất cả file lên S3
      const uploadedFiles = [];
      for (const file of assignmentFiles) {
        const url = await uploadFileToS3(file); // Upload vào folder assignments
        uploadedFiles.push({
          fileUrl: url,
          fileName: file.name
        });
      }

      // Chuẩn bị payload theo format của BE
      const payload = {
        assignmentId: currentLecture.assignmentId,
        submissionContent: commentInput || null,
        files: uploadedFiles
      };

      // Gọi API backend để nộp bài
      const response = await studentAssignmentApi.studentSubmitAssignment(
        currentLecture.assignmentId, 
        payload
      );

      setSubmitted(true);
      setSubmissionDetail(response);
      alert(response.message || 'Nộp bài thành công!');
    } catch (err) {
      console.error('Lỗi khi nộp bài:', err);
      alert('Lỗi khi nộp bài: ' + (err.response?.data?.message || err.message));
    }
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
                  className={`tab-item ${activeTab === 'assignment' ? 'active' : ''} ${!videoCompleted && !currentLecture?.isCompleted ? 'disabled' : ''}`}
                  onClick={() => handleTabClick('assignment')}
                  disabled={!videoCompleted && !currentLecture?.isCompleted}
                >
                  Bài tập
                </button>
              )}
            </div>
            <hr className="tab-divider" />

            {activeTab === 'video' && (
              <>
                <h1 className="lecture-title">{currentLecture.title}</h1>
                {currentLecture.isCompleted && currentLecture.assignmentId && (
                  <div className="lecture-completed-notice">
                    <i className="fa fa-check-circle"></i>
                    <span>Bài học này đã hoàn thành. Bạn có thể xem lại video hoặc chuyển sang tab "Bài tập" để xem bài tập đã làm.</span>
                  </div>
                )}
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
                        // Chỉ tự động chuyển sang bài tập nếu lecture chưa hoàn thành
                        if (!currentLecture.isCompleted && currentLecture.assignmentId) {
                          setActiveTab('assignment');
                        }
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
                      style={{ height: '100%', background: '#000' }}
                      onEnded={() => {
                        setVideoCompleted(true);
                        // Chỉ tự động chuyển sang bài tập nếu lecture chưa hoàn thành
                        if (!currentLecture.isCompleted && currentLecture.assignmentId) {
                          setActiveTab('assignment');
                        }
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

                        {activeTab === 'assignment' && currentLecture.assignmentId && (videoCompleted || currentLecture?.isCompleted) && (
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
                              <i className="fa fa-calendar"></i> Đến hạn {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleString('vi-VN') : 'Chưa có'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="assignment-description">
                        <h3><i className="fa fa-info-circle"></i> Yêu cầu bài tập</h3>
                        <p>{assignment?.description || 'Không có mô tả cho bài tập này'}</p>
                        
                        {/* Thông tin bổ sung về bài tập */}
                        {assignment && (
                          <div className="assignment-additional-info">
                            <div className="info-item">
                              <i className="fa fa-user"></i>
                              <span>Tạo bởi: <strong>{assignment.createdByName || 'Giáo viên'}</strong></span>
                            </div>
                            <div className="info-item">
                              <i className="fa fa-calendar"></i>
                              <span>Tạo lúc: <strong>{assignment.createdAt ? new Date(assignment.createdAt).toLocaleString('vi-VN') : 'Chưa có'}</strong></span>
                            </div>
                          </div>
                        )}
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
                          {submitted ? `Đã nộp (Lần ${submissionDetail?.attemptNumber || 1})` : 'Chưa nộp'}
                        </div>
                      </div>

                      <div className="submission-area">
                        {/* Upload files */}
                        <div className="file-upload-section">
                          <label>
                            <i className="fa fa-upload"></i> File đính kèm
                          </label>
                          <ContentUpload
                            onFilesChange={(files) => setAssignmentFiles(files)}
                            acceptedTypes=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                            multiple={true}
                          />
                        </div>

                        {/* Nút nộp / hủy nộp */}
                        <div>
                          {assignment?.score !== null && assignment?.score !== undefined ? (
                            <div className="submission-disabled-notice">
                              <i className="fa fa-lock"></i>
                              <span>Không thể nộp bài vì bài tập đã được chấm điểm</span>
                            </div>
                          ) : isAssignmentOverdue() ? (
                            <div className="submission-disabled-notice">
                              <i className="fa fa-clock-o"></i>
                              <span>Không thể nộp bài vì đã quá hạn nộp bài tập</span>
                            </div>
                          ) : (
                            <button
                              className="submit-btn"
                              disabled={assignmentFiles.length === 0}
                              onClick={handleSubmit}
                            >
                              <i className="fa fa-paper-plane"></i> {submitted ? 'Nộp lại bài' : 'Nộp bài'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Thông tin bài nộp */}
                      {submitted && submissionDetail && (
                        <div className="submission-info">
                          <h4><i className="fa fa-info-circle"></i> Thông tin bài nộp</h4>
                          <div className="submission-details">
                            <div className="detail-item">
                              <span className="label">Lần nộp:</span>
                              <span className="value">Thứ {submissionDetail.attemptNumber}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Thời gian nộp:</span>
                              <span className="value">{new Date(submissionDetail.submittedAt).toLocaleString('vi-VN')}</span>
                            </div>
                            {submissionDetail.submissionContent && (
                              <div className="detail-item">
                                <span className="label">Nội dung:</span>
                                <span className="value">{submissionDetail.submissionContent}</span>
                              </div>
                            )}
                            {submissionDetail.files && submissionDetail.files.length > 0 && (
                              <div className="detail-item">
                                <span className="label">File đính kèm:</span>
                                <div className="submission-files">
                                  {submissionDetail.files.map((file, index) => {
                                    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.fileName || '');
                                    const isVideo = /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(file.fileName || '');
                                    const isPdf = /\.pdf$/i.test(file.fileName || '');
                                    const isDocument = /\.(doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(file.fileName || '');
                                    
                                    return (
                                      <a 
                                        key={index} 
                                        href={file.fileUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="submission-file"
                                      >
                                        <div className="file-thumbnail">
                                          {isImage ? (
                                            <img 
                                              src={file.fileUrl} 
                                              alt={file.fileName || `File ${index + 1}`}
                                              className="file-image-thumbnail"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleImagePreview(file.fileUrl, file.fileName);
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            />
                                          ) : isVideo ? (
                                            <div className="file-video-thumbnail">
                                              <i className="fa fa-play-circle"></i>
                                            </div>
                                          ) : isPdf ? (
                                            <div className="file-pdf-thumbnail">
                                              <i className="fa fa-file-pdf-o"></i>
                                            </div>
                                          ) : isDocument ? (
                                            <div className="file-doc-thumbnail">
                                              <i className="fa fa-file-text-o"></i>
                                            </div>
                                          ) : (
                                            <div className="file-default-thumbnail">
                                              <i className="fa fa-file-o"></i>
                                            </div>
                                          )}
                                        </div>
                                        <div className="file-info">
                                          <span className="file-name">{file.fileName || `File ${index + 1}`}</span>
                                          <span className="file-type">
                                            {isImage ? 'Hình ảnh' : 
                                             isVideo ? 'Video' : 
                                             isPdf ? 'PDF' : 
                                             isDocument ? 'Tài liệu' : 'File'}
                                          </span>
                                        </div>
                                        <i className="fa fa-external-link"></i>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Điểm số */}
                      <div className="score-section">
                        <h4><i className="fa fa-chart-line"></i> Kết quả</h4>
                        {assignment?.score !== null && assignment?.score !== undefined ? (
                          <>
                            <div className="score-display">
                              <span className="score-value">{assignment.score}/{assignment?.maxScore || 10}</span>
                              <span className="score-label">điểm</span>
                            </div>
                            <div className="score-status">
                              <span className={`status-badge ${assignment.submissionStatus === 'Đã chấm điểm' ? 'graded' : 'pending'}`}>
                                <i className={`fa ${assignment.submissionStatus === 'Đã chấm điểm' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                                {assignment.submissionStatus || 'Đang chờ chấm điểm'}
                              </span>
                            </div>
                            {assignment.submissionStatus === 'Đã chấm điểm' && (
                              <div className="grading-info">
                                <div className="graded-by">
                                  <i className="fa fa-user"></i> Chấm bởi: <span>{assignment.createdByName || 'Giáo viên'}</span>
                                </div>
                                <div className="graded-at">
                                  <i className="fa fa-calendar"></i> Chấm lúc: <span>{assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleString('vi-VN') : 'Chưa có'}</span>
                                </div>
                              </div>
                            )}
                            {/* Nhận xét của giáo viên */}
                            {(submissionDetail?.feedback || assignment?.feedback) && (
                              <div className="teacher-comment">
                                <i className="fa fa-comments"></i> Nhận xét của giáo viên: <span>{submissionDetail?.feedback || assignment?.feedback}</span>
                              </div>
                            )}
                            {!submissionDetail?.feedback && !assignment?.feedback && assignment.submissionStatus === 'Đã chấm điểm' && (
                              <div className="teacher-comment no-feedback">
                                <i className="fa fa-comments"></i> Giáo viên chưa để lại nhận xét
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

        {/* Hiển thị thông báo hoàn thành khóa học nếu tất cả lecture đã hoàn thành */}
        {currentLecture && location.state?.nextLecture?.isCompleted && showCompletionNotice && (
          <div className="course-completion-notice">
            <div className="completion-content">
              <button 
                className="close-completion-btn" 
                onClick={() => setShowCompletionNotice(false)}
                title="Đóng thông báo"
              >
                <i className="fa fa-times" style={{color:'#ed4545', animation:'none', fontSize: '30px'}}></i>
              </button>
              <i className="fa fa-trophy"></i>
              <h3>Chúc mừng!</h3>
              <p>Bạn đã hoàn thành tất cả bài giảng trong khóa học này.</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="image-preview-modal" onClick={closeImagePreview}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-preview-header">
              <h3>{previewImage.name}</h3>
              <button className="close-preview-btn" onClick={closeImagePreview}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="image-preview-body">
              <img 
                src={previewImage.url} 
                alt={previewImage.name}
                className="preview-image"
              />
            </div>
            <div className="image-preview-footer">
              <a 
                href={previewImage.url} 
                target="_blank" 
                rel="noreferrer"
                className="download-btn"
              >
                <i className="fa fa-download"></i> Tải xuống
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContentPage; 