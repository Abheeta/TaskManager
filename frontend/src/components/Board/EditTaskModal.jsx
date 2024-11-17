import React, { useState } from 'react';

const EditTaskModal = ({ task, onClose, tasklists }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [selectedTasklist, setSelectedTasklist] = useState(task?.tasklistId || ""); 
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle update logic, including updating tasklist if necessary
    // For example, you could update the task with selectedTasklist value
    createTask();
    onClose();
  };

  const createTask = async () => {
      setIsLoading(true); // Start loading
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name:title, description, tasklistId: selectedTasklist }),
            credentials: 'include'
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Failed to fetch tasklists');
        }
      } catch (error) {
        console.error('Error fetching tasklists:', error);
      } finally {
        setIsLoading(false); // Stop loading
    };  
  
  }


  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Tasklist</label>
            <select
              name="tasklist"
              value={selectedTasklist}
              onChange={e => setSelectedTasklist(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Tasklist</option>
              {tasklists.map((tasklist) => (
                <option key={tasklist._id} value={tasklist._id}>
                  {tasklist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
