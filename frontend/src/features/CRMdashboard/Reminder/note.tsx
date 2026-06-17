import React, { useState } from 'react';
import styles from './note.module.css';

const notes = [
  'Start Date : 26/08/2024',
  'Start Date : 27/08/2024',
  'Start Date : 28/08/2024',
  'Start Date : 29/08/2024'
];

const Notes: React.FC = () => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const showPreviousNote = () => {
    setCurrentNoteIndex((prevIndex) => (prevIndex === 0 ? notes.length - 1 : prevIndex - 1));
  };

  const showNextNote = () => {
    setCurrentNoteIndex((prevIndex) => (prevIndex === notes.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.noteContainer}>
      <div className={styles.noteContent}>
        <button className={styles.arrowButton} onClick={showPreviousNote}>&lt;</button>
        <div className={styles.note}>

          <div className={styles.calendarContainer}>
            <div className={styles.calendar}>
              <div className={styles.month}>Jul</div>
              <div className={styles.date}>30</div>
            </div>
            <div className={styles.details}>
              <div className={styles.wmsText}>WMS</div>
              <div className={styles.timeText}>at 11:00 am</div>
            </div>
          </div>

          <div className={styles.noteText}>{notes[currentNoteIndex]}</div>
          <div className={styles.noteFooter}>
            <input type="checkbox" className={styles.checkbox} />
            <span className={styles.footerText}>Mark as Complete</span>
          </div>
        </div>
        <button className={styles.arrowButton} onClick={showNextNote}>&gt;</button>
      </div>
    </div>
  );
};

export default Notes;
