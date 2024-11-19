import { useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import TaskDetailsModal from './TaskDetailsModal';
import EditTaskModal from './EditTaskModal';
import DeleteTaskModal from './DeleteTaskModal';

const Task = ({ task, setTaskLists }) => {
  const [isViewDetailsModalOpened, setIsViewDetailsModalOpened] = useState(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);

  const openViewDetailsModal = (e) => {
    e.stopPropagation();
    setIsViewDetailsModalOpened(true);
  };

  const closeViewDetailsModal = () => {
    setIsViewDetailsModalOpened(false);
  };

  const openEditModal = (e) => {
    e.stopPropagation();
    setIsEditModalOpened(true);
  };

  const closeEditModal = (editedTask) => {
    setIsEditModalOpened(false);

    if(editedTask) {
      setTaskLists(currTaskLists => {
        const newTaskLists = [...currTaskLists];
        const taskListToEdit = newTaskLists.find(taskList => taskList._id === editedTask.tasklist);
        
        if (taskListToEdit) {
          const taskIndex = taskListToEdit.tasks.findIndex(task => task._id === editedTask._id);
          if (taskIndex !== -1) {
            taskListToEdit.tasks[taskIndex] = { ...editedTask };
          }
        }

        return newTaskLists;
      });
    }
  };


  const openDeleteModal = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpened(true);
  };

  const closeDeleteModal = (deleteTask) => {
    setIsDeleteModalOpened(false);

    if(deleteTask) {
      setTaskLists(currTaskLists => {
        const newTaskLists = currTaskLists.map(taskList => {
          if (taskList._id === task.tasklist) {
            return {
              ...taskList,
              tasks: taskList.tasks.filter(t => t._id !== task._id)
            };
          }
          return taskList;
        });

        return newTaskLists;
      });
    }
  };

  return (
    <>
      <div className="bg-blue-50 rounded-lg p-4 space-y-2">
        <h3 className="font-medium">{task.name}</h3>
        <p className="text-gray-600 text-sm">{task.description}</p>
        <p className="text-gray-500 text-xs">Created at: {task.created}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={openDeleteModal}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={openEditModal}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={openViewDetailsModal}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            View Details
          </button>
        </div>
      </div>

      {isViewDetailsModalOpened && (
        <ModalOverlay onClose={closeViewDetailsModal}>
          <TaskDetailsModal task={task} onClose={closeViewDetailsModal} />
        </ModalOverlay>
      )}
      {isEditModalOpened && (
        <ModalOverlay onClose={closeEditModal}>
          <EditTaskModal task={task} onClose={closeEditModal} />
        </ModalOverlay>
      )}
      {isDeleteModalOpened && (
        <ModalOverlay onClose={closeDeleteModal}>
          <DeleteTaskModal task={task} onClose={closeDeleteModal} />
        </ModalOverlay>
      )}
    </>
  );
};

export default Task;