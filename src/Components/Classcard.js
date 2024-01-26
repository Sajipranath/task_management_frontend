import React, { useState, useEffect } from 'react';
import '../Styles/Classcard.css';
import axios from 'axios';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Link } from 'react-router-dom';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Classcard({ projectId }) {
  const [classes, setClasses] = useState([]);
  const [userRole, setUserRole] = useState('');
  const isManager = userRole === 'projectManager';

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        console.log('authtiken',authToken);
        console.log('projectID',projectId);
        const response = await axios.get(`http://localhost:5001/class/${projectId}`, {
          headers: {
            Authorization: authToken,
          },
        });
        console.log('class:',response.data.classes)
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5001/auth/role', {
          headers: {
            Authorization: authToken,
          },
        });

        if (response.data && response.data.role) {
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchClasses();
    fetchUserRole();
  }, [projectId]);

  const deleteClass = async (classId) => {
    try {
      if (userRole !== 'projectManager') {
        toast.warning("Only project managers can remove classes.",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        })
        return;
      }

      const isConfirmed = window.confirm('Are you sure you want to delete this class?');

      // If the user clicks "Cancel", do nothing
      if (!isConfirmed) {
        return;
      }

      

      const managerToken = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5001/class/${projectId}/${classId}/deleteclass`, {
        headers: {
          Authorization: managerToken,
        },
      });

       toast.success("Class removed",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      
      // Update the state after deletion
      setClasses((prevClasses) => prevClasses.filter((classItem) => classItem._id !== classId));
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error("Error occured in deleting class",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });      
    }
  };

  if (!classes || classes.length === 0) {
    return <p style={{fontSize:'38px'}}>No class has been created yet..</p>;
  }

  return (
    <div>
      {classes.map((currentClass) => (
        <div key={currentClass._id} className={currentClass.name}>
          <div className="card-container">
            <div className="card-columns">
              <div className="card">
                <div className="position-relative"></div>
                <div className="card-body">
                  <div className="del-icon" onClick={() => deleteClass(currentClass._id)}>
                    <DeleteIcon />
                  </div>
                  <h5 className="card-title">{currentClass.name}</h5>
                  
                  <hr />
                  <p className="card-text">Created by: {currentClass.createdBy_ProjectManager.username}</p>
                </div>
                <div className="card-footer">
                  <div className="footerleft">On progress</div>
                  <div className="footerright">
                   {isManager ? ( 
                    <div>
                        <Link className='link' to={`/Update-class?projectId=${projectId}&classId=${currentClass._id}`}> 
                          <SettingsSuggestIcon onClick={() => console.log('Update-class projectId:', projectId, 'classId:', currentClass._id)} />
                        </Link> 
                    </div>
                   ): null}
                  {isManager ? (
                    <div>
                          <Link className='link' to={`/Add-user?projectId=${projectId}&classId=${currentClass._id}`}> 
                            <PersonAddIcon onClick={() => console.log('Add-user projectId:', projectId, 'classId:', currentClass._id)} />
                          </Link> 
                    </div>
                    ): null}
                    {/* <div>
                      <Link to={`/Remove-manager?projectId=${projectId}&classId=${currentClass._id}`}>
                        <PersonRemoveIcon onClick={() => console.log('Remove-manager projectId:', projectId, 'classId:', currentClass._id)} />
                      </Link>
                    </div> */}
                    <div>
                      <Link to={{
                              pathname: '/task',
                              search: `?projectId=${projectId}&classId=${currentClass._id}`,
                            }}>
                              <ArrowRightAltIcon onClick={() => console.log('cardtotask projectId:', projectId, 'cardtotask classId:', currentClass._id)}/>
                            </Link>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Classcard;
