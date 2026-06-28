import { motion } from 'framer-motion';
import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';

const formatDate = (date) => {
  if (!date) return 'No due date';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

const TaskCard = ({ task, onEdit, onDelete }) => (
  <motion.article
    className="taskCard"
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    whileHover={{ y: -4 }}
  >
    <div className="taskCardTop">
      <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      <span className={`badge status-${task.status.toLowerCase().replaceAll(' ', '-')}`}>
        {task.status}
      </span>
    </div>

    <h3>{task.title}</h3>
    <p className="taskDescription">
      {task.description || 'No description added yet.'}
    </p>

    <div className="taskMeta">
      <span>
        <FiCalendar />
        Due {formatDate(task.dueDate)}
      </span>
      <span>Created {formatDate(task.createdAt)}</span>
    </div>

    <div className="taskActions">
      <button type="button" onClick={() => onEdit(task)} title="Edit task">
        <FiEdit2 />
        Edit
      </button>
      <button
        className="dangerButton"
        type="button"
        onClick={() => onDelete(task)}
        title="Delete task"
      >
        <FiTrash2 />
        Delete
      </button>
    </div>
  </motion.article>
);

export default TaskCard;
