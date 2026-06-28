import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCheckCircle,
  FiChevronDown,
  FiEdit3,
  FiLock,
  FiLogOut,
  FiMoon,
  FiSettings,
  FiSun,
  FiUser,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

const getDueNotifications = (tasks = []) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks
    .filter((task) => task.dueDate && task.status !== 'Completed')
    .map((task) => {
      const due = new Date(task.dueDate);
      const diffMs = due - now;
      const sameDay = due.toDateString() === now.toDateString();
      const isTomorrow = due.toDateString() === tomorrow.toDateString();

      if (diffMs < 0) return { task, label: 'Overdue' };
      if (diffMs <= 60 * 60 * 1000) return { task, label: 'Due within an hour' };
      if (sameDay) return { task, label: 'Due today' };
      if (isTomorrow) return { task, label: 'Due tomorrow' };
      return null;
    })
    .filter(Boolean);
};

const Navbar = ({ darkMode, onToggleDarkMode, tasks = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = useMemo(() => getDueNotifications(tasks), [tasks]);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  const displayName = user?.fullName || user?.name || 'User';

  return (
    <header className="navbar" ref={menuRef}>
      <Link className="brand brandLink" to="/">
        <span className="brandIcon">
          <FiCheckCircle />
        </span>
        <div>
          <p className="eyebrow">MERN Workspace</p>
          <h1>Task Tracker</h1>
        </div>
      </Link>

      <div className="navActions">
        <div className="notificationWrap">
          <button
            className="iconButton"
            type="button"
            onClick={() => {
              setNotificationsOpen((value) => !value);
              setMenuOpen(false);
            }}
            aria-label="Open notifications"
            title="Notifications"
          >
            <FiBell />
            {notifications.length ? <span className="notificationBadge">{notifications.length}</span> : null}
          </button>

          {notificationsOpen ? (
            <div className="notificationMenu">
              <div className="dropdownHeader">
                <strong>Due reminders</strong>
                <span>{notifications.length} unread</span>
              </div>
              {notifications.length ? (
                notifications.slice(0, 5).map(({ task, label }) => (
                  <div className="notificationItem" key={task._id}>
                    <strong>{task.title}</strong>
                    <span>{label} - {task.priority}</span>
                  </div>
                ))
              ) : (
                <p className="dropdownEmpty">No urgent due dates.</p>
              )}
            </div>
          ) : null}
        </div>

        <button
          className="iconButton hideMobile"
          type="button"
          onClick={onToggleDarkMode}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <div className="profileWrap">
          <button
            className="profileTrigger"
            type="button"
            onClick={() => {
              setMenuOpen((value) => !value);
              setNotificationsOpen(false);
            }}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="avatar">
              {user?.avatar ? <img src={user.avatar} alt="" /> : getInitials(displayName)}
            </span>
            <span className="profileName">{displayName}</span>
            <FiChevronDown />
          </button>

          {menuOpen ? (
            <div className="profileMenu" role="menu">
              <div className="profileMenuHeader">
                <span className="avatar avatarLarge">
                  {user?.avatar ? <img src={user.avatar} alt="" /> : getInitials(displayName)}
                </span>
                <div>
                  <strong>{displayName}</strong>
                  <span>{user?.email}</span>
                </div>
              </div>
              <Link to="/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                <FiUser /> My Profile
              </Link>
              <Link to="/profile?section=settings" role="menuitem" onClick={() => setMenuOpen(false)}>
                <FiSettings /> Account Settings
              </Link>
              <Link to="/profile?section=edit" role="menuitem" onClick={() => setMenuOpen(false)}>
                <FiEdit3 /> Edit Profile
              </Link>
              <Link to="/profile?section=password" role="menuitem" onClick={() => setMenuOpen(false)}>
                <FiLock /> Change Password
              </Link>
              <button type="button" role="menuitem" onClick={onToggleDarkMode}>
                {darkMode ? <FiSun /> : <FiMoon />} Toggle Theme
              </button>
              <button className="logoutItem" type="button" role="menuitem" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
