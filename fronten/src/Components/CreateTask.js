import React, { useContext, useEffect, useState } from 'react';
import TaskContext from "../Context/Tasks/TaskContext";
import { MdAdd } from 'react-icons/md';

const AddTaskForm = () => {
  const context = useContext(TaskContext);
  const {  getTasks ,addTask} = context;
  const [users,setUsers] = useState([]);

  // Set the default status to "Pending"
  const defaultStatus = 'Pending';

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedto: '',
    deadline: '',
    status: defaultStatus, // Set the default status
  });

  useEffect(() => {
    getTasks();
  }, [getTasks]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/auth/getAllUsers', {
          method: 'GET',
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
        });
        const responseData = await response.json();
        setUsers(responseData);
        console.log(responseData)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddTask = async () => {
    try {
      if (!newTask.title || !newTask.description || !newTask.assignedto) {
        alert('Please fill in all fields');
        return;
      }

      const response = await fetch('http://localhost:4000/api/tasks/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const addedTask = await response.json();
        addTask(addedTask);
        setNewTask({
          title: '',
          description: '',
          assignedto: '',
          deadline: '',
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full md:w-1/2 lg:w-1/3 xl:w-2/4 p-4 bg-white shadow-lg rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Task</h1>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="assignedto" className="block text-sm font-medium text-gray-700">
            Assigned to
          </label>
          <select
            id="assignedto"
            name="assignedto"
            value={newTask.assignedto}
            onChange={handleInputChange}
            className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="" disabled>Select user</option>
            {users.map((user) => (
              <option key={user._id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"  // Change id to "deadline"
            name="deadline"  // Change name to "deadline"
            value={newTask.deadline}
            onChange={handleInputChange}
            className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>


        {/* Display the default status */}
        <p className="text-gray-700 mb-4 text-center">Status: {newTask.status}</p>

        <button onClick={handleAddTask} className="bg-blue-500 text-white p-3 rounded-md w-full">
          <MdAdd className="mr-2" />
          Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTaskForm;
