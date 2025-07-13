import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from 'features/auth/contexts/AuthContext';
import { notifications } from "features/courses/data/courseData"
import "./style.css"

const Head = () => {
  const { isLoggedIn } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

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
            <div title="Thông báo" className="notification-link" onClick={() => setOpen(!open)} ref={dropdownRef}>
              <i className='fa fa-bell icon'></i>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}

              {open && (
                <div className="notification-dropdown">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">Không có thông báo</div>
                  ) : (
                    notifications.slice(0, 6).map(notif => (
                      <div key={notif.id} className={`notification-item ${notif.isRead ? '' : 'unread'}`}>
                        <i className={`fa ${notif.icon} notif-icon`}></i>
                        <div className="notif-content">
                          <span className="notif-title">{notif.title}</span>
                          <p className="notif-msg">{notif.message}</p>
                          <span className="notif-time">{new Date(notif.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                  <div className="notification-footer">Xem tất cả</div>
                </div>
              )}
            </div>
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