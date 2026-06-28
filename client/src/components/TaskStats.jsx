import { motion } from 'framer-motion';
import { FiActivity, FiCheckCircle, FiClock, FiLayers } from 'react-icons/fi';

const statMeta = [
  { key: 'total', label: 'Total Tasks', icon: FiLayers },
  { key: 'pending', label: 'Pending', icon: FiClock },
  { key: 'progress', label: 'In Progress', icon: FiActivity },
  { key: 'completed', label: 'Completed', icon: FiCheckCircle },
];

const TaskStats = ({ stats }) => (
  <section className="statsGrid">
    {statMeta.map(({ key, label, icon: Icon }, index) => (
      <motion.article
        className="statCard"
        key={key}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07 }}
      >
        <span className={`statIcon statIcon-${key}`}>
          <Icon />
        </span>
        <div>
          <p>{label}</p>
          <motion.strong
            key={stats[key]}
            initial={{ scale: 0.88, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {stats[key]}
          </motion.strong>
        </div>
      </motion.article>
    ))}
  </section>
);

export default TaskStats;
