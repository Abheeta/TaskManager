import React, { useState } from 'react';

const DeleteTaskModal = ({ task, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${task._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        onClose(data.message);
      } else {
        setIsLoading(false);
        console.error('Failed to delete the task');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Task</h2>
        <p>Are you sure you want to delete this task?</p>
        <p className="italic text-gray-600">{task.name}</p>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
