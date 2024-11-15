import React, { useState, useEffect } from "react";
import ControlPanel from "./ControlPanel.jsx";
import TaskList from "./TaskList.jsx";
import { useCurrentUser } from "../UserContext.jsx";

const Board = () => {
  const { currentUser } = useCurrentUser();
  
  const [tasklists, setTaskLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchTaskLists = async () => {
    setIsLoading(true); // Start loading
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasklist?userId=${currentUser._id}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTaskLists(data.tasklists); // Set tasklists after fetch completes
      } else {
        console.error('Failed to fetch tasklists');
      }
    } catch (error) {
      console.error('Error fetching tasklists:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  useEffect(() => {
    fetchTaskLists();
  }, [currentUser._id]); // Re-fetch when currentUser._id changes
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <ControlPanel />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
          {
            isLoading ? (
              <div className="flex justify-center items-center">
                <span>Loading...</span>
                {/* You can replace this with a spinner if you want */}
              </div>
            ) : (
              tasklists.map(tasklist => (
                  <TaskList key={tasklist._id} title={tasklist.name}  />
              ))
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Board;
