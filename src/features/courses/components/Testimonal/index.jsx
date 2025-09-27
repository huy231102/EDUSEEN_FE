import React from "react"
import Heading from 'components/common/Heading';
import './style.css'

const StarRating = ({ rating }) => {
  const stars = [];
  const visualRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(visualRating);
  const hasHalfStar = visualRating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full_${i}`} className='fas fa-star'></i>);
  }

  if (hasHalfStar) {
    stars.push(<i key='half' className='fas fa-star-half-alt'></i>);
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<i key={`empty_${i}`} className='far fa-star'></i>);
  }
  
  return <div className='star-rating'>{stars}</div>
}

const Testimonal = ({ items, subtitle, title }) => {
  if (!items || items.length === 0) {
    return null
  }
  
  return (
    <>
      <section className='testimonal padding'>
        <div className='container'>
          <Heading subtitle={subtitle} title={title} />

          <div className='content grid2'>
            {items.map((val, idx) => (
              <div className='items shadow' key={val.id || idx}>
                <div className='box flex'>
                  <div className='img'>
                    <img src={val.userAvatarUrl || '/images/team/t1.webp'} alt='' />
                    <i className='fa fa-quote-left icon'></i>
                  </div>
                  <div className='name'>
                    <h2>{val.userName}</h2>
                    <span>{val.courseName}</span>
                    <div className='rating-section'>
                      <StarRating rating={val.rating} />
                    </div>
                  </div>
                </div>
                <p>{val.comment || val.courseDescription ||''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Testimonal 