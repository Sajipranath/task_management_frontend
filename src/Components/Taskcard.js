import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Classcard.css';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Taskcard({ projectId, classId }) {
  const [tasks, setTasks] = useState([]);
  const [userRole, setUserRole] = useState('');
  const isMember = userRole === 'member';
  const isManager =userRole === 'projectManager';
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('projectID',projectId);
        console.log('classId',classId);
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5001/class/${projectId}/${classId}/getTasks`, {
          headers: {
            Authorization: authToken,
          },
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching task details:', error);
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

    fetchTasks();
    fetchUserRole();
  }, [projectId]);

   const deleteTask = async (taskId) => {
    try {
      if (userRole !== 'member') {
        toast.warning("Only  User can remove task.",{
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
      const authToken = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5001/class/${projectId}/${classId}/${taskId}/delete`, {
        headers: {
          Authorization: authToken,
        },
      });
      toast.success("Task removed",{
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
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }

    };

   const handleStatusChange = async (taskId, newStatus) => {
    try {
      console.log('Updating task status. Task ID:', taskId, 'New Status:', newStatus);

      const authToken = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:5001/tasks/${projectId}/${classId}/${taskId}/updateTaskStatus`,
        { status: newStatus },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      // Update the task status in the local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast.success('Task status updated successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="card-container">
      <div className="card-columns">
        {tasks.map((task) => (
          <div className="card" key={task._id}>
            <div className="position-relative"></div>
            <div className="card-body">
              <div className="del-icon" onClick={() => deleteTask(task._id)}>
                <DeleteIcon />
              </div>
              <h5 className="card-title">{task.title}</h5>
              <h5 className="card-text">{task.description}</h5>
              <h5 className="card-text1">Due Date: {task.dueDate}</h5>
            <hr />
            </div>
            <div className="card-footer">
              <div className="footerleft">
                 <div class="select">
                  {isMember ? (
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="inProgress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    ) : (
                      
                    <select  value={task.status}
                          onMouseDown={() => toast.warning('Only user can update task.')}
                          
                        >
                          <option value={task.status}>{task.status}</option>
                        </select>
                    )}
                  </div>
              </div>
              <div className="footerright">
                 {isMember ? (
                <div>
                  <Link  to={{pathname: '/update-task',search: `?projectId=${projectId}&classId=${classId}&taskId=${task._id}`,}}>
                    <SettingsSuggestIcon  onClick={() => console.log('tasktoedit taskId:', task._id)}/>
                  </Link>
                </div>
                ): null }
                {isManager ? (
                <div>
                    <Link  to={{pathname: '/AddTask-user', search: `?projectId=${projectId}&classId=${classId}&taskId=${task._id}`}}>
                      <PersonAddIcon />
                    </Link>
                </div>
                ) : null}
                <div>
                  <Link to={{ pathname: '/taskviewer',
                              search: `?projectId=${projectId}&classId=${classId}&taskId=${task._id}`,
                            }}>
                    <ArrowRightAltIcon onClick={() => console.log('taskcardtoview taskId:', task._id)}/>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Taskcard;
