import React from 'react';
import styles from './meetingscard.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';

interface MeetingCardProps {
    date: {
        month: string;
        day: string;
    };
    title: string;
    description: string;
    time: {
        start: string;
        end: string;
    };
    location: string;
    attendees: string[];
    priority: string;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ date, title, description, time, location, attendees, priority }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.date}>
                    <div className={styles.month}>{date.month}</div>
                    <div className={styles.day}>{date.day}</div>
                </div>
                <div className={styles.details}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}><span className={styles.dot}></span>{description}</p>
                </div>
                <button className={styles.markAsRead}>Mark as Read</button>
                <BiDotsVerticalRounded className={styles.menuIcon} />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.body}>
                <div className={styles.time}>
                    <span className={styles.timeText}>{time.start} <span className={styles.ampm}>AM</span></span>
                    <span className={styles.arrow}>&gt;</span>
                    <span className={styles.timeText}>{time.end} <span className={styles.ampm}>PM</span></span>
                </div>
                <div className={styles.location}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    <span>{location}</span>
                </div>
                {/* <div className={styles.attendees}>
                    {attendees.map((attendee, index) => (
                        <img key={index} src={attendee} alt="Attendee" className={styles.avatar} />
                    ))}
                </div> */}
                {/* <div className={styles.priority}>
                    <span className={styles.priorityBadge}>{priority}</span>
                    <div className={styles.priorityBar}></div>
                </div> */}
            </div>
        </div>
    );
};

export default MeetingCard;
