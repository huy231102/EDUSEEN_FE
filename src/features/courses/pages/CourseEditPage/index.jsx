import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './style.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from 'services/api';
import VideoS3Upload from 'components/common/VideoS3Upload';
import ImageS3Upload from 'components/common/ImageS3Upload';
import { useToast } from 'components/common/Toast';

const CourseEditPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isNew = courseId === 'new' || !courseId;
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
      categoryId: courseData.categoryId ? Number(courseData.categoryId) : null,
      level: sanitize(courseData.level),
      cover: courseData.cover,
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
            level: c.level || 'beginner',
            cover: c.cover || '',
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
        level: 'beginner',
        cover: '',
        introVideo: '',
        sections: [],
      });
    }
  }, [courseId, isNew, navigate]);

  if (!courseData) return null;

  return (
    <section className="course-edit-page">
      <div className="container edit-container">
        <Link to="/teacher/dashboard" className="back-link">
          <i className="fas fa-arrow-left"></i> Quay lại bảng điều khiển
        </Link>
        <div className="edit-content">
          <div className="page-header">
            <h2>{isNew ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}</h2>
          </div>

          <div className="course-info-form">
            <div className="form-group">
              <label>Tên khoá học</label>
              <input
                type="text"
                name="name"
                value={courseData.name}
                onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label>Mô tả chi tiết</label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                rows={6}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Danh mục</label>
              <select
                name="categoryId"
                value={courseData.categoryId || ''}
                onChange={(e) => setCourseData({ ...courseData, categoryId: e.target.value })}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Cấp độ khóa học</label>
              <select 
                name="level" 
                value={courseData.level} 
                onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Ảnh bìa khoá học</label>
              <ImageS3Upload
                defaultUrl={courseData.cover}
                onUploaded={url => setCourseData({ ...courseData, cover: url })}
              />
            </div>
            
            {/* Curriculum Builder */}
            <h3 style={{marginTop:'30px', marginBottom:'8px'}}>Chương trình học</h3>
            <CurriculumBuilder course={courseData} setCourse={setCourseData} />
            
            {/* Nút lưu */}
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button className="btn primary" onClick={handleSave}>
                {isNew ? 'Tạo khoá học' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseEditPage;

/* ---------- Curriculum Builder (drag & drop) ---------- */

const CurriculumBuilder = ({ course, setCourse }) => {
  const [sectionTitle, setSectionTitle] = useState('');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureType, setLectureType] = useState('video');
  const [lectureText, setLectureText] = useState('');
  const [lectureFiles, setLectureFiles] = useState({}); // Lưu file cho từng section: {sectionIdx: fileUrl}
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
    // Xóa file video tương ứng với section này
    setLectureFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[sectionIdx];
      return newFiles;
    });
  };

  // Thêm Lecture vào một Section
  const addLecture = (sectionIdx) => {
    if (!lectureTitle.trim()) return;
    const newSections = [...course.sections];
    const currentFile = lectureFiles[sectionIdx];
    if (lectureType === 'video' && !currentFile) {
      alert('Vui lòng upload video');
      return;
    }
    const lectureObj = {
      title: lectureTitle.trim(),
      contentType: 'video',
      contentUrl: currentFile,
      duration: 0,
    };
    newSections[sectionIdx].lectures.push(lectureObj);
    setCourse({ ...course, sections: newSections });
    setLectureTitle('');
    // Xóa file đã sử dụng cho section này
    setLectureFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[sectionIdx];
      return newFiles;
    });
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
                               <div>
                                 <VideoS3Upload
                                   onUploaded={url => setLectureFiles(prev => ({ ...prev, [sIdx]: url }))}
                                 />
                                 {lectureFiles[sIdx] && (
                                   <div style={{ marginTop: '8px' }}>
                                     <video src={lectureFiles[sIdx]} controls width="200" />
                                     <small style={{ display: 'block', marginTop: '4px', color: '#28a745' }}>
                                       ✓ Video đã upload thành công
                                     </small>
                                   </div>
                                 )}
                               </div>
                             ) : (
                               <textarea placeholder="Nội dung bài giảng" value={lectureText} onChange={(e)=>setLectureText(e.target.value)} rows={3}></textarea>
                             )}
                                                           <div className="button-group">
                                <button 
                                  className="btn primary" 
                                  onClick={() => addLecture(sIdx)}
                                  disabled={!lectureTitle.trim() || !lectureFiles[sIdx]}
                                >
                                  <i className="fas fa-plus"></i>
                                  Thêm bài
                                </button>
                                <button 
                                  className="btn small" 
                                  onClick={() => {
                                    setActiveSectionIdx(null);
                                    setLectureTitle('');
                                    // Không xóa file video khi hủy, chỉ đóng form
                                  }}
                                >
                                  <i className="fas fa-times"></i>
                                  Hủy
                                </button>
                              </div>
                           </div>
                         </div>
                       ) : (
                         <div>
                           <button className="btn small" onClick={() => setActiveSectionIdx(sIdx)}>+ Thêm bài giảng</button>
                                                       {/* Hiển thị video đã upload nhưng chưa thêm bài */}
                            {lectureFiles[sIdx] && (
                              <div className="video-preview-container">
                                <div className="preview-header">
                                  <i className="fas fa-check-circle"></i>
                                  Video đã upload (chưa thêm bài)
                                </div>
                                <video src={lectureFiles[sIdx]} controls width="200" />
                                <div className="preview-actions">
                                  <button 
                                    className="btn small continue" 
                                    onClick={() => setActiveSectionIdx(sIdx)}
                                  >
                                    <i className="fas fa-plus"></i>
                                    Tiếp tục thêm bài
                                  </button>
                                  <button 
                                    className="btn small delete" 
                                    onClick={() => {
                                      setLectureFiles(prev => {
                                        const newFiles = { ...prev };
                                        delete newFiles[sIdx];
                                        return newFiles;
                                      });
                                    }}
                                  >
                                    <i className="fas fa-trash"></i>
                                    Xóa video
                                  </button>
                                </div>
                              </div>
                            )}
                         </div>
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
                                            placeholder="Tên bài giảng..."
                                          />
                                          <div>
                                            {lec.contentUrl && (
                                              <video src={lec.contentUrl} controls width="200" />
                                            )}
                                            <VideoS3Upload
                                              onUploaded={url => updateLecture(sIdx, lIdx, { contentUrl: url })}
                                            />
                                            <small style={{display: 'block', marginTop: '8px', color: '#666'}}>
                                              <i className="fas fa-info-circle"></i> Upload video mới để thay thế
                                            </small>
                                          </div>
                                          <div className="edit-actions">
                                            <button 
                                              className="btn small primary" 
                                              onClick={finishEditingLecture}
                                            >
                                              <i className="fas fa-check"></i>
                                              Hoàn thành
                                            </button>
                                            <button 
                                              className="btn small" 
                                              onClick={cancelEditingLecture}
                                            >
                                              <i className="fas fa-times"></i>
                                              Hủy
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        // Chế độ xem
                                        <div className="lecture-info">
                                          <span>{lec.title}</span>
                                          {lec.contentUrl ? (
                                            <video src={lec.contentUrl} controls width="200" />
                                          ) : (
                                            <small className="file-name">
                                              <i className="fas fa-exclamation-triangle"></i> Chưa upload video
                                            </small>
                                          )}
                                          <div className="lecture-actions">
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
                                        </div>
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