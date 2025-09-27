import React, { createContext, useContext } from 'react';
import { courses } from '../data/courseData';
import useLocalStorage from 'hooks/useLocalStorage';

const MyCoursesContext = createContext(null);

export const MyCoursesProvider = ({ children }) => {
  const defaultEnrolled = courses
    .filter((c) => c.defaultEnrolled)
    .map((c) => ({ courseId: c.id, completedLectures: [] }));
  const [enrolledCourses, setEnrolledCourses] = useLocalStorage('myCourses', defaultEnrolled);

  const enrollCourse = (courseId) => {
    setEnrolledCourses((prev) => {
      if (prev.some((c) => c.courseId === courseId)) return prev; // đã đăng ký
      return [...prev, { courseId, completedLectures: [] }];
    });
  };

  const markLectureCompleted = (courseId, lectureId) => {
    setEnrolledCourses((prev) =>
      prev.map((item) =>
        item.courseId === courseId
          ? {
              ...item,
              completedLectures: item.completedLectures.includes(lectureId)
                ? item.completedLectures
                : [...item.completedLectures, lectureId],
            }
          : item
      )
    );
  };

  const getProgress = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    const totalLectures = course.sections?.reduce(
      (acc, sec) => acc + (sec.lectures?.length || 0),
      0
    );
    if (totalLectures === 0) return 0;

    const enrolled = enrolledCourses.find((c) => c.courseId === courseId);
    const completed = enrolled ? enrolled.completedLectures.length : 0;
    return Math.min(100, Math.round((completed / totalLectures) * 100));
  };

  return (
    <MyCoursesContext.Provider
      value={{ enrolledCourses, enrollCourse, markLectureCompleted, getProgress }}
    >
      {children}
    </MyCoursesContext.Provider>
  );
};

export const useMyCourses = () => useContext(MyCoursesContext); 