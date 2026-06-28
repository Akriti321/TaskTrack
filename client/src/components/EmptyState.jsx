import { motion } from 'framer-motion';
import { FiClipboard } from 'react-icons/fi';

const EmptyState = () => (
  <motion.div
    className="emptyState"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="emptyIllustration">
      <FiClipboard />
      <span />
      <span />
      <span />
    </div>
    <h2>No tasks found</h2>
    <p>Create a new task or adjust your search and filters.</p>
  </motion.div>
);

export default EmptyState;
