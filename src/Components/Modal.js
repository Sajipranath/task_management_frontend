import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import '../Styles/Modal.css';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const Modal = ({ isOpen, onClose }) => {
  
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
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-head">
            <h2 className="modal-title">Notifications</h2>
            <IconButton className="modal-close" onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </div>
        <div className="modal-content">
            {notifications.map(notification => (
                <div className="modal-message">
                    <p key={notification._id}>{notification.message}</p>
                </div>
        ))}
        </div>
    </div>
  );
};

export default Modal;
