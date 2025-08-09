import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from 'services/api';
import './style.css';

const AssignmentGradingPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.get(`/api/teacher/assignment/${assignmentId}/submissions`);
        setAssignment({ title: data.title });

        const submittedList = data.submissions.map(s => ({
          submissionId: s.submissionId || s.SubmissionId,
          studentId: s.studentId || s.StudentId,
          studentName: s.studentName || s.StudentName,
          grade: s.grade ?? s.Grade,
          feedback: s.feedback ?? s.Feedback,
          files: s.files || s.Files || [],
        }));

        const notSubmittedList = (data.notSubmittedStudents || data.NotSubmittedStudents || []).map(ns => ({
          submissionId: null,
          studentId: ns.studentId || ns.StudentId,
          studentName: ns.name || ns.Name,
          grade: null,
          feedback: null,
        }));

        const fullList = [...submittedList, ...notSubmittedList];

        const sorted = fullList.sort((a, b) => {
          // Submitted come first (grade null or not), not submitted (submissionId null) at bottom
          if (a.submissionId && !b.submissionId) return -1;
          if (!a.submissionId && b.submissionId) return 1;
          // Among submitted, ungraded first
          if (a.grade == null && b.grade != null) return -1;
          if (a.grade != null && b.grade == null) return 1;
          return 0;
        });
        setSubmissions(sorted);
        setSelectedIdx(0);
      } catch (err) {
        console.error(err);
        navigate(`/teacher/course/${courseId}/assignments`);
      }
    }
    fetchData();
  }, [courseId, assignmentId, navigate]);

  useEffect(() => {
    if (submissions.length) {
      const sub = submissions[selectedIdx];
      setScore(sub.grade ?? '');
      setFeedback(sub.feedback ?? '');
    }
  }, [selectedIdx, submissions]);

  const handleSave = async () => {
    const updated = [...submissions];
    updated[selectedIdx] = {
      ...updated[selectedIdx],
      grade: score === '' ? null : Number(score),
      feedback: feedback.trim(),
    };
    setSubmissions(updated);

    // Gọi API gửi feedback và điểm
    if (updated[selectedIdx].submissionId) {
      try {
        await api.post(`/api/submission/${updated[selectedIdx].submissionId}/feedback`, {
          grade: score === '' ? null : Number(score),
          feedback: feedback.trim(),
        });
      } catch (err) {
        alert('Lỗi khi gửi feedback: ' + (err?.response?.data?.message || err.message));
        return;
      }
    }

    // find next ungraded
    const nextIdx = updated.findIndex((s, idx) => s.grade == null && idx > selectedIdx);
    if (nextIdx !== -1) {
      setSelectedIdx(nextIdx);
    } else {
      alert('Đã chấm xong tất cả bài!');
    }
  };

  if (!assignment) return null;

  const current = submissions[selectedIdx] || {};

  const renderViewer = () => {
    if (!current.files || current.files.length === 0) {
      return <p className="no-file">Chưa có tệp đính kèm hoặc định dạng không hỗ trợ.</p>;
    }

    return (
      <div className="submission-files">
        {current.files.map((file, index) => {
          const isPdf = /\.pdf$/i.test(file.fileName || '');
          const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.fileName || '');
          const isVideo = /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(file.fileName || '');
          
          return (
            <div key={index} className="submission-file">
              {isPdf ? (
                <object data={file.fileUrl} type="application/pdf" width="100%" height="500px">
                  <p>Không hiển thị được PDF. <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">Tải xuống</a></p>
                </object>
              ) : isImage ? (
                <img src={file.fileUrl} alt={file.fileName || `File ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '400px' }} />
              ) : isVideo ? (
                <video src={file.fileUrl} controls width="100%" style={{ maxHeight: '400px' }} />
              ) : (
                <div className="file-download">
                  <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                    <i className="fa fa-download"></i> {file.fileName || `File ${index + 1}`} - Tải xuống
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="container grading-page">
      <Link to={`/teacher/course/${courseId}/assignments`} className="back-link"><i className="fas fa-arrow-left"></i> Danh sách bài tập</Link>
      <div className="assignment-grading-container two-panel">
        {/* Left panel */}
        <aside className="submissions-list">
          <h3 className="panel-title">Danh sách bài nộp</h3>
          <ul>
            {submissions.map((sub, idx) => (
              <li key={sub.studentId}
                  className={idx === selectedIdx ? 'active' : ''}
                  onClick={() => setSelectedIdx(idx)}>
                <span className="student-name">{sub.studentName}</span>
                {sub.submissionId == null ? (
                  <span className="status not-submitted">Chưa nộp</span>
                ) : (
                  sub.grade == null ? (
                    <span className="status ungraded">Chưa chấm</span>
                  ) : (
                    <span className="status graded">Đã chấm</span>
                  )
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Right panel */}
        <main className="grading-detail">
          <h2>{assignment.title}</h2>
          <h4>{current.studentName || ''}</h4>

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