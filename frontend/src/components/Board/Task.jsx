import React from 'react';

const Task = ({ task }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
      <h3 className="font-medium">{task.title}</h3>
      <p className="text-gray-600 text-sm">{task.description}</p>
      <p className="text-gray-500 text-xs">Created at: {task.created}</p>
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
          Delete
        </button>
        <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
          Edit
        </button>
        <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
          View Details
        </button>
      </div>
    </div>
  );
}

export default Task;