import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from '../../data/courseData';
import './style.css';

const CourseContentPage = () => {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === parseInt(courseId));

  const [currentLecture, setCurrentLecture] = useState(null);
  const [openSections, setOpenSections] = useState([]);

  useEffect(() => {
    // Tự động mở section đầu tiên và chọn bài giảng đầu tiên
    if (course?.sections?.[0]?.lectures?.[0]) {
      setCurrentLecture(course.sections[0].lectures[0]);
      setOpenSections([0]); // Mở section đầu tiên
    }
  }, [course]);

  if (!course) {
    return <div>Đang tải...</div>;
  }

  const handleLectureSelect = (lecture, sectionIndex) => {
    setCurrentLecture(lecture);
    // Đảm bảo section của bài giảng được chọn luôn mở
    if (!openSections.includes(sectionIndex)) {
      setOpenSections([...openSections, sectionIndex]);
    }
  };
  
  const toggleSection = (sectionIndex) => {
    setOpenSections(prevOpenSections => {
      const isOpen = prevOpenSections.includes(sectionIndex);
      if (isOpen) {
        return prevOpenSections.filter(index => index !== sectionIndex);
      } else {
        return [...prevOpenSections, sectionIndex];
      }
    });
  };

  return (
    <div className="course-content-page">
      {/* Cột trái: Danh sách bài giảng */}
      <div className="content-sidebar">
        <Link to={`/courses/${courseId}`} className='back-link'>
          <i className="fa fa-arrow-left"></i> Quay lại trang chi tiết
        </Link>
        <h2 className="course-title">{course.name}</h2>
        <div className="sections-accordion">
          {course.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section-item">
              <div className="section-header" onClick={() => toggleSection(sectionIndex)}>
                <span>{section.title}</span>
                <i className={`fa fa-chevron-down ${openSections.includes(sectionIndex) ? 'open' : ''}`}></i>
              </div>
              {openSections.includes(sectionIndex) && (
                <ul className="lectures-list">
                  {section.lectures.map((lecture, lectureIndex) => (
                    <li 
                      key={lectureIndex}
                      className={`lecture-item ${currentLecture?.title === lecture.title ? 'active' : ''}`}
                      onClick={() => handleLectureSelect(lecture, sectionIndex)}
                    >
                      <i className="fa fa-play-circle"></i> {lecture.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Nội dung bài giảng */}
      <div className="content-main">
        {currentLecture ? (
          <>
            <h1 className="lecture-title">{currentLecture.title}</h1>
            <div className="video-player-wrapper">
              <iframe
                src={currentLecture.videoUrl}
                title={currentLecture.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </>
        ) : (
          <div className="no-lecture-selected">
            <h2>Vui lòng chọn một bài giảng để bắt đầu học</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentPage; 