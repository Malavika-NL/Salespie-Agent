import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Carousel.module.css';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

import Card from './card';


const Carousel: React.FC = () => {
  const navigate = useNavigate();

  // Data for cards
  const cardData = [
    { title: 'Card 1', content: 'Content for Card 1', color: '#ffffff', index: 0, isTransitioning: false },
    { title: 'Card 2', content: 'Content for Card 2', color: '#ffffff', index: 1, isTransitioning: false },
    { title: 'Card 3', content: 'Content for Card 3', color: '#ffffff', index: 2, isTransitioning: false },
    { title: 'Card 4', content: 'Content for Card 4', color: '#ffffff', index: 3, isTransitioning: false },
    { title: 'Card 5', content: 'Content for Card 5', color: '#ffffff', index: 4, isTransitioning: false },
  ];

  const totalPages = cardData.length;
  const [currentPage, setCurrentPage] = useState(1);

  const prevPage = currentPage === 1 ? totalPages : currentPage - 1;
  const nextPage = currentPage === totalPages ? 1 : currentPage + 1;

  const handleNext = () => setCurrentPage(nextPage);
  const handlePrev = () => setCurrentPage(prevPage);

  const handlePageClick = () => {
    if (currentPage === 1) {
      navigate('/dashboard');
    } else if (currentPage === 2) {
      navigate('/empdashboard');
    } else if (currentPage === 3){
      navigate('');
    } else if (currentPage === 4){
      navigate('machinedashboard  ');
    } 
    
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.head}>Key Dashboard</div>
        
      </div>
      <div className={styles.carousel}>
        <div className={styles.previewLeftContainer}>
          <button className={styles.button} onClick={handlePrev}>
            <FaArrowCircleLeft size={30} />
          </button>
        </div>

        <div
          className={styles.currentPage}
          style={{
            backgroundColor: cardData[currentPage - 1]?.color,
          }}
          onClick={handlePageClick}
        >

          <Card
            title={cardData[currentPage - 1]?.title}
            content={cardData[currentPage - 1]?.content}
            index={currentPage - 1}
            color={cardData[currentPage - 1]?.color}
            onClick={() => {}}
            isTransitioning={false}
          />
        </div>

        <div className={styles.previewRightContainer}>
          <button className={styles.button} onClick={handleNext}>
            <FaArrowCircleRight size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
