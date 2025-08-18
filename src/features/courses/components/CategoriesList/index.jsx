import React, { useEffect, useState } from "react"
import './style.css'
import { getCategories, createCategory, updateCategory, deleteCategory } from 'services/categoryApi';
import Heading from 'components/common/Heading';
import { Link } from "react-router-dom"

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div>Đang tải danh mục...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <>
      <section className='categories' id='categories'>
        <div className='container'>
          <Heading subtitle='DANH MỤC' title='Khám phá các danh mục khóa học của chúng tôi' />
          <div className='content grid3'>
            {categories.map((val) => (
              <Link to={`/category/${val.id}`} key={val.id}>
                <div className='box'>
                  <div className='img'>
                    <img src={`${val.cover}`} alt='' />
                    <img src={`${val.hoverCover}`} alt='' className='show' />
                  </div>
                  <h1>{val.name}</h1>
                  <span>{val.courseCount} khóa học</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default CategoriesList 