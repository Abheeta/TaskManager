import React, { useState } from 'react';

const EditTaskModal = ({ task, onClose, tasklists }) => {
  const [title, setTitle] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [selectedTasklist, setSelectedTasklist] = useState(task?.tasklistId || ""); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isLoading) return;

    if (task) {
      const updatedTask = await updateTask();
      onClose(updatedTask);
    } else {
      const createdTask = await createTask();
      onClose(createdTask);
    }
  };

  const updateTask = async () => {
    setIsLoading(true);

    // Build the update payload only with changed fields
    const updatePayload = {};
    if (title !== task.name) updatePayload.name = title;
    if (description !== task.description) updatePayload.description = description;

    if (Object.keys(updatePayload).length === 0) {
      // If no fields have changed, simply return
      setIsLoading(false);
      return task;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        return data?.task;
      } else {
        setIsLoading(false);
        console.error('Failed to update task');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating task:', error);
    }
  };

  const createTask = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: title, description, tasklistId: selectedTasklist }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        return data?.task;
      } else {
        setIsLoading(false);
        console.error('Failed to create task');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating task:', error);
    }
  };

  return (
    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{task ? "Edit" : "Add"} Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              placeholder="Description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {task ? null : (
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
          )}

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
              disabled={isLoading}
              className={`px-4 py-2 text-white ${isLoading ? "bg-blue-800" : "bg-blue-600"} rounded hover:bg-blue-700 transition-colors`}
            >
              {task ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;