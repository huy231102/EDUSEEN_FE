import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courses, categories } from '../../data/courseData';
import Heading from '../../../../components/common/Heading';
import CoursesList from '../../components/CoursesList';
import './style.css';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const category = categories.find(c => c.slug === categorySlug);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [displayCourses, setDisplayCourses] = useState([]);

  useEffect(() => {
    const categoryCourses = courses.filter(course => course.categorySlug === categorySlug);

    const searchedCourses = categoryCourses.filter(course =>
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
        // Sắp xếp theo ID để giữ ổn định
        sortedCourses.sort((a, b) => a.id - b.id);
        break;
    }

    setDisplayCourses(sortedCourses);
  }, [categorySlug, searchTerm, sortOption]);


  if (!category) {
    return (
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <Heading subtitle="Lỗi" title="Không tìm thấy danh mục" />
      </div>
    );
  }

  return (
    <section className="category-page-section">
      <div className="container">
        <CoursesList 
          courses={displayCourses}
          subtitle="Danh mục"
          title={category.name}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </div>
    </section>
  );
};

export default CategoryPage; 