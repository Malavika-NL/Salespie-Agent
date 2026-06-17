import React, { useState } from 'react';
import styles from './response.module.css';

const Response: React.FC<{}> = ({}) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const data = [
    { id: 1, campaign: 'Campaign 1', company: 'Company A', date: '2024-08-01', response: 'Positive' },
    { id: 2, campaign: 'Campaign 2', company: 'Company B', date: '2024-08-02', response: 'Negative' },
    { id: 3, campaign: 'Campaign 3', company: 'Company C', date: '2024-08-03', response: 'Neutral' },
    { id: 1, campaign: 'Campaign 1', company: 'Company A', date: '2024-08-01', response: 'Positive' },
    { id: 2, campaign: 'Campaign 2', company: 'Company B', date: '2024-08-02', response: 'Negative' },
    { id: 3, campaign: 'Campaign 3', company: 'Company C', date: '2024-08-03', response: 'Neutral' },
  ];

  return (
    <div className={styles.manage}>
      <header className={styles.header}>
        <div className={styles.h2}>Response Management</div >
      </header>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Campaign</th>
            <th>Company</th>
            <th>Date</th>
            <th>Response</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.campaign}</td>
              <td>{item.company}</td>
              <td>{item.date}</td>
              <td>{item.response}</td>
              <td><button className={styles.editButton}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Response;
