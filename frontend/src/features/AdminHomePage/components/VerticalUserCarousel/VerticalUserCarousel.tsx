import React from 'react';
import styles from './VerticalUserCarousel.module.css';
import { FaArrowCircleUp } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";
import VerticalCarouselContent from '../VerticalUserCarouselContent/VerticalUserCarouselContent';

interface Props {
  currentPage: number;
  onPageChange: (page: number) => void;
}
const data = [
  {
    id: 1,
    content: {
      title: "Warehouse Management System",
      startDate: "07/08/2024",
      endDate: "14/08/2024",
      region: "North",
      contentStatus: "Ready",
      background: "linear-gradient(180deg, #0BD6A5 0%, #037F61 100%)",
    },
  },
  {
    id: 2,
    content: {
      title: "Inventory Management System",
      startDate: "10/08/2024",
      endDate: "20/08/2024",
      region: "East",
      contentStatus: "In Progress",
      background: "linear-gradient(116.72deg, #F15887 14.78%, #FE9B86 85.22%)",
    },
  },
  {
    id: 3,
    content: {
      title: "Order Processing System",
      startDate: "15/08/2024",
      endDate: "25/08/2024",
      region: "South",
      contentStatus: "Completed",
      background: "linear-gradient(90deg, #974CD2 30%, #55108B 100%)",
    },
  },
  {
    id: 4,
    content: {
      title: "Shipping Management System",
      startDate: "01/09/2024",
      endDate: "10/09/2024",
      region: "West",
      contentStatus: "Ready",
      background: "linear-gradient(270deg, #D25F1E 0%, #6C310F 100%)",
    },
  },
  // {
  //   id: 5,
  //   content: {
  //     title: "Customer Support System",
  //     startDate: "05/09/2024",
  //     endDate: "15/09/2024",
  //     region: "Central",
  //     contentStatus: "Pending",
  //     background: "linear-gradient(180deg, #0BD6A5 0%, #037F61 100%)",
  //   },
  // },
];

const UserVerticalCarousel: React.FC<Props> = ({ currentPage, onPageChange }) => {
  const totalPages = data.length;

  // Calculate the previous and next page numbers with wrap-around (looping)
  const prevPage = currentPage === 1 ? totalPages : currentPage - 1;
  const nextPage = currentPage === totalPages ? 1 : currentPage + 1;
  const thirdPage = nextPage === totalPages ? 1 : nextPage + 1;

  const handleNextVertical = () => {
    onPageChange(nextPage);
  };

  const handlePrevVertical = () => {
    onPageChange(prevPage);
  };

  return (
    <div className={styles.carousel}>
      {/* Previous page preview */}
      <div
        className={styles.previewTopContainer}
        style={{ background: data[prevPage - 1].content.background }}
      >
        <div className={styles.pageTopPreview}>
          <button className={styles.button} onClick={handleNextVertical}>
            <FaArrowCircleUp size={30} color="black" />
          </button>
        </div>
      </div>

      {/* Current page content */}
      <div className={styles.currentPage}>
        {data[currentPage - 1] && (
          <VerticalCarouselContent {...data[currentPage - 1].content} />
        )}
        {data[nextPage - 1] && (
          <VerticalCarouselContent {...data[nextPage - 1].content} />
        )}
      </div>

      {/* Next page preview, now showing third page */}
      <div
        className={styles.previewBottomContainer}
        style={{ background: data[thirdPage - 1].content.background }}
      >
        <div className={styles.pageBottomPreview}>
          <button className={styles.button} onClick={ handlePrevVertical}>
            <FaArrowCircleDown size={30} color="black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserVerticalCarousel;
