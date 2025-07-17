import React from "react"
import './style.css'
import { blog } from 'features/courses/data/courseData';
import Heading from 'components/common/Heading';

const Hblog = () => {
  return (
    <>
      <section className='blog' id='blog'>
        <div className='container'>
          <Heading subtitle='BLOG CỦA CHÚNG TÔI' title='Bài Viết & Tin Tức Gần Đây' />
          <div className='grid2'>
            {blog.slice(0, 3).map((val) => (
              <div className='items shadow' key={val.id}>
                <div className='img'>
                  <img src={val.cover} alt='' />
                </div>
                <div className='text'>
                  <div className='admin flexSB'>
                    <span>
                      <i className='fa fa-user'></i>
                      <label htmlFor=''>{val.type}</label>
                    </span>
                    <span>
                      <i className='fa fa-calendar-alt'></i>
                      <label htmlFor=''>{val.date}</label>
                    </span>
                  </div>
                  <a href={val.url} target='_blank' rel='noopener noreferrer'>
                    <h1>{val.title}</h1>
                  </a>
                  <p>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Hblog 