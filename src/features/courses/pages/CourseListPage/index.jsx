import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from 'components/common/Hero';
import AboutCard from 'features/courses/components/AboutCard';
import CoursesList from 'features/courses/components/CoursesList';
import CategoriesList from 'features/courses/components/CategoriesList';
import Testimonal from 'features/courses/components/Testimonal';
import Hblog from 'features/courses/components/Hblog';
import courseApi from 'services/courseApi';

const CourseListPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [allCourses, setAllCourses] = useState([]); // Dữ liệu gốc từ API
  const [displayCourses, setDisplayCourses] = useState([]); // Dữ liệu sau khi filter/sort
  const [topReviews, setTopReviews] = useState([]);
  const [loadingReview, setLoadingReview] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);

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
  }, [location.state]);

  // Fetch top courses từ API
  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        setLoadingCourses(true);
        const data = await courseApi.getTopCourses(9);
        // Map về structure FE mong muốn
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
        setAllCourses(mapped); // Lưu dữ liệu gốc
        setDisplayCourses(mapped); // Hiển thị ban đầu
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách khóa học');
        setAllCourses([]);
        setDisplayCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchTopCourses();
  }, []);

  // Tính toán danh sách hiển thị sau khi search & sort
  useEffect(() => {
    if (allCourses.length === 0) return; // Đợi dữ liệu gốc load xong
    
    // Luôn filter từ dữ liệu gốc
    const searched = allCourses.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const sorted = [...searched];
    switch (sortOption) {
      case 'rating_desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_asc':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      default:
        sorted.sort((a, b) => a.id - b.id);
        break;
    }
    setDisplayCourses(sorted);
  }, [searchTerm, sortOption, allCourses]); // Thêm allCourses vào dependency

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

  if (loadingCourses) {
    return (
      <>
        <Hero />
        <AboutCard />
        <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
          <p>Đang tải danh sách khóa học...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Hero />
        <AboutCard />
        <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
          <p>Lỗi: {error}</p>
        </div>
      </>
    );
  }

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