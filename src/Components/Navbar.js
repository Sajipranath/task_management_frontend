import React, { useState, useEffect } from 'react';
import '../Styles/Navbar.css';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Modal from './Modal';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [username, setUsername] = useState(null);
  const navigate =useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    console.log('authToken:', authToken);

    if (authToken) {
      axios.get('http://localhost:5001/auth/username', {
        headers: {
          Authorization: authToken,
        },
      })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error('Error fetching admin name:', error.message);
      });
    }
  }, []);

  const handleLogout = () => {
    // Implement logout logic, clear the token, redirect, etc.
    console.log('Before logout:', localStorage.getItem('authToken'));
  localStorage.removeItem('authToken');
  console.log('After logout:', localStorage.getItem('authToken'));
    navigate('/head')
  };

  return (
    <div className="navbar container-fluid">
      <div className="wrapper">
        <div className="logo-Title">
          <a href="#"><span>Task Manager</span></a>
        </div>
        <input type="radio" name="slider" id="menu-btn"/>
       <input type="radio" name="slider" id="close-btn"/>
        <ul className="nav-links">
          <label htmlFor="close-btn" className="btn close-btn"><CloseIcon/></label>
          {username ? (
            <>
              <li> <Link className='link'> {username}</Link></li>
              <li  onClick={handleLogout}> <Link className='link'>Logout</Link></li>
              <li ><Link className='link' onClick={openModal}>

                <NotificationsIcon/>
              </Link></li>
              <Modal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  contentLabel="Example Modal"
                >
                <h2>Modal Content</h2>
                <button className='link' onClick={closeModal}>hh<CloseIcon/></button>
                {/* <button onClick={closeModal}>Close Modal</button> */}
              </Modal>
            </>
          ) : (
            <>
              <li><Link className='link' to="/login">LogIn</Link></li>
              <li><Link className='link' to="/signUp">SignUp</Link></li>
            </>
          )}
        </ul>
        <label htmlFor="menu-btn" className="btn menu-btn"><MenuIcon/></label>
      </div>
    </div>
  );
}

export default Navbar;
