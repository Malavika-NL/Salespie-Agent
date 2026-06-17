// Carousel.tsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Carousel.module.css';

const Carousel: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    arrows: true,

  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings} className={styles.slider}>
        <div className={`${styles.carouselCard} ${styles.purpleCard}`}>Card 1</div>
        <div className={`${styles.carouselCard} ${styles.greenCard}`}>Card 2</div>
        <div className={`${styles.carouselCard} ${styles.redCard}`}>Card 3</div>
      </Slider>
    </div>
  );
};

export default Carousel;
