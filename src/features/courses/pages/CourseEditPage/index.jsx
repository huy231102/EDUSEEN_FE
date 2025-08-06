import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './style.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from 'services/api';
import VideoS3Upload from 'components/common/VideoS3Upload';
import ImageS3Upload from 'components/common/ImageS3Upload';

const CourseEditPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isNew = courseId === 'new' || !courseId;
  const [courseData, setCourseData] = useState(null);
  const [categories, setCategories] = useState([]);

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

  const handleSave = async () => {
    if (!courseData?.name?.trim()) {
      alert('Vui lòng nhập tên khoá học');
      return;
    }

    try {
      if (isNew) {
        await api.post('/api/teacher/course', buildPayload());
      } else {
        await api.put(`/api/teacher/course/${courseId}`, buildPayload());
      }
      navigate('/teacher/dashboard');
    } catch (err) {
      console.error(err);
      alert('Không thể lưu khoá học: ' + err.message);
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
      contentType: lectureType,
      contentUrl: lectureType === 'video' ? lectureFile : '',
      duration: 0,
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

  // Xoá Lecture
  const deleteLecture = (sectionIdx, lectureIdx) => {
    const newSections = [...course.sections];
    newSections[sectionIdx].lectures = newSections[sectionIdx].lectures.filter((_, idx) => idx !== lectureIdx);
    setCourse({ ...course, sections: newSections });
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
                            <select value={lectureType} onChange={(e)=>setLectureType(e.target.value)}>
                              <option value="video">Video</option>
                              <option value="text">Text</option>
                            </select>
                            {lectureType === 'video' ? (
                              <VideoS3Upload
                                onUploaded={url => setLectureFile(url)}
                              />
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
                                        lec.contentUrl ? (
                                          <video src={lec.contentUrl} controls width="200" style={{marginTop:4}} />
                                        ) : (
                                          <small className="file-name">Chưa upload video</small>
                                        )
                                      ) : (
                                        <small className="file-name">Text</small>
                                      )}
                                      <button
                                        className="btn small"
                                        style={{ marginLeft: 8, color: '#e74c3c', background: 'none', border: 'none' }}
                                        title="Xoá bài giảng"
                                        onClick={() => deleteLecture(sIdx, lIdx)}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
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