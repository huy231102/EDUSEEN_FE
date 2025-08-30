import React from "react"
import { useNavigate } from "react-router-dom"
import Heading from "../Heading"
import { useAuth } from 'features/auth/contexts/AuthContext';
import './style.css'

const Hero = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      const coursesSection = document.getElementById('courses-section');
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <section className="hero">
        <div className='container'>
          <div className='row'>
            <Heading subtitle='Chào mừng đến với Eduseen' title='Phá Vỡ Rào Cản, Vươn Tới Tương Lai' />
            <p style={{ marginBottom: '30px' }}>Nền tảng học trực tuyến dành riêng cho người khiếm thính, với các khóa học được thiết kế đặc biệt cùng ngôn ngữ ký hiệu và phụ đề chi tiết.</p>
            <button className='primary-btn' onClick={handleButtonClick}>
              {isLoggedIn ? 'HỌC NGAY' : 'ĐĂNG NHẬP / ĐĂNG KÝ'}&ensp;<i className='fa fa-long-arrow-alt-right'></i>
            </button>
          </div>
        </div>
      </section>
      <div className="margin"></div>
    </>
  )
}

export default Hero 