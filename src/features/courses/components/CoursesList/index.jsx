import React from "react"
import './style.css'
import Heading from 'components/common/Heading';
import CourseCardItem from "../CourseCardItem"

const CoursesList = ({ 
  courses = [], 
  subtitle = "Khóa học của chúng tôi", 
  title = "Khám phá các khóa học phổ biến của chúng tôi",
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption
}) => {
  const showFilters = setSearchTerm && setSortOption;

  return (
    <section className='courses' id='courses'>
      <div className="courses-card-wrapper">
        <div className='container'>
          <div className='courses-header'>
            <Heading subtitle={subtitle} title={title} />
            {showFilters && (
              <div className="filter-controls-wrapper">
                <div className="filter-controls">
                  <div className="search-control">
                    <i className="fa fa-search"></i>
                    <input
                      type="text"
                      placeholder="Tìm kiếm khóa học..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="sort-control">
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                      <option value="default">Sắp xếp mặc định</option>
                      <option value="rating_desc">Đánh giá cao nhất</option>
                      <option value="duration_desc">Thời lượng: Nhiều nhất</option>
                      <option value="duration_asc">Thời lượng: Ít nhất</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
              </div>
          <div className='grid2'>
            {courses.length > 0 ? (
              courses.map((val) => (
                <CourseCardItem key={val.id} course={val} />
              ))
            ) : (
              <p className="no-courses-found">Không tìm thấy khóa học nào phù hợp.</p>
            )}
            </div>
        </div>
        </div>
      </section>
  )
}

export default CoursesList 