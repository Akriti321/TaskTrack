import { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiEdit3, FiPlus, FiSave } from 'react-icons/fi';

const initialForm = {
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '',
};

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

const TaskForm = ({ editingTask, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(() => {
    const draft = localStorage.getItem('task-draft');
    return draft ? { ...initialForm, ...JSON.parse(draft) } : initialForm;
  });
  const [titleTouched, setTitleTouched] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'Pending',
        priority: editingTask.priority || 'Medium',
        dueDate: toDateInput(editingTask.dueDate),
      });
      setTitleTouched(false);
    }
  }, [editingTask]);

  useEffect(() => {
    if (!editingTask) {
      localStorage.setItem('task-draft', JSON.stringify(form));
    }
  }, [editingTask, form]);

  const titleError = useMemo(
    () => (titleTouched && !form.title.trim() ? 'Task title is required.' : ''),
    [form.title, titleTouched],
  );

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTitleTouched(true);

    if (!form.title.trim()) return;

    await onSubmit({ ...form, title: form.title.trim() });

    if (!editingTask) {
      setForm(initialForm);
      localStorage.removeItem('task-draft');
      setTitleTouched(false);
    }
  };

  return (
    <form className="taskForm" onSubmit={handleSubmit}>
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{editingTask ? 'Refine task' : 'Create task'}</p>
          <h2>{editingTask ? 'Edit the plan' : 'Add focused work'}</h2>
        </div>
        <span className="panelIcon">{editingTask ? <FiEdit3 /> : <FiPlus />}</span>
      </div>

      <label>
        Title
        <input
          type="text"
          value={form.title}
          onBlur={() => setTitleTouched(true)}
          onChange={(event) => handleChange('title', event.target.value)}
          placeholder="Design dashboard states"
          maxLength={120}
        />
        {titleError ? <span className="fieldError">{titleError}</span> : null}
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Add details, acceptance criteria, or notes"
          maxLength={600}
          rows="5"
        />
        <span className="counter">{form.description.length}/600</span>
      </label>

      <div className="formGrid">
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) => handleChange('status', event.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={form.priority}
            onChange={(event) => handleChange('priority', event.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>

      <label>
        Due Date
        <span className="dateInput">
          <FiCalendar />
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => handleChange('dueDate', event.target.value)}
          />
        </span>
      </label>

      <div className="formActions">
        {editingTask ? (
          <button className="ghostButton" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button className="primaryButton" type="submit" disabled={loading}>
          <FiSave />
          {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
