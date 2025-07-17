import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courses } from 'features/courses/data/courseData';
import './style.css';

const AssignmentGradingPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const foundCourse = courses.find(c => c.id.toString() === courseId);
    if (!foundCourse) {
      navigate('/teacher/dashboard');
      return;
    }
    setCourse(foundCourse);

    let foundAssignment = null;
    foundCourse.sections.forEach(sec => {
      sec.lectures.forEach(lec => {
        if (lec.assignment && lec.assignment.id.toString() === assignmentId) {
          foundAssignment = lec.assignment;
        }
      });
    });

    if (!foundAssignment) {
      navigate(`/teacher/course/${courseId}/assignments`);
      return;
    }

    // If submissions empty -> mock 10 submissions
    if (!foundAssignment.submissions || !foundAssignment.submissions.length) {
      const mocks = Array.from({ length: 10 }).map((_, idx) => ({
        studentId: idx + 1,
        studentName: `Học viên ${idx + 1}`,
        file: {
          name: `submission_${idx + 1}.pdf`,
          url: '#',
          type: 'pdf',
        },
        score: null,
        feedback: '',
      }));
      foundAssignment.submissions = mocks;
    }

    // Sort submissions: ungraded first
    const sorted = [...foundAssignment.submissions].sort((a, b) => {
      if (a.score == null && b.score != null) return -1;
      if (a.score != null && b.score == null) return 1;
      return 0;
    });
    setAssignment(foundAssignment);
    setSubmissions(sorted);
    setSelectedIdx(0);
  }, [courseId, assignmentId, navigate]);

  useEffect(() => {
    if (submissions.length) {
      const sub = submissions[selectedIdx];
      setScore(sub.score ?? '');
      setFeedback(sub.feedback ?? '');
    }
  }, [selectedIdx, submissions]);

  const handleSave = () => {
    const updated = [...submissions];
    updated[selectedIdx] = {
      ...updated[selectedIdx],
      score: score === '' ? null : Number(score),
      feedback: feedback.trim(),
    };
    setSubmissions(updated);

    // find next ungraded
    const nextIdx = updated.findIndex((s, idx) => s.score == null && idx > selectedIdx);
    if (nextIdx !== -1) {
      setSelectedIdx(nextIdx);
    } else {
      alert('Đã chấm xong tất cả bài!');
    }
  };

  if (!assignment) return null;

  const current = submissions[selectedIdx];

  const renderViewer = () => {
    if (!current.file?.url || current.file.url === '#') {
      return <p className="no-file">Chưa có tệp đính kèm hoặc định dạng không hỗ trợ.</p>;
    }
    if (current.file.type === 'pdf') {
      return (
        <object data={current.file.url} type="application/pdf" width="100%" height="500px">
          <p>Không hiển thị được PDF. <a href={current.file.url} target="_blank" rel="noopener noreferrer">Tải xuống</a></p>
        </object>
      );
    }
    return (
      <a href={current.file.url} download>{current.file.name} - Download</a>
    );
  };

  return (
    <section className="grading-page">
      <div className="container two-panel">
        {/* Left panel */}
        <aside className="submissions-list">
          <h3 className="panel-title">Danh sách bài nộp</h3>
          <ul>
            {submissions.map((sub, idx) => (
              <li key={sub.studentId}
                  className={idx === selectedIdx ? 'active' : ''}
                  onClick={() => setSelectedIdx(idx)}>
                <span className="student-name">{sub.studentName}</span>
                {sub.score == null ? (
                  <span className="status ungraded">Chưa chấm</span>
                ) : (
                  <span className="status graded">Đã chấm</span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Right panel */}
        <main className="grading-detail">
          <div className="breadcrumbs">
            <Link to={`/teacher/course/${courseId}/assignments`} className="back-link"><i className="fas fa-arrow-left"></i> Danh sách bài tập</Link>
          </div>
          <h2>{assignment.title}</h2>
          <h4>{current.studentName}</h4>

          {/* Viewer */}
          <div className="viewer">
            {renderViewer()}
          </div>

          {/* Grading form */}
          <div className="grading-form">
            <div className="form-row">
              <label>Điểm</label>
              <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="__/" />
            </div>
            <div className="form-row">
              <label>Feedback</label>
              <textarea rows={5} value={feedback} onChange={e => setFeedback(e.target.value)}></textarea>
            </div>
            <div style={{textAlign:'right'}}>
              <button className="btn primary" onClick={handleSave}>Lưu &amp; chuyển tiếp</button>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AssignmentGradingPage; 