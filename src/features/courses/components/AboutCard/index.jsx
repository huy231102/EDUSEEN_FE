import React from "react"
import Heading from "../../../../components/common/Heading"
import "./style.css"
import { homeAbout } from "../../data/courseData"
import Awrapper from "../Awrapper"

const AboutCard = () => {
  return (
    <>
      <section className='aboutHome'>
        <div className='container flexSB'>
          <div className='left row'>
            <img src='/images/about.webp' alt='' />
          </div>
          <div className='right row'>
            <Heading subtitle='LỢI ÍCH CỦA EDUSEEN' title='Học Tập Không Giới Hạn, Mở Lối Tương Lai' />
            <div className='items'>
              {homeAbout.map((val) => {
                return (
                  <div className='item flexSB' key={val.title}>
                    <div className='img'>
                      <img src={val.cover} alt='' />
                    </div>
                    <div className='text'>
                      <h2>{val.title}</h2>
                      <p>{val.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      <Awrapper />
    </>
  )
}

export default AboutCard 