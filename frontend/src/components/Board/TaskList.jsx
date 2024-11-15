import React from 'react';
import Task from './Task';

const TaskList = ({ title, tasks }) => {

  

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-2">
        {title}
      </div>
      <div className="p-4 space-y-4">
        {/* {tasks.map(task => (
          <Task key={task.id} task={task} />
        ))} */}
      </div>
    </div>
  );
}

export default TaskList;