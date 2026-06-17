// // Calendar.tsx
// import React, { useState } from 'react';
// import Calendar, { Value } from 'react-calendar'; 
// import 'react-calendar/dist/Calendar.css'; // Import styles for the calendar
// import styles from './calender.module.css'; // Import CSS module for styling

// const MyCalendar: React.FC = () => {
//     const [date, setDate] = useState<Value | null>(null); 

//     // Update the onChange function to handle the new type
//     const onChange = (value: Value) => {
//         setDate(value); // Update the selected date
//     };

//     return (
//         <div className={styles.calendarContainer}>
//             <Calendar className={styles.reactcalendar} onChange={onChange} value={date} />
//         </div>
//     );
// };

// export default MyCalendar;


// Calendar.tsx
import React, { useState } from 'react';

import styles from './calender.module.css'; // Import CSS module for styling
import calenderImg from '../../images/Calendar.png'
const Calendar: React.FC = () => {


    return (
        <div className={styles.calendarContainer}>
        <img src={calenderImg} className={styles.img} />
        </div>
    );
};

export default Calendar;

