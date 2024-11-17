import React, { useState, useEffect } from "react";
import { DragDropContext } from 'react-beautiful-dnd';
import ControlPanel from "./ControlPanel.jsx";
import TaskList from "./TaskList.jsx";
import { useCurrentUser } from "../UserContext.jsx";

const Board = () => {
  const { currentUser } = useCurrentUser();
  const [tasklists, setTaskLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTaskLists = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasklist`, {credentials: 'include'});
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTaskLists(data.tasklists);
      } else {
        console.error('Failed to fetch tasklists');
      }
    } catch (error) {
      console.error('Error fetching tasklists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceList = tasklists.find(list => list._id === source.droppableId);
      const destList = tasklists.find(list => list._id === destination.droppableId);
      
      const sourceTasks = Array.from(sourceList.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);

      const destTasks = Array.from(destList.tasks);
      destTasks.splice(destination.index, 0, movedTask);

      const updatedTaskLists = tasklists.map(list => {
        if (list._id === source.droppableId) {
          return { ...list, tasks: sourceTasks };
        } else if (list._id === destination.droppableId) {
          return { ...list, tasks: destTasks };
        } else {
          return list;
        }
      });

      setTaskLists(updatedTaskLists);
    } else {
      const list = tasklists.find(list => list._id === source.droppableId);
      const reorderedTasks = Array.from(list.tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);

      const updatedTaskLists = tasklists.map(l => {
        if (l._id === source.droppableId) {
          return { ...l, tasks: reorderedTasks };
        }
        return l;
      });

      setTaskLists(updatedTaskLists);
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, [currentUser._id]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <ControlPanel tasklists={tasklists} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <span>Loading...</span>
              </div>
            ) : (
              tasklists.map(tasklist => (
                <TaskList 
                  key={tasklist._id} 
                  listId={tasklist._id} 
                  title={tasklist.name} 
                  tasks={tasklist.tasks} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Board;
