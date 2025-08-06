import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import assignmentApi from 'services/assignmentApi';
import teacherCourseApi from 'services/teacherCourseApi';
import './style.css';

const AssignmentCreatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectionIdx, setSectionIdx] = useState('');
  const [lectureIdx, setLectureIdx] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await teacherCourseApi.getDetail(courseId);
        setCourse(data);
      } catch (err) {
        console.error(err);
        alert('Không thể tải dữ liệu khóa học');
        navigate('/teacher/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
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
    // Tạm lấy ID của bài giảng (giả định lecture có thuộc tính id hoặc lectureId)
    const lectureId = targetLecture.lectureId ?? targetLecture.id;
    if (!lectureId) {
      alert('Không thể xác định ID của bài giảng. Vui lòng thử lại.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      lectureId,
    };

    try {
      await assignmentApi.create(payload);
      alert('Tạo bài tập thành công');
      navigate(`/teacher/course/${courseId}/assignments`);
    } catch (error) {
      alert(error.message || 'Đã xảy ra lỗi khi tạo bài tập');
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!course) return null;

  return (
    <section className="assignment-create-page">
      <div className="assignments-create-container">
        <Link to={`/teacher/course/${courseId}/assignments`} className="back-link"><i className="fas fa-arrow-left"></i> Quay lại danh sách bài tập</Link>
        <h2 className="page-title">Tạo bài tập mới</h2>

        {/* Select lecture */}
        <div className="form-group">
          <label>Chọn bài giảng</label>
          <div className="select-row">
            <select value={sectionIdx} onChange={e => { setSectionIdx(e.target.value); setLectureIdx(''); }}>
              <option value="">-- Chọn chương --</option>
              {course.sections?.map((sec, idx) => (
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
        <div className="form-group">
          <label>Hạn nộp</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </div>

        <div style={{textAlign:'right'}}>
          <button className="btn primary" onClick={handleSave}>Lưu bài tập</button>
        </div>
      </div>
    </section>
  );
};

export default AssignmentCreatePage; 