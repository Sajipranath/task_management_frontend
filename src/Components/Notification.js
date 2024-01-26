// In your React component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        console.log('authToken:', authToken);

        const response = await axios.get('http://localhost:5001/notification', {
          headers: {
            Authorization: authToken, 
          },
        });

        // Check if the response status is OK (2xx)
        if (response.status !== 200) {
          throw new Error('Failed to fetch notifications');
        }

        setNotifications(response.data.notifications);
        console.log('notfy', response);
        console.log('notfy', response.data.notifications);
        console.log('noti', response.data.notifications.map(notification => ({ id: notification._id, message: notification.message })));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification._id}>{notification.message}</li>
        ))}
      </ul> 
    </div>
  );
};

export default Notification;
