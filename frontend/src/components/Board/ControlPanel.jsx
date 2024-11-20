import React, { useEffect, useState } from 'react';
import EditTaskModal from './EditTaskModal';
import ModalOverlay from '../ModalOverlay';

const ControlPanel = ({tasklists, setTaskLists, setSearch, setSort}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditTaskModelOpen, setisEditTaskModelOpen] = useState(false);
  const [sortOption, setSortOption] = useState(""); // Default to no sorting

  useEffect(() => {
    const searchDebounceTimeout = setTimeout(() => {
      setSearch(searchTerm);
    }, 1000);

    return () => clearTimeout(searchDebounceTimeout);
  }, [searchTerm]);

  useEffect(() => {
    // Only update sorting when sortOption is set
    if (sortOption !== null) {
      setSort(sortOption);
    } else {
      setSort(""); // No sort applied when sortOption is null
    }
  }, [sortOption, setSort]);

  const closeModal = (createdTask) => {
    setisEditTaskModelOpen(false);

    if (createdTask) {
      setTaskLists(currTaskLists => {
        const newTaskLists = [...currTaskLists];
        const taskListToAddTo = newTaskLists.find(taskList => taskList._id === createdTask.tasklist);
        taskListToAddTo.tasks.unshift(createdTask);

        return newTaskLists;
      });
    }
  };

  const openModal = () => {
    setisEditTaskModelOpen(true);
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    if (selectedSort === 'Recent') {
      setSortOption('createdAt_desc'); // Sort by recent (descending)
    } else if (selectedSort === 'Oldest') {
      setSortOption('createdAt_asc'); // Sort by oldest (ascending)
    } else {
      setSortOption(""); // No sorting
    }
  };

  return (
    <>
      {isEditTaskModelOpen && (
        <ModalOverlay onClose={closeModal}>
          <EditTaskModal
            openIndex={isEditTaskModelOpen}
            onClose={closeModal}
            tasklists={tasklists}
          />
        </ModalOverlay>
      )}
      <button 
        onClick={openModal}
        className="w-full md:w-auto bg-blue-600 text-white px-4 md:px-16 py-2 rounded-md hover:bg-blue-700">
        Add Task
      </button>

      <div className="w-full bg-white p-4 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="search" className="text-gray-700">Search:</label>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-700">Sort By:</label>
          <select
            value={sortOption === 'createdAt_desc' ? 'Recent' : (sortOption === 'createdAt_asc' ? 'Oldest' : '')} 
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">No Sort</option>
            <option value="Recent">Recent</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default ControlPanel;
