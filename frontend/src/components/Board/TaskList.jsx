import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const TaskList = ({ title, tasks, listId, setTaskLists }) => {
  console.log(tasks);

  return (
    <Droppable droppableId={String(listId)}>
      {(provided) => (
        <div 
          ref={provided.innerRef} 
          {...provided.droppableProps} 
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="bg-blue-600 text-white px-4 py-2">
            {title}
          </div>
          <div className="p-4 space-y-4">
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task task={task} setTaskLists={setTaskLists}/>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
