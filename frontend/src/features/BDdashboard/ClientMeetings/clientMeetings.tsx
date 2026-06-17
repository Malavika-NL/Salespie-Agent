import React from 'react';
import styles from './clientMeetings.module.css';
import MeetingCard from './meetingscard';

const ClientMeeting: React.FC = () => {
    const meetings = [
        {
            date: { month: 'OCT', day: '02' },
            title: 'Client Meeting',
            description: 'Meeting with manager',
            time: { start: '09:45', end: '12:00' },
            location: 'Bhiwadi, Rajasthan',
            attendees: ['avatar1.png', 'avatar2.png'], // Replace with actual paths or URLs
            priority: 'PRIORITY'
        },
        {
            date: { month: 'OCT', day: '15' },
            title: 'Project Review',
            description: 'Reviewing project progress',
            time: { start: '10:00', end: '11:30' },
            location: 'Gurgaon, Haryana',
            attendees: ['avatar3.png', 'avatar4.png'],
            priority: 'HIGH'
        },
        {
            date: { month: 'OCT', day: '02' },
            title: 'Client Meeting',
            description: 'Meeting with manager',
            time: { start: '09:45', end: '12:00' },
            location: 'Bhiwadi, Rajasthan',
            attendees: ['avatar1.png', 'avatar2.png'], // Replace with actual paths or URLs
            priority: 'PRIORITY'
        },
        {
            date: { month: 'OCT', day: '15' },
            title: 'Project Review',
            description: 'Reviewing project progress',
            time: { start: '10:00', end: '11:30' },
            location: 'Gurgaon, Haryana',
            attendees: ['avatar3.png', 'avatar4.png'],
            priority: 'HIGH'
        }
        // Add more meetings as needed
    ];

    return (
      <div className={styles.container}>
         <div className={styles.head}>Reminder</div>
         <hr />
         <div  className={styles.content}>
            {meetings.map((meeting, index) => (
                <div key={index} className={styles.meetingBox}>
                    <MeetingCard {...meeting} />
                </div>
            ))}
        </div>
      </div>
       
    );
};

export default ClientMeeting;
