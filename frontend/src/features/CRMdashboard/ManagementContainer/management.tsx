import React, { useState } from 'react';
import styles from './manage.module.css';

const Manage: React.FC<{}> = ({}) => {
  const [selectedOption, setSelectedOption] = useState('Sales Power Plus');
  const [selectedDate, setSelectedDate] = useState('');

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const data = [
    { id: 1, campaign: 'Campaign 1', send: '1000', delivered: '950', reply: '100', failed: '50', lead: '10' },
    { id: 2, campaign: 'Campaign 2', send: '2000', delivered: '1800', reply: '200', failed: '200', lead: '20' },
    { id: 3, campaign: 'Campaign 3', send: '1500', delivered: '1400', reply: '150', failed: '100', lead: '15' },
    { id: 1, campaign: 'Campaign 1', send: '1000', delivered: '950', reply: '100', failed: '50', lead: '10' },
    { id: 2, campaign: 'Campaign 2', send: '2000', delivered: '1800', reply: '200', failed: '200', lead: '20' },
    { id: 3, campaign: 'Campaign 3', send: '1500', delivered: '1400', reply: '150', failed: '100', lead: '15' },
  ];

  return (
    <div className={styles.manage}>
      <header className={styles.header}>
        <div className={styles.h2}>Campaign Management</div>
        <div className={styles.controls}>
          <select value={selectedOption} onChange={handleOptionChange} className={styles.dropdown}>
            <option value="Sales Power Plus">Sales Power Plus</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
          <input
            type="date"
            className={styles.dateSelector}
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Select Date"
          />
        </div>
      </header>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Campaign</th>
            <th>Send</th>
            <th>Delivered</th>
            <th>Reply</th>
            <th>Failed</th>
            <th>Lead</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.campaign}</td>
              <td>{item.send}</td>
              <td>{item.delivered}</td>
              <td>{item.reply}</td>
              <td>{item.failed}</td>
              <td>{item.lead}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Manage;
