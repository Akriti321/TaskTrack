import { AnimatePresence } from 'framer-motion';
import EmptyState from './EmptyState';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (!tasks.length) {
    return <EmptyState />;
  }

  return (
    <section className="taskGrid">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </section>
  );
};

export default TaskList;
