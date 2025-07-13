import React from 'react';
import { useMyCourses } from 'features/courses/contexts/MyCoursesContext';
import { courses } from 'features/courses/data/courseData';
// Styles được import trong component MyCoursesList
import MyCoursesList from 'features/courses/components/MyCoursesList';
import CoursesList from 'features/courses/components/CoursesList';
import { Link } from 'react-router-dom';

const MyCoursesPage = () => {
  const { enrolledCourses, getProgress } = useMyCourses();

  if (enrolledCourses.length === 0) {
    return (
      <div className="mycourses-empty">
        <h2>Bạn chưa đăng ký khóa học nào.</h2>
        <Link to="/courses" className="primary-btn">Khám phá khóa học</Link>
      </div>
    );
  }

  const enrolledCourseDetails = enrolledCourses
    .map((item) => courses.find((c) => c.id === item.courseId))
    .filter(Boolean);

  const progressMap = Object.fromEntries(
    enrolledCourseDetails.map((c) => [c.id, getProgress(c.id)])
  );

  const favoriteCourses = courses.filter((c) => c.isFavorite);

  return (
    <>
      <MyCoursesList courses={enrolledCourseDetails} progressMap={progressMap} />
      <CoursesList courses={favoriteCourses} subtitle="KHÓA HỌC YÊU THÍCH" title="Những khóa học bạn đánh dấu sao" />
    </>
  );
};

export default MyCoursesPage; 