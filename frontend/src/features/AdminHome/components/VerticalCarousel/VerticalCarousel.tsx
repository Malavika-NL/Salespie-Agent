import React from 'react';
import styles from './VerticalCarousel.module.css';
import { FaArrowCircleUp } from "react-icons/fa";  // Use up arrow for vertical
import { FaArrowCircleDown } from "react-icons/fa"; // Use down arrow for vertical
import Content from '../CarouselContent/CarouselContent';
import VerticalCarouselContent from '../VerticalCarouselContent/VerticalCarouselContent';

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

const VerticalCarousel: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate the previous and next page numbers with wrap-around (looping)
  const prevPage = currentPage === 1 ? totalPages : currentPage - 1;
  const nextPage = currentPage === totalPages ? 1 : currentPage + 1;

  const handleNextVertical = () => {
    onPageChange(nextPage);
  };

  const handlePrevVertical = () => {
    onPageChange(prevPage);
  };

  return (
    <div className={styles.carousel}>
      {/* Previous page preview */}
      <div className={styles.previewTopContainer}>
        <div className={styles.pageTopPreview}>
          <button className={styles.button} onClick={handlePrevVertical}>
            <FaArrowCircleUp size={30}  color='black' />
          </button>
          {/* <span className={styles.page}>{prevPage}</span> */}
        </div>
      </div>

      {/* Current page content */}
      <div className={styles.currentPage}>
        {/* <VerticalCarouselContent /> */}{currentPage}
      </div>

      {/* Next page preview */}
      <div className={styles.previewBottomContainer}>
        <div className={styles.pageBottomPreview}>
          <button className={styles.button} onClick={handleNextVertical}>
            <FaArrowCircleDown size={30} color='black' />
          </button>
          {/* <span className={styles.page}>{nextPage}</span> */}
        </div>
      </div>
    </div>
  );
};

export default VerticalCarousel;
