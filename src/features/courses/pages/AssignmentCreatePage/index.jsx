import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courses } from 'features/courses/data/courseData';
import './style.css';

const AssignmentCreatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sectionIdx, setSectionIdx] = useState('');
  const [lectureIdx, setLectureIdx] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 10,
  });

  useEffect(() => {
    const found = courses.find(c => c.id.toString() === courseId);
    if (!found) {
      navigate('/teacher/dashboard');
      return;
    }
    setCourse(found);
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (sectionIdx === '' || lectureIdx === '') {
      alert('Vui lòng chọn bài giảng');
      return;
    }
    if (!form.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài tập');
      return;
    }
    const secIdx = parseInt(sectionIdx);
    const lecIdx = parseInt(lectureIdx);
    const targetLecture = course.sections[secIdx].lectures[lecIdx];
    if (targetLecture.assignment) {
      if (!window.confirm('Bài giảng này đã có bài tập. Ghi đè?')) return;
    }
    const newId = Date.now();
    const assignmentObj = {
      id: newId,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      maxScore: parseInt(form.maxScore) || 10,
      submissions: [],
      comments: [],
      score: null,
      attachments: [],
    };
    // update data in-place
    targetLecture.assignment = assignmentObj;
    // reflect to courseData (since course is reference)
    navigate(`/teacher/course/${courseId}/assignments`);
  };

  if (!course) return null;

  return (
    <section className="assignment-create-page">
      <div className="container">
        <Link to={`/teacher/course/${courseId}/assignments`} className="back-link"><i className="fas fa-arrow-left"></i> Quay lại danh sách bài tập</Link>
        <h2 className="page-title">Tạo bài tập mới</h2>

        {/* Select lecture */}
        <div className="form-group">
          <label>Chọn bài giảng</label>
          <div className="select-row">
            <select value={sectionIdx} onChange={e => { setSectionIdx(e.target.value); setLectureIdx(''); }}>
              <option value="">-- Chọn chương --</option>
              {course.sections.map((sec, idx) => (
                <option key={idx} value={idx}>{sec.title}</option>
              ))}
            </select>
            <select value={lectureIdx} onChange={e => setLectureIdx(e.target.value)} disabled={sectionIdx === ''}>
              <option value="">-- Chọn bài giảng --</option>
              {sectionIdx !== '' && course.sections[sectionIdx].lectures.map((lec, idx) => (
                <option key={idx} value={idx}>{lec.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Form fields */}
        <div className="form-group">
          <label>Tiêu đề bài tập</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea name="description" rows={5} value={form.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group inline">
          <div>
            <label>Hạn nộp</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          </div>
          <div>
            <label>Điểm tối đa</label>
            <input type="number" name="maxScore" value={form.maxScore} onChange={handleChange} min={1} />
          </div>
        </div>

        <div style={{textAlign:'right'}}>
          <button className="btn primary" onClick={handleSave}>Lưu bài tập</button>
        </div>
      </div>
    </section>
  );
};

export default AssignmentCreatePage; 