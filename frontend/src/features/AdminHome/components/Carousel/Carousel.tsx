import React from 'react';
import styles from './Carousel.module.css';
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import Content from '../CarouselContent/CarouselContent';
interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const data = [
  {
    "title": "Title",
    "text": "This is a supporting text.",
    "backgroundColor": "#FFFFFF",
    "buttonColor": "#727FFF"
  },
  {
    "title": "Title",
    "text": "This is a supporting text.",
    "backgroundColor": "#2A2A2A",
    "buttonColor": "#727FFF"
  },
  {
    "title": "Title",
    "text": "This is a supporting text.",
    "backgroundColor": "#FFFFFF",
    "buttonColor": "#727FFF"
  },
  {
    "title": "Title",
    "text": "This is a supporting text.",
    "backgroundColor": "#727FFF",
    "buttonColor": "#727FFF"
  },
  {
    "title": "Title",
    "text": "This is a supporting text.",
    "backgroundColor": "#FF4444",
    "buttonColor": "#727FFF"
  }
];


const FirstCarousel: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate the previous and next page numbers with wrap-around (looping)
  const prevPage = currentPage === 1 ? totalPages : currentPage - 1;
  const nextPage = currentPage === totalPages ? 1 : currentPage + 1;

  const handleNext = () => {
    onPageChange(nextPage);
  };

  const handlePrev = () => {
    onPageChange(prevPage);
  };

  return (
    <div className={styles.carousel}>
      {/* Previous page preview */}
      <div className={styles.previewLeftContainer}>
        <div className={styles.pageLeftPreview}>
          <button className={styles.button} onClick={handlePrev}>
          <FaArrowCircleLeft size={30} />
          </button>
          {/* <span className={styles.page}>{prevPage}</span> */}
        </div>
      </div>

      {/* Current page */}
      <div className={styles.currentPage}><Content data={data} /></div>

      {/* Next page preview */}
      <div className={styles.previewRightContainer}>
        <div className={styles.pageRightPreview}>
          <button className={styles.button} onClick={handleNext}>
          <FaArrowCircleRight size={30} />
          </button>
          {/* <span className={styles.page}>{nextPage}</span> */}
        </div>
      </div>
    </div>
  );
};

export default FirstCarousel;
