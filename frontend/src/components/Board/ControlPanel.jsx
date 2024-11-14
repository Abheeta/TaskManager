import React, { useState } from 'react';

const ControlPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (<>
    <button className="w-full md:w-auto bg-blue-600 text-white px-4 md:px-16 py-2 rounded-md hover:bg-blue-700">
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
          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option>Recent</option>
          <option>Oldest</option>
        </select>
      </div>
    </div>
  </>);
}

export default ControlPanel;