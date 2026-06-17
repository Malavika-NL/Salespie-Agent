import React, { useState } from 'react';
import Card from './Card.module.css';
import { Link } from 'react-router-dom';

const CardStack: React.FC = () => {
    const [startIndex, setStartIndex] = useState(0);
    const cards = [
        { pendingOrders: 25, dispatchedOrders: 10, newOrderRequests: 15 },
        { pendingOrders: 30, dispatchedOrders: 12, newOrderRequests: 18 },
        { pendingOrders: 20, dispatchedOrders: 8, newOrderRequests: 10 }
    ];
    const colors = ['#00183F', '#FFD300', '#D73E3E'];

    const handleLeftButtonClick = () => {
        setStartIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
    };

    const handleRightButtonClick = () => {
        setStartIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className={Card.container}>
            <div className={Card.key}>Key SnapShorts</div>
            <div className={Card.stack}>
                {cards.map((card, index) => {
                    const adjustedIndex = (startIndex + index) % cards.length;
                    return (
                        <div key={adjustedIndex} className={Card.card} style={{ backgroundColor: colors[adjustedIndex] }}>
                            <div className={Card.content}>
                                <h2>Order Status</h2>
                                <h3>{cards[adjustedIndex].pendingOrders}</h3>
                                <p>Pending Orders</p>
                                <hr />
                                <h3>{cards[adjustedIndex].dispatchedOrders}</h3>
                                <p>Dispatched Orders</p>
                                <hr />
                                <h3>{cards[adjustedIndex].newOrderRequests}</h3>
                                <p>New Order Request</p>
                            </div>
                            <button className={Card.arrowleft} onClick={handleLeftButtonClick}>
                                <svg enableBackground="new 0 0 15 26" height="26px" viewBox="0 0 15 26" width="12px">
                                    <polygon fill="#231F20" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5 " />
                                </svg>
                            </button>
                            <button className={Card.arrowright} onClick={handleRightButtonClick}>
                                <svg enableBackground="new 0 0 15 25" height="26px" viewBox="0 0 15 26" width="12px">
                                    <polygon fill="#231F20" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5 " />
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className={Card.explore}>
                <Link to="/bddashboard" className={Card.link}>
                    <button className={Card.explorebutton}>
                        Explore more
                        <svg className={Card.right} enableBackground="new 0 0 15 26" height="30px" viewBox="0 0 15 26" width="15px">
                            <polygon fill="#ffffff" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5 " />
                        </svg>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default CardStack;
