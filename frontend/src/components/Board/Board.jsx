import React, { useState, useEffect } from "react";
import { DragDropContext } from 'react-beautiful-dnd';
import ControlPanel from "./ControlPanel.jsx";
import TaskList from "./TaskList.jsx";
import { useCurrentUser } from "../UserContext.jsx";

const Board = () => {
  const { currentUser } = useCurrentUser();
  const [tasklists, setTaskLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const fetchTaskLists = async (sort, search) => {
    console.log("SS:", sort, search)
    setIsLoading(true);

    let url = `${import.meta.env.VITE_BACKEND_URL}/tasklist?`;

    // Add sort query parameter if available
    if (sort) {
      url += `sortBy=${sort}&`;
    }
  
    // Add search query parameter if available
    if (search) {
      url += `search=${encodeURIComponent(search)}&`;
    }
  
  
    try {
      const response = await fetch(url, {credentials: 'include'});
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

  const onDragEnd = async (result) => {
    if (!result.destination) return; // If no destination, do nothing
  
    const { source, destination, draggableId: taskId } = result;
 
    let updatedTaskLists, destinationTaskId;
  
    // Handle dragging between different lists
    if (source.droppableId !== destination.droppableId) {
      const sourceList = tasklists.find(list => list._id === source.droppableId);
      const destList = tasklists.find(list => list._id === destination.droppableId);
  
      // Remove the task from the source list
      const sourceTasks = Array.from(sourceList.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
  
      // Add the task to the destination list before the destinationTaskId
      const destTasks = Array.from(destList.tasks);
      destinationTaskId = destination.index !== null
        ? destTasks[destination.index]?._id
        : null;
  
      if (destinationTaskId) {
        const destIndex = destTasks.findIndex(task => task._id.toString() === destinationTaskId);
        destTasks.splice(destIndex, 0, movedTask);
      } else {
        // If no destination task ID (e.g., drop at the end), push the task
        destTasks.push(movedTask);
      }
  
      // Update both lists
      updatedTaskLists = tasklists.map(list => {
        if (list._id === source.droppableId) {
          return { ...list, tasks: sourceTasks };
        } else if (list._id === destination.droppableId) {
          return { ...list, tasks: destTasks };
        } else {
          return list;
        }
      });
  
    } else {
      // Handle reordering within the same list
      const list = tasklists.find(list => list._id === source.droppableId);
      const reorderedTasks = Array.from(list.tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
  
      destinationTaskId = destination.index !== null
        ? reorderedTasks[destination.index]?._id
        : null;
  
      if (destinationTaskId) {
        const destIndex = reorderedTasks.findIndex(task => task._id.toString() === destinationTaskId);
        reorderedTasks.splice(destIndex, 0, movedTask);
      } else {
        // If no destination task ID (e.g., drop at the end), push the task
        reorderedTasks.push(movedTask);
      }
  
      updatedTaskLists = tasklists.map(l => {
        if (l._id === source.droppableId) {
          return { ...l, tasks: reorderedTasks };
        }
        return l;
      });
    }
  
    // Optimistic update: immediately update the UI
    setTaskLists(updatedTaskLists);
  
    try {
      // Make an API call to persist the changes on the server
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sourceListId: source.droppableId,
          destListId: destination.droppableId,
          taskId,
          destinationTaskId,
        }),
      });

      if(!response.ok) {
        setTaskLists(tasklists);
      }
    } catch (error) {
      console.error('Error updating task order:', error);
      setTaskLists(tasklists); // Rollback on error
    }
  };  

  useEffect(() => {
    fetchTaskLists(sort, search);
  }, [currentUser._id, sort, search]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <ControlPanel
            tasklists={tasklists}
            setTaskLists={setTaskLists}
            setSearch={setSearch}
            setSort={setSort}
          />
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
                  setTaskLists={setTaskLists}
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
