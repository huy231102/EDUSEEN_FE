import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';

const MainLayout = () => {
  const location = useLocation();
  // Thêm nền cho tất cả trang trừ trang chủ
  const hasHeaderBg = location.pathname !== '/';

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