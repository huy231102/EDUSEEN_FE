import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';

const MainLayout = () => {
  const location = useLocation();
  // Kiểm tra cả trang category và trang course detail
  const hasHeaderBg = location.pathname.startsWith('/category') || location.pathname.startsWith('/courses/');

  return (
    <>
      <div className={hasHeaderBg ? 'header-with-bg' : ''}>
        <Header />
      </div>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout; 