// Tasks.js

import React, { useState, useContext, useEffect } from 'react';
import TaskContext from "../Context/Tasks/TaskContext";
import { MdDelete, MdEdit } from 'react-icons/md';


const Tasks = () => {
  const context = useContext(TaskContext);
  const { tasks, getTasks, deleteTask, editTask } = context;
  const [users] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedto: '',
    deadline: '',
    status: 'Pending',
  });

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  
  const handleEditTask = (task) => {
    // Set the task details to the state for editing
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      assignedto: task.assignedto,
      deadline: task.deadline,
      status:task.status
    });
  };

  const handleUpdateTask = async () => {
    try {
      if (!newTask.title || !newTask.description || !newTask.assignedto||!newTask.status) {
        alert('Please fill in all fields');
        return;
      }

      await editTask(editingTask._id, newTask.title, newTask.description, newTask.assignedto, newTask.deadline,newTask.status);

      // Clear the editing state and reset the form
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        assignedto: '',
        deadline: '',
        status:'peending'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleCancelTask = () => {
    setEditingTask(null);
  };

  const renderStatusBadge = (status) => {
    let badgeClass = 'bg-gray-300';
    if (status === 'Started') {
      badgeClass = 'bg-yellow-400';
    } else if (status === 'Finished') {
      badgeClass = 'bg-green-500';
    }

    return (
      <span className={`px-2 py-1 rounded-md text-white ${badgeClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full md:w-1/2 lg:w-2/3 xl:w-3/4 p-4 mx-auto">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-4 mb-4 shadow-md rounded-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">{task.title}</h2>
            <p className="text-gray-600 mb-2">{task.description}</p>
            <p className="text-gray-700">assignee: {task.assignee.name}</p>
            <p className="text-gray-700">Deadline: {task.deadline}</p>
            <div className="mt-2">{renderStatusBadge(task.status)}</div>
          </div>
          <div className="flex items-center space-x-4 cursor-pointer">
            <p className="cursor-pointer" onClick={() => handleDeleteTask(task._id)}>
              <MdDelete />
            </p>
            <p className="cursor-pointer" onClick={() => handleEditTask(task)}>
              <MdEdit />
            </p>
          </div>
        </div>
      ))}

      {editingTask && (
        <div className="bg-white p-4 mb-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold mb-2">Edit Task</h2>
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
              className="mt-1 p-2 border rounded-md w-full"
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
              className="mt-1 p-2 border rounded-md w-full"
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
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Started">Started</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button onClick={handleUpdateTask} className="bg-blue-500 text-white p-2 rounded-md">
              Update Task
            </button>
            <button onClick={handleCancelTask} className="bg-gray-500 text-white p-2 rounded-md">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
