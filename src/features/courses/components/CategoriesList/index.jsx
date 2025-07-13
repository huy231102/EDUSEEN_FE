import React from "react"
import './style.css'
import { categories } from 'features/courses/data/courseData';
import Heading from 'components/common/Heading';
import { Link } from "react-router-dom"

const CategoriesList = () => {
  return (
    <>
      <section className='categories' id='categories'>
        <div className='container'>
          <Heading subtitle='DANH MỤC' title='Khám phá các danh mục khóa học của chúng tôi' />
          <div className='content grid3'>
            {categories.map((val, index) => (
              <Link to={`/category/${val.slug}`} key={index}>
                <div className='box'>
                  <div className='img'>
                    <img src={val.cover} alt='' />
                    <img src={val.hoverCover} alt='' className='show' />
                  </div>
                  <h1>{val.name}</h1>
                  <span>{val.courseCount}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default CategoriesList 