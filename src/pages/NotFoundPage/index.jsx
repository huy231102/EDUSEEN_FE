import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const NotFoundPage = () => (
  <div className="notfound-page">
    <h1>404</h1>
    <h2>Trang bạn yêu cầu không tồn tại</h2>
    <Link to="/" className="primary-btn">Về trang chủ</Link>
  </div>
);

export default NotFoundPage; 