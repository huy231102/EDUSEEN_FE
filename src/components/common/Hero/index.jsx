import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Heading from "../Heading"
import './style.css'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <>
      <section className="hero">
        <div className='container'>
          <div className='row'>
            <Heading subtitle='WELCOME TO EDUSEEN' title='Phá Vỡ Rào Cản, Vươn Tới Tương Lai' />
            <p>Nền tảng học trực tuyến dành riêng cho người khiếm thính, với các khóa học được thiết kế đặc biệt cùng ngôn ngữ ký hiệu và phụ đề chi tiết.</p>
            <button className='primary-btn' onClick={() => navigate('/auth')}>
              REGISTER NOW <i className='fa fa-long-arrow-alt-right'></i>
            </button>
          </div>
        </div>
      </section>
      <div className="margin"></div>
    </>
  )
}

export default Hero 