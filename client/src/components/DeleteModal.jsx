import { motion } from 'framer-motion';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';

const DeleteModal = ({ task, onClose, onConfirm, loading }) => {
  if (!task) return null;

  return (
    <div className="modalOverlay" role="presentation">
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <button className="modalClose" type="button" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        <span className="modalIcon">
          <FiAlertTriangle />
        </span>
        <h2>Delete this task?</h2>
        <p>
          "{task.title}" will be permanently removed from your tracker.
        </p>
        <div className="modalActions">
          <button className="ghostButton" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="deleteConfirm"
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            <FiTrash2 />
            {loading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteModal;
