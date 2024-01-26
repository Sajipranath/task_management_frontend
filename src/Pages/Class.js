import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import Projectlist from '../Components/Projectlist';
import AddIcon from '@mui/icons-material/Add';
import ReplyIcon from '@mui/icons-material/Reply';
import Classcard from '../Components/Classcard';
import '../Styles/Navbutton.css';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const Class = (props) => {
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('projectId');
  const [userRole, setUserRole] = useState('');
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'projectManager';

  useEffect(() => {
  console.log('project id in class', projectId);

  // if (!location.state || !location.state.projectId) {
  //   //console.error('Project ID is missing in location state.');
  //   // Handle this case as needed, such as redirecting the user or showing an error message.
  //   return;
  // };
  const fetchUserRole = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        console.log('authToken:', authToken);

        const userRoleResponse = await axios.get('http://localhost:5001/auth/role', {
          headers: {
            Authorization: authToken,
          },
        });

        if (userRoleResponse.data && userRoleResponse.data.role) {
          setUserRole(userRoleResponse.data.role);
          console.log('userrole:', userRoleResponse.data.role);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchUserRole();

  // Use location.state.projectId as needed.
}, [projectId, location.state]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <button className='navButton' >
            <Link className='link' to={`/`}> Back to project</Link>  <ReplyIcon/>
          </button>
          {isManager ? (
          <button className='navButton' >
            <Link className='link' to={`/Create-class?projectId=${projectId}`}> Create New class</Link> 
           <AddIcon /> 
          </button>
          ) : null}
          {isAdmin ? (
          <button className='navButton' >
            <Link className='link' to="/Create-user"> Create User</Link>  
            <AddIcon />
          </button>
          ) : null}
          <Projectlist projectId={projectId} />
        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
          <Classcard projectId={projectId}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default Class;
