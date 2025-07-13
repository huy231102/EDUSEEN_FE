import React from "react"
import { blog } from 'features/courses/data/courseData';
import './style.css'
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <>
      <footer id='about'>
        <div className='container'>
          <div className='box logo'>
            <Link to='/'>
              <h1>EDUSEEN</h1>
            </Link>
            <span>ĐÀO TẠO & HỌC TẬP TRỰC TUYẾN</span>
            <p>Một nền tảng dành riêng cho việc giáo dục và trao quyền cho cộng đồng người khiếm thính.</p>
          </div>
          <div className='box last'>
            <h3>Bạn có câu hỏi?</h3>
            <ul>
              <li>
                <i className='fa fa-map'></i>
                Trường Đại học FPT, Khu CNC Hòa Lạc, Thạch Thất, Hà Nội
              </li>
              <li>
                <i className='fa fa-phone-alt'></i>
                +84 978 908 226
              </li>
              <li>
                <i className='fa fa-paper-plane'></i>
                info.eduseen@gmail.com
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer 