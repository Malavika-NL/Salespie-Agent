import React, { useState } from 'react';
import styles from './UserCarousel.module.css';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import Content from '../UserCarouselContent/UserCarouselContent';
import { motion } from 'framer-motion';

interface Props {
  data: any[];
}

const UserCarousel: React.FC<Props> = ({ data }) => {
  const totalPages = 3; // Total pages based on the length of the data
  const [currentPage, setCurrentPage] = useState(1); // Initialize current page as 1
  const [direction, setDirection] = useState(0);
  // Calculate the previous and next page numbers with wrap-around (looping)
  const prevPage = currentPage === 1 ? totalPages : currentPage - 1;
  const nextPage = currentPage === totalPages ? 1 : currentPage + 1;

  const handleNext = () => {
    setDirection(1); // Moving forward
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1); // Moving backward
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  return (
    <div className={styles.carousel}>
      {/* Previous page preview */}
      <div className={styles.previewLeftContainer}>
        <div className={styles.pageLeftPreview}>
          <button className={styles.button} onClick={handlePrev}>
            <FaArrowCircleLeft size={30} />
          </button>
        </div>
      </div>

      {/* Current page */}
      <div className={styles.currentPage}>
        
      <motion.div
        key={currentPage} // Ensures animation triggers on change
        className={styles.currentPage}
        initial={{ opacity: 0, x: direction * -50 }} // Move opposite to direction
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * 50 }}
        transition={{ duration: 0.5 }}
      >
        <Content data={currentPage} />
      </motion.div>
      </div>

      {/* Next page preview */}
      <div className={styles.previewRightContainer}>
        <div className={styles.pageRightPreview}>
          <button className={styles.button} onClick={handleNext}>
            <FaArrowCircleRight size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCarousel;
