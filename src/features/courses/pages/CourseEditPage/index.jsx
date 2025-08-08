import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { categories } from 'features/courses/data/courseData';
import './style.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from 'services/api';
import VideoS3Upload from 'components/common/VideoS3Upload';
import ImageS3Upload from 'components/common/ImageS3Upload';
import { useToast } from 'components/common/Toast';

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
  const [categories, setCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const { showToast } = useToast();

  // Lấy danh sách category từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/category');
        setCategories(res);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // -------------------- Save handler --------------------
  const buildPayload = () => {
    const sanitize = (str) => (str === undefined ? null : str);
    return {
      title: courseData.name,
      description: sanitize(courseData.description),
      categoryId: courseData.categoryId ? Number(courseData.categoryId) : null, // SỬA DÒNG NÀY
      level: sanitize(courseData.level),
      cover: courseData.cover, // Thêm trường cover
      sections: (courseData.sections || []).map((s, idx) => ({
        sectionId: s.sectionId,
        title: s.title,
        order: s.order ?? idx + 1,
        lectures: (s.lectures || []).map((l, lidx) => ({
          lectureId: l.lectureId,
          title: l.title,
          contentType: l.contentType || 'video',
          contentUrl: l.contentUrl || '',
          duration: l.duration || 0,
          order: l.order ?? lidx + 1,
          assignmentId: l.assignmentId || null
        })),
      })),
    };
  };

  // Validation function
  const validateCourseData = () => {
    const errors = [];
    const fieldErrors = {};
    
    if (!courseData?.name?.trim()) {
      errors.push('Tên khóa học là bắt buộc');
      fieldErrors.name = 'Tên khóa học là bắt buộc';
    }
    
    if (!courseData?.description?.trim()) {
      errors.push('Mô tả khóa học là bắt buộc');
      fieldErrors.description = 'Mô tả khóa học là bắt buộc';
    }
    
         if (!courseData?.categoryId) {
       errors.push('Danh mục khóa học là bắt buộc');
       fieldErrors.categoryId = 'Danh mục khóa học là bắt buộc';
     }
     
     if (!courseData?.level) {
       errors.push('Cấp độ khóa học là bắt buộc');
       fieldErrors.level = 'Cấp độ khóa học là bắt buộc';
     }
    
    if (!courseData?.cover) {
      errors.push('Ảnh bìa khóa học là bắt buộc');
      fieldErrors.cover = 'Ảnh bìa khóa học là bắt buộc';
    }
    
    if (!courseData?.sections || courseData.sections.length === 0) {
      errors.push('Khóa học phải có ít nhất 1 chương');
      fieldErrors.sections = 'Khóa học phải có ít nhất 1 chương';
    } else {
      // Kiểm tra từng section và lecture
      courseData.sections.forEach((section, sectionIdx) => {
        if (!section.title?.trim()) {
          errors.push(`Chương ${sectionIdx + 1}: Tên chương là bắt buộc`);
        }
        
        if (!section.lectures || section.lectures.length === 0) {
          errors.push(`Chương ${sectionIdx + 1}: Phải có ít nhất 1 bài giảng`);
        } else {
          section.lectures.forEach((lecture, lectureIdx) => {
            if (!lecture.title?.trim()) {
              errors.push(`Chương ${sectionIdx + 1} - Bài ${lectureIdx + 1}: Tên bài giảng là bắt buộc`);
            }
            
            if (lecture.contentType === 'video' && !lecture.contentUrl) {
              errors.push(`Chương ${sectionIdx + 1} - Bài ${lectureIdx + 1}: Video là bắt buộc`);
            }
          });
        }
      });
    }
    
    setValidationErrors(fieldErrors);
    return errors;
  };

  const showToastMessage = (message, type = 'success') => {
    showToast(message, type, 3000);
  };

  const handleSave = async () => {
    const validationErrors = validateCourseData();
    
    if (validationErrors.length > 0) {
      showToastMessage(validationErrors.join('\n'), 'error');
      return;
    }

    if (isNew) {
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn tạo khóa học này?');
      if (!isConfirmed) return;
    }

    try {
      if (isNew) {
        await api.post('/api/teacher/course', buildPayload());
        showToastMessage('Khóa học đã được tạo thành công!', 'success');
        setTimeout(() => navigate('/teacher/dashboard'), 1500);
      } else {
        await api.put(`/api/teacher/course/${courseId}`, buildPayload());
        showToastMessage('Khóa học đã được cập nhật thành công!', 'success');
        setTimeout(() => navigate('/teacher/dashboard'), 1500);
      }
    } catch (err) {
      console.error(err);
      showToastMessage('Không thể lưu khóa học: ' + err.message, 'error');
    }
  };

  useEffect(() => {
    if (!isNew) {
      const fetchCourse = async () => {
        try {
          const c = await api.get(`/api/teacher/course/${courseId}`);
                     const mapped = {
             name: c.title,
             description: c.description || '',
             categoryId: c.categoryId,
             level: c.level || '',
             cover: c.cover || '', // Thêm dòng này để map cover từ API
            sections: (c.sections || []).map(s => ({
              sectionId: s.sectionId,
              title: s.title,
              order: s.order,
              lectures: (s.lectures || []).map(l => ({
                lectureId: l.lectureId,
                title: l.title,
                contentType: l.contentType,
                contentUrl: l.contentUrl,
                duration: l.duration,
                order: l.order,
                assignmentId: l.assignmentId || null
              }))
            })),
          };
          setCourseData(mapped);
        } catch (err) {
          console.error(err);
          navigate('/teacher/dashboard');
        }
      };
      fetchCourse();
         } else {
       setCourseData({
         name: '',
         subtitle: '',
         description: '',
         categorySlug: '',
         level: '',
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
          <CourseInfoTab 
            course={courseData} 
            setCourse={setCourseData} 
            onSave={handleSave} 
            isNew={isNew} 
            categories={categories}
            validationErrors={validationErrors}
          />
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
      
      {/* Toast Notification sẽ được render bởi ToastProvider */}
    </section>
  );
};

export default CourseEditPage;

/* -------------------- Sub Components -------------------- */

const CourseInfoTab = ({ course, setCourse, onSave, isNew, categories, validationErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  return (
    <div className="course-info-tab">
      <div className="form-group">
        <label>
          Tên khoá học <span className="required">*</span>
          <span className="tooltip" title="Tên khóa học là bắt buộc và phải có ít nhất 3 ký tự">
            <i className="fas fa-info-circle"></i>
          </span>
        </label>
                 <input
           type="text"
           name="name"
           value={course.name}
           onChange={handleChange}
           placeholder="Nhập tên khóa học..."
           className={validationErrors.name ? 'error' : ''}
         />
         {validationErrors.name && (
           <small className="error-message">{validationErrors.name}</small>
         )}
      </div>
      <div className="form-group">
        <label>
          Mô tả chi tiết <span className="required">*</span>
          <span className="tooltip" title="Mô tả khóa học là bắt buộc và phải có ít nhất 10 ký tự">
            <i className="fas fa-info-circle"></i>
          </span>
        </label>
                 <textarea
           name="description"
           value={course.description}
           onChange={handleChange}
           rows={6}
           placeholder="Nhập mô tả chi tiết về khóa học..."
           className={validationErrors.description ? 'error' : ''}
         ></textarea>
         {validationErrors.description && (
           <small className="error-message">{validationErrors.description}</small>
         )}
      </div>
      <div className="form-group">
        <label>
          Danh mục <span className="required">*</span>
          <span className="tooltip" title="Danh mục khóa học là bắt buộc">
            <i className="fas fa-info-circle"></i>
          </span>
        </label>
                          <select
           name="categoryId"
           value={course.categoryId || ''}
           onChange={handleChange}
           className={validationErrors.categoryId ? 'error' : ''}
         >
           <option value="" disabled>-- Chọn danh mục --</option>
           {categories.map((cat) => (
             <option key={cat.id} value={cat.id}>
               {cat.name}
             </option>
           ))}
         </select>
         {validationErrors.categoryId && (
           <small className="error-message">{validationErrors.categoryId}</small>
         )}
       </div>
             <div className="form-group">
         <label>
           Cấp độ khóa học <span className="required">*</span>
           <span className="tooltip" title="Cấp độ khóa học là bắt buộc">
             <i className="fas fa-info-circle"></i>
           </span>
         </label>
         <select 
           name="level" 
           value={course.level || ''} 
           onChange={handleChange}
           className={validationErrors.level ? 'error' : ''}
         >
           <option value="" disabled>-- Chọn cấp độ --</option>
           <option value="beginner">Beginner</option>
           <option value="intermediate">Intermediate</option>
           <option value="advanced">Advanced</option>
         </select>
         {validationErrors.level && (
           <small className="error-message">{validationErrors.level}</small>
         )}
       </div>
      <div className="form-group">
        <label>
          Ảnh bìa khoá học <span className="required">*</span>
          <span className="tooltip" title="Ảnh bìa khóa học là bắt buộc">
            <i className="fas fa-info-circle"></i>
          </span>
        </label>
                 <ImageS3Upload
           defaultUrl={course.cover}
           onUploaded={url => setCourse({ ...course, cover: url })}
         />
         {validationErrors.cover && (
           <small className="error-message">{validationErrors.cover}</small>
         )}
      </div>
      {/* Curriculum Builder */}
             <h3 style={{marginTop:'30px'}}>
         Chương trình học <span className="required">*</span>
         <span className="tooltip" title="Khóa học phải có ít nhất 1 chương và mỗi chương phải có ít nhất 1 bài giảng">
           <i className="fas fa-info-circle"></i>
         </span>
       </h3>
       {validationErrors.sections && (
         <small className="error-message" style={{display: 'block', marginBottom: '10px'}}>{validationErrors.sections}</small>
       )}
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
  const [editingLecture, setEditingLecture] = useState(null); // {sectionIdx, lectureIdx}
  const [originalLectureData, setOriginalLectureData] = useState(null); // Lưu dữ liệu ban đầu để có thể khôi phục

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

  // Xoá Section
  const deleteSection = (sectionIdx) => {
    const newSections = course.sections.filter((_, idx) => idx !== sectionIdx);
    setCourse({ ...course, sections: newSections });
  };

  // Thêm Lecture vào một Section
  const addLecture = (sectionIdx) => {
    if (!lectureTitle.trim()) return;
    const newSections = [...course.sections];
    if (lectureType === 'video' && !lectureFile) {
      alert('Vui lòng upload video');
      return;
    }
    const lectureObj = {
      title: lectureTitle.trim(),
      contentType: 'video',
      contentUrl: lectureFile,
      duration: 0,
    };
    newSections[sectionIdx].lectures.push(lectureObj);
    setCourse({ ...course, sections: newSections });
    setLectureTitle('');
    setLectureFile(null);
    setActiveSectionIdx(null);
  };

  // Xoá Lecture
  const deleteLecture = (sectionIdx, lectureIdx) => {
    const newSections = [...course.sections];
    newSections[sectionIdx].lectures = newSections[sectionIdx].lectures.filter((_, idx) => idx !== lectureIdx);
    setCourse({ ...course, sections: newSections });
  };

  // Cập nhật Lecture
  const updateLecture = (sectionIdx, lectureIdx, updatedLecture) => {
    const newSections = [...course.sections];
    newSections[sectionIdx].lectures[lectureIdx] = { ...newSections[sectionIdx].lectures[lectureIdx], ...updatedLecture };
    setCourse({ ...course, sections: newSections });
    // Không tự động đóng form chỉnh sửa nữa
  };

  // Bắt đầu chỉnh sửa lecture
  const startEditingLecture = (sectionIdx, lectureIdx) => {
    const lecture = course.sections[sectionIdx].lectures[lectureIdx];
    setOriginalLectureData({ ...lecture }); // Lưu dữ liệu ban đầu
    setEditingLecture({ sectionIdx, lectureIdx });
  };

  // Hoàn thành chỉnh sửa
  const finishEditingLecture = () => {
    setEditingLecture(null);
    setOriginalLectureData(null);
  };

  // Hủy chỉnh sửa và khôi phục dữ liệu ban đầu
  const cancelEditingLecture = () => {
    if (originalLectureData && editingLecture) {
      const { sectionIdx, lectureIdx } = editingLecture;
      const newSections = [...course.sections];
      newSections[sectionIdx].lectures[lectureIdx] = { ...originalLectureData };
      setCourse({ ...course, sections: newSections });
    }
    setEditingLecture(null);
    setOriginalLectureData(null);
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
        <button className="btn primary" onClick={addSection} disabled={!sectionTitle.trim()}>
          Thêm chương
        </button>
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
                        <button
                          className="btn small"
                          style={{ marginLeft: 8, color: '#e74c3c', background: 'none', border: 'none' }}
                          title="Xoá chương"
                          onClick={() => deleteSection(sIdx)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
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
                            <select value={lectureType} disabled>
                              <option value="video">Video</option>
                            </select>
                            {lectureType === 'video' ? (
                              <VideoS3Upload
                                onUploaded={url => setLectureFile(url)}
                              />
                            ) : (
                              <textarea placeholder="Nội dung bài giảng" value={lectureText} onChange={(e)=>setLectureText(e.target.value)} rows={3}></textarea>
                            )}
                                                         <button 
                               className="btn primary" 
                               onClick={() => addLecture(sIdx)}
                               disabled={!lectureTitle.trim() || !lectureFile}
                             >
                               Thêm bài
                             </button>
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
                                      {editingLecture && editingLecture.sectionIdx === sIdx && editingLecture.lectureIdx === lIdx ? (
                                        // Chế độ chỉnh sửa
                                        <div className="edit-lecture-form">
                                          <input
                                            type="text"
                                            value={lec.title}
                                            onChange={(e) => updateLecture(sIdx, lIdx, { title: e.target.value })}
                                            style={{ marginBottom: '8px', width: '100%' }}
                                          />
                                          <div>
                                            {lec.contentUrl && (
                                              <video src={lec.contentUrl} controls width="200" style={{marginBottom: '8px'}} />
                                            )}
                                            <VideoS3Upload
                                              onUploaded={url => updateLecture(sIdx, lIdx, { contentUrl: url })}
                                            />
                                            <small style={{display: 'block', marginTop: '4px'}}>Upload video mới để thay thế</small>
                                          </div>
                                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                            <button 
                                              className="btn small primary" 
                                              onClick={finishEditingLecture}
                                            >
                                              Hoàn thành
                                            </button>
                                            <button 
                                              className="btn small" 
                                              onClick={cancelEditingLecture}
                                            >
                                              Hủy
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        // Chế độ xem
                                        <>
                                          <span>{lec.title}</span>
                                          {lec.contentUrl ? (
                                            <video src={lec.contentUrl} controls width="200" style={{marginTop:4}} />
                                          ) : (
                                            <small className="file-name">Chưa upload video</small>
                                          )}
                                          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                            <button
                                              className="btn small"
                                              style={{ color: '#1eb2a6', background: 'none', border: 'none' }}
                                              title="Chỉnh sửa bài giảng"
                                              onClick={() => startEditingLecture(sIdx, lIdx)}
                                            >
                                              <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                              className="btn small"
                                              style={{ color: '#e74c3c', background: 'none', border: 'none' }}
                                              title="Xoá bài giảng"
                                              onClick={() => deleteLecture(sIdx, lIdx)}
                                            >
                                              <i className="fas fa-trash"></i>
                                            </button>
                                          </div>
                                        </>
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