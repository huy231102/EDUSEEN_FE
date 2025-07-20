import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Heading from 'components/common/Heading';
import CoursesList from 'features/courses/components/CoursesList';
import categoryApi from 'services/categoryApi';
import './style.css'

const CategoryPage = () => {
  const { categoryId } = useParams();

  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');

  // Lấy tất cả categories để tìm id từ slug
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        const data = await categoryApi.getCategories();
        if (!isMounted) return;
        setCategories(data);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError('Không thể tải danh mục');
      }
    }
    fetchCategories();
    return () => { isMounted = false }
  }, []);

  // Khi categories hoặc slug thay đổi -> tìm category và load khóa học
  useEffect(() => {
    if (categories.length === 0) return;
    const category = categories.find(c => (c.id || c.Id) === Number(categoryId));
    if (!category) {
      setError('Không tìm thấy danh mục');
      setLoading(false);
      return;
    }
    async function fetchCourses() {
      try {
        setLoading(true);
        const data = await categoryApi.getCoursesByCategory(category.id || category.Id);
        // map về structure FE mong muốn
        const mapped = data.map(dto => ({
          id: dto.courseId,
          name: dto.title,
          cover: dto.cover,
          trainerName: dto.teacherName,
          totalTime: dto.totalTime,
          rating: dto.rating || 0,
          isFavorite: dto.isFavorite,
          // Sử dụng avatar từ API hoặc fallback
          tcover: dto.teacherAvatarUrl || '/images/team/t1.webp'
        }));
        setCourses(mapped);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Không thể tải khóa học');
        setLoading(false);
      }
    }
    fetchCourses();
  }, [categories, categoryId]);

  // Tính toán danh sách hiển thị sau khi search & sort
  const displayCourses = useMemo(() => {
    const searched = courses.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const sorted = [...searched];
    switch (sortOption) {
      case 'rating_desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration_desc':
        sorted.sort((a, b) => b.totalTime - a.totalTime);
        break;
      case 'duration_asc':
        sorted.sort((a, b) => a.totalTime - b.totalTime);
        break;
      default:
        sorted.sort((a, b) => a.id - b.id);
        break;
    }
    return sorted;
  }, [courses, searchTerm, sortOption]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <Heading subtitle="Lỗi" title={error} />
      </div>
    );
  }

  // Tìm lại category để lấy tên hiển thị
  const currentCategory = categories.find(c => (c.id || c.Id) === Number(categoryId));

  return (
    <section className="category-page-section">
      <div className="container">
        <CoursesList 
          courses={displayCourses}
          subtitle="Danh mục"
          title={currentCategory?.name || currentCategory?.Name}
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