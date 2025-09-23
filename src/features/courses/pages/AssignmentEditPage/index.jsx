import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import teacherCourseApi from 'services/teacherCourseApi';
import assignmentApi from 'services/assignmentApi';
import './style.css';

const AssignmentEditPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectionIdx, setSectionIdx] = useState('');
  const [lectureIdx, setLectureIdx] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    // dueDate: '', // [DISABLED] Tạm bỏ hạn nộp
  });
  const [errors, setErrors] = useState({});

  // ---------------- Fetch data ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, assignmentData] = await Promise.all([
          teacherCourseApi.getDetail(courseId),
          assignmentApi.getDetail(assignmentId),
        ]);
        setCourse(courseData);
        setAssignment(assignmentData);
        // Prefill form
        setForm({
          title: assignmentData.title || '',
          description: assignmentData.description || '',
          // dueDate: assignmentData.dueDate ? assignmentData.dueDate.slice(0, 16) : '', // [DISABLED]
        });
        // Detect section / lecture indices
        if (courseData?.sections) {
          courseData.sections.forEach((sec, sIdx) => {
            sec.lectures.forEach((lec, lIdx) => {
              if (lec.lectureId === assignmentData.lectureId) {
                setSectionIdx(String(sIdx));
                setLectureIdx(String(lIdx));
              }
            });
          });
        }
      } catch (err) {
        console.error(err);
        alert('Không thể tải dữ liệu bài tập hoặc khoá học');
        navigate(`/teacher/course/${courseId}/assignments`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, assignmentId, navigate]);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Reset errors
    setErrors({});
    
    // Validate form
    const newErrors = {};
    
    if (sectionIdx === '' || lectureIdx === '') {
      alert('Vui lòng chọn bài giảng');
      return;
    }
    
    if (!form.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề bài tập';
    }
    
    // [DISABLED] Validate hạn nộp
    // if (!form.dueDate) {
    //   newErrors.dueDate = 'Vui lòng chọn hạn nộp bài tập';
    // } else {
    //   // Kiểm tra hạn nộp không được trong quá khứ
    //   const selectedDate = new Date(form.dueDate);
    //   const now = new Date();
    //   if (selectedDate <= now) {
    //     newErrors.dueDate = 'Hạn nộp phải sau thời gian hiện tại';
    //   }
    // }
    
    // Nếu có lỗi, hiển thị và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const secIdx = parseInt(sectionIdx);
    const lecIdx = parseInt(lectureIdx);
    const targetLecture = course.sections[secIdx].lectures[lecIdx];

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      // dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null, // [DISABLED]
      lectureId: targetLecture.lectureId,
    };

    try {
      await assignmentApi.update(assignmentId, payload);
      alert('Cập nhật bài tập thành công');
      navigate(`/teacher/course/${courseId}/assignments`);
    } catch (error) {
      alert(error.message || 'Đã xảy ra lỗi khi cập nhật bài tập');
    }
  };

  // ---------------- Render ----------------
  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!course || !assignment) return null;

  return (
    <section className="assignment-edit-page">
      <div className="assignment-edit-container">
        <Link to={`/teacher/course/${courseId}/assignments`} className="back-link"><i className="fas fa-arrow-left"></i> Quay lại danh sách bài tập</Link>
        <h2 className="page-title">Chỉnh sửa bài tập</h2>

        {/* Select lecture */}
        <div className="form-group">
          <label>Chọn bài giảng</label>
          <div className="select-row">
            <select value={sectionIdx} onChange={(e) => { setSectionIdx(e.target.value); setLectureIdx(''); }}>
              <option value="">-- Chọn chương --</option>
              {course.sections.map((sec, idx) => (
                <option key={idx} value={idx}>{sec.title}</option>
              ))}
            </select>
            <select value={lectureIdx} onChange={(e) => setLectureIdx(e.target.value)} disabled={sectionIdx === ''}>
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
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea name="description" rows={5} value={form.description} onChange={handleChange}></textarea>
        </div>
        {/* [DISABLED] Nhóm nhập hạn nộp */}
        {/**
        <div className="form-group">
          <label>Hạn nộp <span className="required">*</span></label>
          <input 
            type="datetime-local" 
            name="dueDate" 
            value={form.dueDate} 
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
          {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
        </div>
        */}

        <div style={{ textAlign: 'right' }}>
          <button className="btn primary" onClick={handleSave}>Lưu thay đổi</button>
        </div>
      </div>
    </section>
  );
};

export default AssignmentEditPage; 