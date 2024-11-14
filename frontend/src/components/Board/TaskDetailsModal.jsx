import React from 'react';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Task Details</h2>
        </div>
        
        <div className="space-y-2">
          <div>
            <label className="font-medium">Title:</label>
            <p>{task.title}</p>
          </div>
          
          <div>
            <label className="font-medium">Description:</label>
            <p className="text-gray-600">{task.description}</p>
          </div>
          
          <div>
            <label className="font-medium">Created at:</label>
            <p className="text-gray-600">{task.created}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex justify-end border-t">
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TaskDetailsModal;