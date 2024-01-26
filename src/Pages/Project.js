import React, {useState, useEffect} from 'react';
import Projectcard from '../Components/Projectcard';
import Managerlist from '../Components/Managerlist';
import { Link } from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast} from 'react-toastify';
import '../Styles/Navbutton.css';
import Notification from '../Components/Notification';
//import SearchManager from '../Components/SearchManger';

function Project() {
 
 const [projects, setProjects] = useState([]);
 const [userRole, setUserRole] = useState('');
 const isAdmin = userRole === 'admin';

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      console.log('authToken:', authToken);

      const response = await axios.get('http://localhost:5001/projects/', {
        headers: {
          Authorization: authToken,
        },
      });
      console.log("response data", response.data.projects);
      setProjects(response.data.projects);

      const userRoleResponse = await axios.get('http://localhost:5001/auth/role', {
        headers: {
          Authorization: authToken,
        },
      });

      if (userRoleResponse.data && userRoleResponse.data.role) {
        setUserRole(userRoleResponse.data.role);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      console.error('Error fetching project details:', error);
    }
  };

  fetchProjects();
}, []);


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {isAdmin ? (
            <button className='navButton' >
                <Link className='link' to="/create-project"> Create Project</Link>  
                <AddIcon/>
          </button>
          ): null}
          {isAdmin ? (
          <button className='navButton' >
              <Link className='link' to="/Create-manager"> Create Manager</Link> 
               <AddIcon/>
          </button>
          ) : null}
          {isAdmin ? (
          <button className='navButton' >
            <Link className='link' to="/Create-user"> Create User</Link> 
             <AddIcon/>
          </button>
          ) : null}
          <Notification/>
         <Managerlist/>

        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
          <Projectcard/>
          {/* <Grid container spacing={2}>

            <Grid item xs={4}><Projectcard2/></Grid>
             <Grid item xs={4}>  <Classcard/></Grid>
          </Grid> */}
          {/* {projects.map((project) => (
            <Projectcard key={project._id} projects={projects} />
          ))} */}
          {/* <SearchManager/> */}
          
         
        </Grid>
      </Grid>
    </div>
  );
}

export default Project