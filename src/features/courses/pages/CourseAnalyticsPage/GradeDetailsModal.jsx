import React from 'react';
import './style.css';

const GradeDetailsModal = ({ isOpen, onClose, student, assignmentGrades }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chi tiết điểm - {student?.studentName}</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="student-info">
            <p><strong>Email:</strong> {student?.studentEmail}</p>
            <p><strong>Điểm trung bình:</strong> 
              <span className={`grade-badge ${student?.averageGrade >= 8 ? 'excellent' : student?.averageGrade >= 6.5 ? 'good' : student?.averageGrade >= 5 ? 'average' : 'poor'}`}>
                {student?.averageGrade.toFixed(1)}
              </span>
            </p>
            <p><strong>Bài tập đã làm:</strong> {student?.completedAssignments} / {student?.totalAssignments}</p>
          </div>
          
          <div className="assignments-details">
            <h4>Chi tiết từng bài tập:</h4>
            <div className="assignments-list">
              {assignmentGrades?.map((assignment, index) => (
                <div key={assignment.assignmentId} className="assignment-item">
                  <div className="assignment-header">
                    <span className="assignment-number">{index + 1}.</span>
                    <span className="assignment-title">{assignment.assignmentTitle}</span>
                    <span className={`assignment-status ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                      {assignment.status === 'Graded' ? 'Đã chấm' : 
                       assignment.status === 'Submitted' ? 'Đã nộp' : 'Chưa nộp'}
                    </span>
                  </div>
                  
                  <div className="assignment-details">
                    {assignment.grade !== null && assignment.grade !== undefined ? (
                      <div className="grade-info">
                        <span className="grade-label">Điểm:</span>
                        <span className={`grade-value ${assignment.grade >= 8 ? 'excellent' : assignment.grade >= 6.5 ? 'good' : assignment.grade >= 5 ? 'average' : 'poor'}`}>
                          {assignment.grade.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <div className="grade-info">
                        <span className="grade-label">Điểm:</span>
                        <span className="grade-value not-graded">Chưa chấm</span>
                      </div>
                    )}
                    
                    {assignment.submittedAt && (
                      <div className="submission-info">
                        <span className="submission-label">Ngày nộp:</span>
                        <span className="submission-date">
                          {new Date(assignment.submittedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeDetailsModal; 