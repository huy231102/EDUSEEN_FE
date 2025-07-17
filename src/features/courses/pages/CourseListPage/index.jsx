import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from 'components/common/Hero';
import AboutCard from 'features/courses/components/AboutCard';
import CoursesList from 'features/courses/components/CoursesList';
import CategoriesList from 'features/courses/components/CategoriesList';
import Testimonal from 'features/courses/components/Testimonal';
import Hblog from 'features/courses/components/Hblog';
import { courses as allCourses } from 'features/courses/data/courseData';
import courseApi from 'services/courseApi';

const CourseListPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [displayCourses, setDisplayCourses] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [loadingReview, setLoadingReview] = useState(true);

  useEffect(() => {
    // Logic mới: lắng nghe 'state' từ useNavigate
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    // Lọc và sắp xếp khóa học
    const searchedCourses = allCourses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCourses = [...searchedCourses];
    switch (sortOption) {
      case 'rating_desc':
        sortedCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        sortedCourses.sort((a, b) => a.priceAll - b.priceAll);
        break;
      case 'price_desc':
        sortedCourses.sort((a, b) => b.priceAll - a.priceAll);
        break;
      case 'duration_desc':
        sortedCourses.sort((a, b) => b.totalTime - a.totalTime);
        break;
      case 'duration_asc':
        sortedCourses.sort((a, b) => a.totalTime - b.totalTime);
        break;
      default:
        sortedCourses.sort((a, b) => a.id - b.id);
        break;
    }

    setDisplayCourses(sortedCourses);

  }, [location.state, searchTerm, sortOption]);

  useEffect(() => {
    // Chỉ fetch top review ở trang này
    const fetchTopReviews = async () => {
      try {
        setLoadingReview(true);
        const data = await courseApi.getTopReviews();
        setTopReviews(data);
      } catch {
        setTopReviews([]);
      } finally {
        setLoadingReview(false);
      }
    };
    fetchTopReviews();
  }, []);

  return (
    <>
      <Hero />
      <AboutCard />
      <div id="courses-section">
        <CoursesList 
          courses={displayCourses}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </div>
      <CategoriesList />
      {!loadingReview && <Testimonal items={topReviews} subtitle='ĐÁNH GIÁ TỪ HỌC VIÊN' title='Những Gương Mặt Tiêu Biểu' />}
      <Hblog />
    </>
  );
};

export default CourseListPage; 