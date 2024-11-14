import React, { useState } from "react";
import ControlPanel from "./ControlPanel.jsx";
import TaskList from "./TaskList.jsx";

const Board = () => {
  const [tasks] = useState({
    todo: [
      { id: 3, title: "Task 3", description: "Description 3", created: "01/09/2024, 05:30:00" },
      { id: 1, title: "Task 1", description: "Description 1", created: "01/09/2021, 05:30:00" },
      { id: 2, title: "Task 2", description: "Description 2", created: "01/09/2021, 05:30:00" },
    ],
    inProgress: [
      { id: 4, title: "Task 4", description: "Description 4", created: "01/09/2024, 05:30:00" },
      { id: 5, title: "Task 5", description: "Description 5", created: "01/09/2021, 05:30:00" },
    ],
    done: [
      { id: 6, title: "Task 6", description: "Description 6", created: "01/09/2021, 05:30:00" },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <ControlPanel />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
          <TaskList title="TODO" tasks={tasks.todo} />
          <TaskList title="IN PROGRESS" tasks={tasks.inProgress} />
          <TaskList title="DONE" tasks={tasks.done} />
        </div>
      </div>
    </div>
  );
}

export default Board;