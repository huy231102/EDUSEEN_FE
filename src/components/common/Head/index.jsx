import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from 'features/auth/contexts/AuthContext';
import NotificationDropdown from '../NotificationDropdown';
import "./style.css"

const Head = () => {
  const { isLoggedIn } = useAuth()

  return (
    <>
      <section className='head'>
        <div className='container flexSB'>
          <div className='logo'>
            <h1>EDUSEEN</h1>
            <span>ONLINE EDUCATION & LEARNING</span>
          </div>

          <div className='social'>
            <Link to='/video-call' title="Video Call">
              <i className='fa fa-video icon'></i>
            </Link>
            
            {isLoggedIn && (
              <Link to='/my-courses' title="Khóa học của tôi">
                <i className='fa fa-book icon'></i>
              </Link>
            )}
            
            {isLoggedIn && <NotificationDropdown />}
            
            <Link to={isLoggedIn ? '/profile' : '/auth'} title="Account">
              <i className='fa fa-user icon'></i>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Head 