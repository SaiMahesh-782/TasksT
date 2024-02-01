// TaskState.js
import React, { useState, useEffect } from 'react';
import TaskContext from './TaskContext';

const TaskState = (props) => {
  const host = "https://taskbackend-1792.onrender.com/";
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const res = await fetch(`${host}/api/Tasks/getTasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
      });

      if (res.ok) {
        const tasksData = await res.json();
        setTasks(tasksData);
      } else {
        console.error('Error getting tasks:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error getting tasks:', error.message);
    }
  };

  const addTask = async (title, description, assignedto, deadline) => {
    try {
      const res = await fetch(`${host}/api/Tasks/addTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, assignedto, deadline }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
      } else {
        console.error('Error adding task:', res.statusText);
      }
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${host}/api/Tasks/deleteTask/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
      });

      const json = await res.json();
      console.log(json);

      if (res.ok) {
        const newTasks = tasks.filter((task) => task._id !== taskId);
        setTasks(newTasks);
      } else {
        console.error('Error deleting task:', res.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const editTask = async (id, title, description, assignedto, deadline, status) => {
    try {
      const res = await fetch(`${host}/api/Tasks/updateTask/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, assignedto, deadline, status }),
      });

      if (res.ok) {
   
        setTasks((prevTasks) => {
          return prevTasks.map((task) =>
            task._id === id ? { ...task, title,  description, assignedto, deadline, status } : task
          );
        });
      } else {
        console.error('Error updating task:', res.statusText);
      }
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

 

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, editTask, getTasks }}>
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskState;
