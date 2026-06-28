import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DeleteModal from '../components/DeleteModal';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskStats from '../components/TaskStats';
import { taskApi } from '../services/api';

const priorityRank = { High: 3, Medium: 2, Low: 1 };

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    sort: 'newest',
  });
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('task-theme') === 'dark',
  );

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('task-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskApi.getAll();
        setTasks(response.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === 'Pending').length,
      progress: tasks.filter((task) => task.status === 'In Progress').length,
      completed: tasks.filter((task) => task.status === 'Completed').length,
    }),
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(term) ||
          (task.description || '').toLowerCase().includes(term);
        const matchesStatus = filters.status === 'All' || task.status === filters.status;
        const matchesPriority =
          filters.priority === 'All' || task.priority === filters.priority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (filters.sort === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (filters.sort === 'dueDate') {
          return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        }
        if (filters.sort === 'priority') {
          return priorityRank[b.priority] - priorityRank[a.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [filters, search, tasks]);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      if (editingTask) {
        const response = await taskApi.update(editingTask._id, payload);
        setTasks((current) =>
          current.map((task) => (task._id === editingTask._id ? response.data.data : task)),
        );
        setEditingTask(null);
        toast.success('Task updated');
      } else {
        const response = await taskApi.create(payload);
        setTasks((current) => [response.data.data, ...current]);
        toast.success('Task created');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Task could not be saved');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;

    try {
      setDeleting(true);
      await taskApi.remove(taskToDelete._id);
      setTasks((current) => current.filter((task) => task._id !== taskToDelete._id));
      toast.success('Task deleted');
      setTaskToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Task could not be deleted');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="appShell">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((value) => !value)}
        tasks={tasks}
      />

      <section className="heroBand">
        <div>
          <p className="eyebrow">Premium task control</p>
          <h2>Plan, prioritize, and ship with clarity.</h2>
        </div>
        
      </section>

      <TaskStats stats={stats} />

      <section className="workspace">
        <aside className="formColumn">
          <TaskForm
            editingTask={editingTask}
            onSubmit={handleSubmit}
            onCancel={() => setEditingTask(null)}
            loading={saving}
          />
        </aside>

        <section className="tasksColumn">
          <div className="toolbar">
            <SearchBar value={search} onChange={setSearch} />
            <FilterBar filters={filters} onChange={setFilters} />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <TaskList
              tasks={visibleTasks}
              onEdit={(task) => {
                setEditingTask(task);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={setTaskToDelete}
            />
          )}
        </section>
      </section>

      <DeleteModal
        task={taskToDelete}
        loading={deleting}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
};

export default Dashboard;
