import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from 'features/auth/contexts/AuthContext'
import Head from "../Head"
import './style.css'

const Header = () => {
  const [click, setClick] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isTeacher = user && (
    Number(user.roleId) === 3 ||
    (user.roleName && String(user.roleName).toLowerCase() === 'teacher') ||
    (user.role && String(user.role).toLowerCase() === 'teacher')
  )
  const isTeacherArea = location.pathname.startsWith('/teacher') || location.pathname === '/profile'
  const hideNavBarForTeacher = Boolean(isTeacher && isTeacherArea)

  const handleScrollTo = (id) => {
    if (location.pathname === "/") {
      // Nếu đang ở trang chủ, cuộn trực tiếp
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Nếu ở trang khác, điều hướng về trang chủ và gửi state
      navigate("/", { state: { scrollTo: id } });
    }
    setClick(false) // Đóng menu mobile sau khi nhấp
  }

  return (
    <>
      <Head />
      <header>
        <nav className='flexSB'>
          {!hideNavBarForTeacher && (
            <>
              <ul className={click ? "mobile-nav" : "navbar"} onClick={() => setClick(false)}>
                <li>
                  <Link to='/'>Trang chủ</Link>
                </li>
                <li>
                  <a onClick={() => handleScrollTo("courses")}>Khóa học nổi bật</a>
                </li>
                <li>
                  <a onClick={() => handleScrollTo("categories")}>Danh mục</a>
                </li>
                <li>
                  <a onClick={() => handleScrollTo("blog")}>Bài viết</a>
                </li>
                <li>
                  <a onClick={() => handleScrollTo("about")}>Về chúng tôi</a>
                </li>
              </ul>
              <div className='start'>
                <div className='button'>NHẬN CHỨNG CHỈ</div>
              </div>
            </>
          )}
          <button className='toggle' onClick={() => setClick(!click)}>
            {click ? <i className='fa fa-times'> </i> : <i className='fa fa-bars'></i>}
          </button>
        </nav>
      </header>
    </>
  )
}

export default Header 