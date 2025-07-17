import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { courses, categories } from 'features/courses/data/courseData';
import './style.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TABS = [
  { id: 'info', label: 'Thông tin & Curriculum' },
  { id: 'reviews', label: 'Reviews' },
];

const CourseEditPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = courseId === 'new' || !courseId;
  const allowedTabs = TABS.map(t => t.id);
  const requestedTab = searchParams.get('tab');
  const initTab = allowedTabs.includes(requestedTab) ? requestedTab : 'info';
  const [selectedTab, setSelectedTab] = useState(initTab);
  const [courseData, setCourseData] = useState(null);

  // -------------------- Save handler --------------------
  const handleSave = () => {
    // Validate tối thiểu tên khoá học
    if (!courseData?.name?.trim()) {
      alert('Vui lòng nhập tên khoá học');
      return;
    }

    if (isNew) {
      // Tính id mới
      const newId = courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
      const newCourse = {
        ...courseData,
        id: newId,
        rating: 0,
        totalLectures: courseData.sections?.reduce((sum, s) => sum + (s.lectures?.length || 0), 0) || 0,
        totalTime: 0,
      };
      courses.push(newCourse);
    } else {
      const idx = courses.findIndex((c) => c.id.toString() === courseId.toString());
      if (idx !== -1) {
        courses[idx] = {
          ...courses[idx],
          ...courseData,
          totalLectures: courseData.sections?.reduce((sum, s) => sum + (s.lectures?.length || 0), 0) || 0,
        };
      }
    }

    // Sau khi lưu, quay lại dashboard
    navigate('/teacher/dashboard');
  };

  useEffect(() => {
    if (!isNew) {
      const found = courses.find((c) => c.id.toString() === courseId);
      if (!found) {
        // Nếu không tìm thấy khoá học -> quay lại dashboard
        navigate('/teacher/dashboard');
      }
      setCourseData(found);
    } else {
      setCourseData({
        name: '',
        subtitle: '',
        description: '',
        categorySlug: '',
        level: 'beginner',
        cover: '',
        introVideo: '',
        sections: [],
        reviews: [],
      });
    }
  }, [courseId, isNew, navigate]);

  if (!courseData) return null;

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'info':
        return (
          <CourseInfoTab course={courseData} setCourse={setCourseData} onSave={handleSave} isNew={isNew} />
        );
      // Curriculum đã gộp vào info
      case 'reviews':
        return <ReviewsTab course={courseData} />;
      default:
        return null;
    }
  };

  return (
    <section className="course-edit-page">
      {/* Back to dashboard */}
      <div className="container">
        <Link to="/teacher/dashboard" className="back-link">
          <i className="fas fa-arrow-left"></i> Quay lại bảng điều khiển
        </Link>
      </div>
      <div className="container edit-container">
        <aside className="sidebar">
          <h2 className="sidebar-title">Khoá học</h2>
          <ul className="tab-list">
            {TABS.map((tab) => (
              <li
                key={tab.id}
                className={selectedTab === tab.id ? 'active' : ''}
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </aside>

        <main className="tab-content">{renderTabContent()}</main>
      </div>
    </section>
  );
};

export default CourseEditPage;

/* -------------------- Sub Components -------------------- */

const CourseInfoTab = ({ course, setCourse, onSave, isNew }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  return (
    <div className="course-info-tab">
      <div className="form-group">
        <label>Tên khoá học</label>
        <input
          type="text"
          name="name"
          value={course.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Mô tả chi tiết</label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          rows={6}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Danh mục</label>
        <select
          name="categorySlug"
          value={course.categorySlug}
          onChange={handleChange}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Cấp độ khóa học</label>
        <select name="level" value={course.level} onChange={handleChange}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="form-group">
        <label>Ảnh bìa</label>
        <input
          type="text"
          placeholder="URL ảnh bìa hoặc tải lên sau"
          name="cover"
          value={course.cover}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Video giới thiệu (YouTube URL hoặc Upload)</label>
        <input
          type="text"
          name="introVideo"
          placeholder="Hoặc dán link YouTube ở đây"
          value={course.introVideo || ''}
          onChange={handleChange}
        />
        <input type="file" accept="video/*" onChange={(e)=>setCourse({...course, introVideoFile: e.target.files[0]})} style={{marginTop:'8px'}} />
      </div>

      {/* Curriculum Builder */}
      <h3 style={{marginTop:'30px'}}>Chương trình học</h3>
      <CurriculumBuilder course={course} setCourse={setCourse} />
      {/* Nút lưu */}
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <button className="btn primary" onClick={onSave}>{isNew ? 'Tạo khoá học' : 'Lưu thay đổi'}</button>
      </div>
    </div>
  );
};

/* ---------- Curriculum Builder (drag & drop) ---------- */

const CurriculumBuilder = ({ course, setCourse }) => {
  const [sectionTitle, setSectionTitle] = useState('');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureType, setLectureType] = useState('video');
  const [lectureText, setLectureText] = useState('');
  const [lectureFile, setLectureFile] = useState(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(null);

  // Thêm Section mới
  const addSection = () => {
    if (!sectionTitle.trim()) return;
    const newCourse = {
      ...course,
      sections: [
        ...course.sections,
        { title: sectionTitle.trim(), lectures: [] },
      ],
    };
    setCourse(newCourse);
    setSectionTitle('');
  };

  // Thêm Lecture vào một Section
  const addLecture = (sectionIdx) => {
    if (!lectureTitle.trim()) return;
    const newSections = [...course.sections];
    if (lectureType === 'video' && !lectureFile) {
      alert('Vui lòng chọn file video');
      return;
    }
    const lectureObj = {
      title: lectureTitle.trim(),
      contentType: lectureType,
      contentUrl: '',
      duration: 0,
      file: lectureType === 'video' ? lectureFile : null,
      text: lectureType === 'text' ? lectureText : '',
    };
    newSections[sectionIdx].lectures.push(lectureObj);
    setCourse({ ...course, sections: newSections });
    setLectureTitle('');
    setLectureType('video');
    setLectureText('');
    setLectureFile(null);
    setActiveSectionIdx(null);
  };

  // Xử lý drag & drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === 'section') {
      const newSections = Array.from(course.sections);
      const [moved] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, moved);
      setCourse({ ...course, sections: newSections });
    } else if (type === 'lecture') {
      const sourceSectionIdx = parseInt(source.droppableId.replace('section-', ''));
      const destSectionIdx = parseInt(destination.droppableId.replace('section-', ''));
      const newSections = Array.from(course.sections);

      const [moved] = newSections[sourceSectionIdx].lectures.splice(source.index, 1);
      newSections[destSectionIdx].lectures.splice(destination.index, 0, moved);
      setCourse({ ...course, sections: newSections });
    }
  };

  const handleFileUpload = (sectionIdx, lectureIdx, file) => {
    const newSections = [...course.sections];
    newSections[sectionIdx].lectures[lectureIdx].file = file;
    setCourse({ ...course, sections: newSections });
  };

  return (
    <div className="curriculum-builder">
      <div className="add-section">
        <input
          type="text"
          placeholder="Tên chương mới..."
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
        <button className="btn primary" onClick={addSection}>Thêm chương</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-sections" type="section">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="sections-list">
              {course.sections.map((section, sIdx) => (
                <Draggable key={`section-${sIdx}`} draggableId={`section-${sIdx}`} index={sIdx}>
                  {(sectionProvided) => (
                    <div
                      className="section-item"
                      ref={sectionProvided.innerRef}
                      {...sectionProvided.draggableProps}
                    >
                      <div className="section-header" {...sectionProvided.dragHandleProps}>
                        <h4>{section.title}</h4>
                      </div>

                      {/* Add Lecture input */}
                      {activeSectionIdx === sIdx ? (
                        <div className="add-lecture">
                          <div className="add-lecture-grid">
                            <input
                              type="text"
                              placeholder="Tên bài giảng..."
                              value={lectureTitle}
                              onChange={(e) => setLectureTitle(e.target.value)}
                            />
                            <select value={lectureType} onChange={(e)=>setLectureType(e.target.value)}>
                              <option value="video">Video</option>
                              <option value="text">Text</option>
                            </select>
                            {lectureType === 'video' ? (
                              <input type="file" accept="video/*" onChange={(e)=>setLectureFile(e.target.files[0])} />
                            ) : (
                              <textarea placeholder="Nội dung bài giảng" value={lectureText} onChange={(e)=>setLectureText(e.target.value)} rows={3}></textarea>
                            )}
                            <button className="btn primary" onClick={() => addLecture(sIdx)}>Thêm bài</button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn small" onClick={() => setActiveSectionIdx(sIdx)}>+ Thêm bài giảng</button>
                      )}

                      {/* Lectures list */}
                      <Droppable droppableId={`section-${sIdx}`} type="lecture">
                        {(lecProvided) => (
                          <div ref={lecProvided.innerRef} {...lecProvided.droppableProps} className="lectures-list">
                            {section.lectures.map((lec, lIdx) => (
                              <Draggable key={`lecture-${sIdx}-${lIdx}`} draggableId={`lecture-${sIdx}-${lIdx}`} index={lIdx}>
                                {(lecDragProvided) => (
                                  <div
                                    className="lecture-item"
                                    ref={lecDragProvided.innerRef}
                                    {...lecDragProvided.draggableProps}
                                    {...lecDragProvided.dragHandleProps}
                                  >
                                    <div className="lecture-content">
                                      <span>{lec.title}</span>
                                      {lec.contentType === 'video' ? (
                                        lec.file ? (
                                          <small className="file-name">{lec.file.name}</small>
                                        ) : (
                                          <label className="upload-btn">
                                            <input type="file" accept="video/*" style={{display:'none'}} onChange={(e)=>handleFileUpload(sIdx, lIdx, e.target.files[0])} />
                                            <i className="fas fa-upload"></i> Upload video
                                          </label>
                                        )
                                      ) : (
                                        <small className="file-name">Text</small>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {lecProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

/* ---------- Reviews Tab ---------- */

const ReviewsTab = ({ course }) => {
  const [filter, setFilter] = useState('all');
  const [replyTexts, setReplyTexts] = useState({});
  const [localReviews, setLocalReviews] = useState(course.reviews || []);

  const filtered = localReviews.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'unreplied') return !r.teacherReply;
    const star = parseInt(filter);
    return r.rating === star;
  });

  const handleReplyChange = (id, text) => {
    setReplyTexts({ ...replyTexts, [id]: text });
  };

  const sendReply = (id) => {
    // ở đây chỉ mock, thực tế sẽ gọi API
    const text = replyTexts[id];
    if (!text?.trim()) return;
    const updated = localReviews.map((r) =>
      r.id === id ? { ...r, teacherReply: text.trim() } : r
    );
    setLocalReviews(updated);
    setReplyTexts({ ...replyTexts, [id]: '' });
  };

  return (
    <div className="reviews-tab">
      <div className="review-filter">
        <label>Lọc: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
          <option value="unreplied">Chưa phản hồi</option>
        </select>
      </div>

      {filtered.length === 0 && <p>Không có đánh giá phù hợp.</p>}

      {filtered.map((r) => (
        <div key={r.id} className="review-item">
          <div className="review-header">
            <div>
              <strong>{r.name}</strong> • <span className="review-date">{r.date || '---'}</span>
            </div>
            <span>{renderStars(r.rating)}</span>
          </div>
          <p className="review-content">{r.desc}</p>

          {/* Reply list */}
          <div className="review-conversation">
            {r.teacherReply && (
              <div className="comment-item teacher">
                <div className="comment-avatar"><i className="fa fa-chalkboard-teacher"></i></div>
                <div className="comment-content">
                  <span className="comment-author">Giáo viên</span>
                  <p className="comment-text">{r.teacherReply}</p>
                </div>
              </div>
            )}
          </div>

          {!r.teacherReply && (
            <div className="reply-box">
              <div className="reply-input-wrapper">
                <textarea
                  rows={2}
                  placeholder="Phản hồi của bạn..."
                  value={replyTexts[r.id] || ''}
                  onChange={(e) => handleReplyChange(r.id, e.target.value)}
                ></textarea>
                <button
                  className="reply-send-btn"
                  onClick={() => sendReply(r.id)}
                  disabled={!replyTexts[r.id]?.trim()}
                >
                  <i className="fa fa-paper-plane"></i> Gửi
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderStars = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) stars.push(<i key={`f${i}`} className="fas fa-star" />);
  if (half) stars.push(<i key="half" className="fas fa-star-half-alt" />);
  for (let i = stars.length; i < 5; i++) stars.push(<i key={`e${i}`} className="far fa-star" />);
  return stars;
}; 